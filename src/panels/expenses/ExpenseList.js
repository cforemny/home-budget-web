import React, {Component} from 'react';
import {Button, Container, Input, Table} from 'reactstrap';
import AppNavBar from '../../AppNavBar';
import {Link} from 'react-router-dom';
import Form from "reactstrap/es/Form";


class ExpenseList extends Component {


    category = {
        id: '',
        description: ''
    }

    expense = {
        id: '',
        additionalInformation: '',
        value: '',
        category: '',
        insertDate: ''
    }

    constructor(props) {
        let today = new Date();
        super(props);
        this.state = {
            expenses: [],
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            item: this.expense,
            expenseCategories: []
        };
        this.remove = this.remove.bind(this);
        this.handleExpenseDescriptionChange = this.handleExpenseDescriptionChange.bind(this);
        this.handleExpenseValueChange = this.handleExpenseValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

     componentDidMount() {
         fetch('http://localhost:8090/expenses?year=' + this.state.year + '&month=' + this.state.month)
            .then(response => response.json())
            .then(data => this.setState({expenses: data}));
        this.getExpenseCategories();
    }

    getExpenseCategories() {
        fetch('http://localhost:8090/categories/expense')
            .then(response => response.json())
            .then(data => this.setState({expenseCategories: data}));
    }

    async remove(id) {
        await fetch(`/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedExpenses = [...this.state.expenses].filter(i => i.id !== id);
            this.setState({expenses: updatedExpenses});
        });
    }

    increaseDate() {
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 12) {
            let nextYear = actualYear + 1
            this.setState({year: nextYear})
            this.setState({month: 1})
            fetch('http://localhost:8090/expenses?year=' + nextYear + '&month=' + 1)
                .then(response => response.json())
                .then(data => this.setState({expenses: data}));
        } else {
            let nextMonth = actualMonth + 1;
            this.setState({month: nextMonth})
            fetch('http://localhost:8090/expenses?year=' + this.state.year + '&month=' + nextMonth)
                .then(response => response.json())
                .then(data => this.setState({expenses: data}));
        }
    }

    decreaseDate() {
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 1) {
            let previousYear = actualYear - 1
            this.setState({year: previousYear})
            this.setState({month: 12})
            fetch('http://localhost:8090/expenses?year=' + previousYear + '&month=' + 12)
                .then(response => response.json())
                .then(data => this.setState({expenses: data}));
        } else {
            let previousMonth = actualMonth - 1;
            this.setState({month: previousMonth})
            fetch('http://localhost:8090/expenses?year=' + this.state.year + '&month=' + previousMonth)
                .then(response => response.json())
                .then(data => this.setState({expenses: data}));
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        await fetch('http://localhost:8090/expenses',
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

    handleExpenseDescriptionChange(event) {
        let item;
        const target = event.target;
        item = {
            value: this.state.item.value,
            additionalInformation: target.value,
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
            additionalInformation: this.state.item.additionalInformation,
            insertDate: this.state.currentDate,
            category: {
                id: target.id
            }
        }
        this.setState({item});
    }

    renderTableData(categoryId) {
        return this.state.expenses.map(expense => {
            if (categoryId === expense.category.id) {
                return (
                    <tr key={expense.id}>
                        <td>{expense.additionalInformation}</td>
                        <td>{expense.value} zł</td>
                        <td>{expense.insertDate}</td>
                        <td>
                            <Button size="sm" color="primary" tag={Link}
                                    to={"/expenses/" + expense.id}>Edytuj</Button>{' '}
                            <Button size="sm" color="danger" onClick={() => this.remove(expense.id)}>Usun</Button>
                        </td>
                    </tr>
                )
            }else{
                return null;
            }
        });
    }

    render() {
        const {expenseCategories} = this.state;
        const expenseCategoryList = expenseCategories.map(category => {
            return <tbody key={category.description}>
            <tr className="text-uppercase" key={category.id}>
                <td>{category.description}</td>
            </tr>
            {this.renderTableData(category.id)}
            <tr >
                <td>
                    <Input id={category.id} placeholder='Opis'
                           onChange={this.handleExpenseDescriptionChange}/>
                </td>
                <td>
                    <Input id={category.id} placeholder='Kwota'
                           onChange={this.handleExpenseValueChange}/>
                </td>
                <td></td>
                <td>
                    <Button size="sm">Dodaj</Button>
                </td>
            </tr>
            </tbody>
        });

        return (
            <div>
                <AppNavBar/>
                <Container fluid>
                    <h3>Wydatki {this.state.month}-{this.state.year}</h3>
                    <div>
                        <Button color='light' onClick={() => this.decreaseDate()}>Poprzedni
                            miesiac
                        </Button>{' '}
                        <Button color='light' onClick={() => this.increaseDate()}>Nastepny
                            miesiac
                        </Button>
                    </div>
                    <div>
                        <Container>
                            <Form id='expensesForm' onSubmit={this.handleSubmit}>
                                <Table hover className="mt-4">
                                    <thead>
                                    <tr>
                                        <th width="20%">Kategoria/Opis</th>
                                        <th width="10%">Kwota</th>
                                        <th width="20%">Data dodania</th>
                                        <th width="30%">Akcja</th>
                                    </tr>
                                    </thead>
                                    {expenseCategoryList}
                                </Table>
                            </Form>
                        </Container>
                    </div>
                </Container>
            </div>
        );
    }
}

export default ExpenseList;