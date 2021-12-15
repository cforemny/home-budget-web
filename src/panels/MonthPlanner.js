import React, {Component} from 'react';
import {Container, Input, Table} from 'reactstrap';
import AppNavBar from '../AppNavBar';
import Button from "reactstrap/es/Button";
import Form from "reactstrap/es/Form";

class MonthPlanner extends Component {

    category = {
        id: '',
        description: ''
    }

    plannedExpense = {
        description: '',
        value: '',
        category: '',
        insertDate: ''
    }

    constructor(props) {
        super(props);
        let today = new Date();
        this.state = {
            currentDate: today,
            expenseCategories: [],
            plannedExpenses: [],
            item: this.plannedExpense,
            month: today.getMonth() + 1,
            year: today.getFullYear()
        }
        this.handleExpenseDescriptionChange = this.handleExpenseDescriptionChange.bind(this);
        this.handleExpenseValueChange = this.handleExpenseValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getCategories();
        this.getPlannedExpenses(this.state.year, this.state.month);

    }

    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        await fetch('/planner/expenses',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
        this.setState({item: this.plannedExpense});
        this.getPlannedExpenses(this.state.year, this.state.month);
        document.getElementById('expensesForm').reset()
        this.props.history.push('/planner');
    }

    getCategories() {
        fetch('/categories/expense')
            .then(response => response.json())
            .then(data => this.setState({expenseCategories: data}));
    }

    getPlannedExpenses(year, month) {
        fetch('/planner/expenses?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({plannedExpenses: data}));
    }

    renderTableData(categoryId) {
        return this.state.plannedExpenses.map((plannedExpense) => {
            const {id, value, description, category} = plannedExpense
            if (categoryId === category.id) {
                return (
                    <tr key={id}>
                        <td>{description}</td>
                        <td>{value}</td>
                    </tr>
                )
            }
        })
    }

    handleExpenseDescriptionChange(event) {
        let item;
        const target = event.target;
        item = {
            value: this.state.item.value,
            description: target.value,
            insertDate: this.state.currentDate,
            category: {
                id: target.id
            }
        }
        this.setState({item});
    }

    handleExpenseValueChange(event) {
        let item;
        const target = event.target;
        item = {
            value: target.value,
            description: this.state.item.description,
            insertDate: this.state.currentDate,
            category: {
                id: target.id
            }
        }
        this.setState({item});
    }

    render() {
        const {expenseCategories} = this.state;
        const expenseCategoryList = expenseCategories.map(category => {
            return <tbody>
            <tr key={category.id}>
                <td>{category.description}</td>
            </tr>
            {this.renderTableData(category.id)}
            <tr>
                    <td>
                        <Input id={category.id} laceholder='Opis'
                               onChange={this.handleExpenseDescriptionChange}/>
                    </td>
                    <td>
                        <Input id={category.id} placeholder='Kwota'
                               onChange={this.handleExpenseValueChange}/>
                    </td>
                    <td>
                        <Button>Dodaj</Button>
                    </td>
            </tr>
            </tbody>
        });

        return (
            <div>
                <AppNavBar/>
                <h3>Planer wydatkow na {this.state.month}-{this.state.year}</h3>
                <Container>
                    <Form id='expensesForm' onSubmit={this.handleSubmit}>
                        <Table stripped hover className="mt-4">
                            <thead>
                            <tr>
                                <th> Opis/Kategoria</th>
                                <th> Planowana wysokość wydatku</th>
                            </tr>
                            </thead>
                            {expenseCategoryList}
                        </Table>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default MonthPlanner;