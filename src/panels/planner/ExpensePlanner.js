import React, {Component} from 'react';
import {Container, FormGroup, Input, Table} from 'reactstrap';
import Button from "reactstrap/es/Button";
import Form from "reactstrap/es/Form";
import Select from "react-select";
import axios from "axios";

class ExpensePlanner extends Component {

    category = {
        id: '',
        description: ''
    }

    plannedExpense = {
        id: '',
        description: '',
        value: '',
        category: '',
        insertDate: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            item: this.plannedExpense,
            plannedExpenses: [],
            expenseCategories: []
        }
        this.handleExpenseDescriptionChange = this.handleExpenseDescriptionChange.bind(this);
        this.handleExpenseValueChange = this.handleExpenseValueChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getPlannedExpenses(this.props.year, this.props.month)
        this.getExpenseCategories();
    }

    componentDidUpdate(prevState) {
        if (prevState.month !== this.props.month) {
            this.getPlannedExpenses(this.props.year, this.props.month)
            this.getExpenseCategories();
        }
    }

    async getExpenseCategories() {
        const res = await axios.get('/categories/expense')
        const data = res.data

        const options = data.map(d => ({
            "id": d.id,
            "description": d.description,
        }))
        this.setState({expenseCategories: options})
    }

    getSelectedOptions() {
        const data = this.state.expenseCategories

        return data.map(d => ({
            "value": d.id,
            "label": d.description,
        }))
    }

    getPlannedExpenses(year, month) {
        fetch('http://46.41.137.113/8090/planner/expenses?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({plannedExpenses: data}));
    }

    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        await fetch('http://46.41.137.113/8090/planner/expenses',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
        this.setState({item: this.plannedExpense});
        document.getElementById('expensesForm').reset()
        await this.getPlannedExpenses(this.props.year, this.props.month)
        await this.getExpenseCategories();
    }

    async remove(id) {
        await fetch(`/planner/expenses/` + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )
        this.getPlannedExpenses(this.props.year, this.props.month)
    }

    handleExpenseDescriptionChange(event) {
        let item;
        const target = event.target;
        let date = new Date();
        date.setMonth(this.props.month - 1)
        date.setFullYear(this.props.year)
        item = {
            value: this.state.item.value,
            description: target.value,
            insertDate: date,
            category: {
                id: this.state.item.category.id
            }
        }
        this.setState({item});
    }

    handleExpenseValueChange(event) {
        let item;
        const target = event.target;
        let date = new Date();
        date.setMonth(this.props.month - 1)
        date.setFullYear(this.props.year)
        item = {
            value: target.value,
            description: this.state.item.description,
            insertDate: date,
            category: {
                id: this.state.item.category.id
            }
        }
        this.setState({item});
    }

    handleCategoryChange(event) {
        let item;
        let date = new Date();
        date.setMonth(this.props.month - 1)
        date.setFullYear(this.props.year)
        item = {
            value: this.state.item.value,
            description: this.state.item.description,
            insertDate: date,
            category: {
                id: event.value
            }
        }
        this.setState({item});
    }

    renderTableData(categoryId) {
        return this.state.plannedExpenses.map((plannedExpense) => {
            const {id, value, description, category} = plannedExpense
            if (categoryId === category.id) {
                return (
                    <tr key={id}>
                        <td>{description}</td>
                        <td>{value}zł</td>
                        <td>
                            <Button size="sm" color="danger" onClick={() => this.remove(id)}>Usun</Button>
                        </td>
                    </tr>
                )
            } else {
                return null;
            }
        })
    }

    render() {
        const {item} = this.state;
        const {expenseCategories} = this.state;
        const expenseCategoryList = expenseCategories.map(category => {
            return <tbody key={category.description}>
            <tr key={category.id}>
                <td><strong>{category.description}</strong></td>
            </tr>
            {this.renderTableData(category.id)}
            </tbody>
        });

        return (
            <div>
                <br/>
                <Container>
                    <Form id='expensesForm'  onSubmit={this.handleSubmit}>
                        <FormGroup className = 'card p-3 bg-light' >
                            <h5>Nowy wydatek</h5>
                            <Input placeholder='Opis'
                                   onChange={this.handleExpenseDescriptionChange}/>
                            <Input placeholder='Kwota'
                                   onChange={this.handleExpenseValueChange}/>
                            <Select options={this.getSelectedOptions()}
                                    placeholder={item.category.description || 'Wybierz kategorie'}
                                    onChange={this.handleCategoryChange}/>
                            <Button size="sm">Dodaj</Button>
                        </FormGroup>
                        <br/>
                        <div className = 'card p-3 bg-light'>
                        <Table responsive hover>
                            <thead>
                            <tr>
                                <th> Opis/Kategoria</th>
                                <th> Planowana wysokość wydatku</th>
                                <th> Akcja</th>
                            </tr>
                            </thead>
                            {expenseCategoryList}
                        </Table>
                        </div>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default ExpensePlanner;