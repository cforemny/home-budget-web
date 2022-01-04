import React, {Component} from 'react';
import {Container, Input, Table} from 'reactstrap';
import Button from "reactstrap/es/Button";
import Form from "reactstrap/es/Form";

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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getPlannedIncomes(this.props.year, this.props.month)
        this.getIncomeCategories();
    }

    componentDidUpdate(prevState) {
        if(prevState.month !== this.props.month){
            this.getPlannedIncomes(this.props.year, this.props.month)
            this.getIncomeCategories();
        }
    }

    getIncomeCategories() {
        fetch('http://cypole.pl:8090/categories/income')
            .then(response => response.json())
            .then(data => this.setState({incomeCategories: data}));
    }

    getPlannedIncomes(year, month) {
        fetch('http://cypole.pl:8090/planner/incomes?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({plannedIncomes: data}));
    }

    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        await fetch('http://cypole.pl:8090/planner/incomes',
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
        this.getPlannedIncomes(this.props.year, this.props.month)
        this.getIncomeCategories();
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
                id: target.id
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
                id: target.id
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
        const incomesCategories = this.state.incomeCategories;
        const incomesCategoryList = incomesCategories.map(category => {
            return <tbody key={category.description}>
            <tr key={category.id}>
                <td><strong>{category.description}</strong></td>
            </tr>
            {this.renderTableData(category.id)}
            <tr key="incomeInputRow">
                <td>
                    <Input id={category.id} placeholder='Opis'
                           onChange={this.handleIncomeDescriptionChange}/>
                </td>
                <td>
                    <Input id={category.id} placeholder='Kwota'
                           onChange={this.handleIncomeValueChange}/>
                </td>
                <td>
                    <Button size="sm">Dodaj</Button>
                </td>
            </tr>
            </tbody>
        });

        return (
            <div>
                <Container>
                    <Form id='incomesForm' onSubmit={this.handleSubmit}>
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
                    </Form>
                </Container>
            </div>
        );
    }
}

export default IncomePlanner;