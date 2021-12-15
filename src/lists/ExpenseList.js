import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import AppNavBar from '../AppNavBar';
import {Link} from 'react-router-dom';

class ExpenseList extends Component {

    constructor(props) {
        let today = new Date();
        super(props);
        this.state = {
            expenses: [],
            month: today.getMonth() + 1,
            year: today.getFullYear()
        };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/expenses?year=' + this.state.year + '&month=' + this.state.month)
            .then(response => response.json())
            .then(data => this.setState({expenses: data}));
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
            fetch('/expenses?year=' + nextYear + '&month=' + 1)
                .then(response => response.json())
                .then(data => this.setState({expenses: data}));
        } else {
            let nextMonth = actualMonth + 1;
            this.setState({month: nextMonth})
            fetch('/expenses?year=' + this.state.year + '&month=' + nextMonth)
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
            fetch('/expenses?year=' + previousYear + '&month=' + 12)
                .then(response => response.json())
                .then(data => this.setState({expenses: data}));
        } else {
            let previousMonth = actualMonth - 1;
            this.setState({month: previousMonth})
            fetch('/expenses?year=' + this.state.year + '&month=' + previousMonth)
                .then(response => response.json())
                .then(data => this.setState({expenses: data}));
        }
    }

    render() {
        const {expenses, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const expenseList = expenses.map(expense => {
            return <tr key={expense.id}>
                <td>{expense.category.description}</td>
                <td>{expense.value}</td>
                <td>{expense.additionalInformation}</td>
                <td>{expense.insertDate}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/expenses/" + expense.id}>Edytuj</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(expense.id)}>Usun</Button>
                    </ButtonGroup>
                </td>
            </tr>
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
                            </Button>{' '}
                            <Button color='light' tag={Link} to="/expenses/new">Nowy wydatek</Button>
                    </div>
                    <Table hover className="mt-4">
                        <thead>
                        <tr>
                            <th width="10%">Kategoria</th>
                            <th width="10%">Kwota</th>
                            <th width="20%">Dodatkowe informacje</th>
                            <th width="20%">Data dodania</th>
                            <th width="40%">Akcja</th>
                        </tr>
                        </thead>
                        <tbody>
                        {expenseList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default ExpenseList;