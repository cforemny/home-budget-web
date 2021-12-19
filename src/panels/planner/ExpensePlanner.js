import React, {Component} from 'react';
import {Container, Input, Table} from 'reactstrap';
import Button from "reactstrap/es/Button";
import Form from "reactstrap/es/Form";

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
        let today = new Date();
        this.state = {
            currentDate: today,
            item: this.plannedExpense,
            expenseSummary: 0
        }
        this.handleExpenseDescriptionChange = this.handleExpenseDescriptionChange.bind(this);
        this.handleExpenseValueChange = this.handleExpenseValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        document.getElementById('expensesForm').reset()
        window.location.reload(false);
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
        window.location.reload(false);
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

    renderTableData(categoryId) {
        return this.props.plannedExpenses.map((plannedExpense) => {
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
            }
        })
    }

    render() {
        const {expenseCategories} = this.props;
        const expenseCategoryList = expenseCategories.map(category => {
            return <tbody>
            <tr key={category.id}>
                <td bold>{category.description}</td>
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
                    <Button size="sm">Dodaj</Button>
                </td>
            </tr>
            </tbody>
        });

        return (
            <div>
                <Container>
                    <Form id='expensesForm' onSubmit={this.handleSubmit}>
                        <Table stripped hover className="mt-4">
                            <thead>
                            <tr>
                                <th> Opis/Kategoria</th>
                                <th> Planowana wysokość wydatku</th>
                                <th>Akcja</th>
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

export default ExpensePlanner;