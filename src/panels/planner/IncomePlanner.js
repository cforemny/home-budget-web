import React, {Component} from 'react';
import {Container, FormGroup, Input, Table} from 'reactstrap';
import Button from "reactstrap/es/Button";
import Form from "reactstrap/es/Form";
import Select from "react-select";
import axios from "axios";

class IncomePlanner extends Component {

    category = {
        id: '',
        description: ''
    }

    plannedIncome = {
        id: '',
        description: '',
        value: '',
        category: '',
        insertDate: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            item: this.plannedIncome,
            plannedIncomes: [],
            incomeCategories: []
        }
        this.handleIncomeDescriptionChange = this.handleIncomeDescriptionChange.bind(this);
        this.handleIncomeValueChange = this.handleIncomeValueChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getPlannedIncomes(this.props.year, this.props.month)
        this.getIncomeCategories();
    }

    componentDidUpdate(prevState) {
        if (prevState.month !== this.props.month) {
            this.getPlannedIncomes(this.props.year, this.props.month)
            this.getIncomeCategories();
        }
    }

    async getIncomeCategories() {
        const res = await axios.get('/categories/income')
        const data = res.data

        const options = data.map(d => ({
            "id": d.id,
            "description": d.description,
        }))
        this.setState({incomeCategories: options})
    }

    getSelectedOptions() {
        const data = this.state.incomeCategories

        return data.map(d => ({
            "value": d.id,
            "label": d.description,
        }))
    }

    getPlannedIncomes(year, month) {
        fetch('/planner/incomes?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({plannedIncomes: data}));
    }

    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        await fetch('/planner/incomes',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
        this.setState({item: this.plannedIncome})
        document.getElementById('incomesForm').reset()
        await this.getPlannedIncomes(this.props.year, this.props.month)
        await this.getIncomeCategories();
    }

    async remove(id) {
        await fetch(`/planner/incomes/` + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )
        this.getPlannedIncomes(this.props.year, this.props.month)
    }

    handleIncomeDescriptionChange(event) {
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

    handleIncomeValueChange(event) {
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
        return this.state.plannedIncomes.map((plannedIncome) => {
            const {id, value, description, category} = plannedIncome
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
        const {incomeCategories} = this.state;
        const incomesCategoryList = incomeCategories.map(category => {
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
                    <Form id='incomesForm' onSubmit={this.handleSubmit}>
                        <FormGroup className='card p-3 bg-light'>
                            <h5>Nowy przychod</h5>
                            <Input placeholder='Opis'
                                   onChange={this.handleIncomeDescriptionChange}/>
                            <Input placeholder='Kwota'
                                   onChange={this.handleIncomeValueChange}/>
                            <Select options={this.getSelectedOptions()}
                                    placeholder={item.category.description || 'Wybierz kategorie'}
                                    onChange={this.handleCategoryChange}/>
                            <Button size="sm">Dodaj</Button>
                        </FormGroup>
                        <br/>
                        <div className='card p-3 bg-light'>
                            <Table hover className="mt-4">
                                <thead>
                                <tr>
                                    <th> Opis/Kategoria</th>
                                    <th> Planowana wysokość przychodu</th>
                                    <th>Akcja</th>
                                </tr>
                                </thead>
                                {incomesCategoryList}
                            </Table>
                        </div>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default IncomePlanner;