import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import AppNavBar from '../AppNavBar';
import {Link} from 'react-router-dom';

class IncomeList extends Component {

    constructor(props) {
        var today = new Date();
        super(props);
        this.state = {
            incomes: [],
            month: today.getMonth() + 1,
            year: today.getFullYear()
        };
    }

    componentDidMount() {
        fetch('/incomes?year=' + this.state.year + '&month=' + this.state.month)
            .then(response => response.json())
            .then(data => this.setState({incomes: data}));
    }

    async remove(id) {
        await fetch(`/incomes/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedIncomes = [...this.state.incomes].filter(i => i.id !== id);
            this.setState({incomes: updatedIncomes});
        });
    }

    increaseDate() {
        var actualYear = this.state.year
        var actualMonth = this.state.month
        if (actualMonth === 12) {
            var nextYear = actualYear + 1
            this.setState({year: nextYear})
            this.setState({month: 1})
            fetch('/incomes?year=' + nextYear + '&month=' + 1)
                .then(response => response.json())
                .then(data => this.setState({incomes: data}));
        } else {
            var nextMonth = actualMonth + 1;
            this.setState({month: nextMonth})
            fetch('/incomes?year=' + this.state.year + '&month=' + nextMonth)
                .then(response => response.json())
                .then(data => this.setState({incomes: data}));
        }

    }

    decreaseDate() {
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 1) {
            let previousYear = actualYear - 1
            this.setState({year: previousYear})
            this.setState({month: 12})
            fetch('/incomes?year=' + previousYear + '&month=' + 12)
                .then(response => response.json())
                .then(data => this.setState({incomes: data}));
        } else {
            let previousMonth = actualMonth - 1;
            this.setState({month: previousMonth})
            fetch('/incomes?year=' + this.state.year + '&month=' + previousMonth)
                .then(response => response.json())
                .then(data => this.setState({incomes: data}));
        }
    }

    render() {
        const {incomes, isLoading} = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }

        const incomeList = incomes.map(income => {
            return <tr key={income.id}>
                <td>{income.category.description}</td>
                <td>{income.value}</td>
                <td>{income.additionalInformation}</td>
                <td>{income.insertDate}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/incomes/" + income.id}>Edytuj</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(income.id)}>Usun</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavBar/>
                <Container fluid>
                    <h3>Przychody {this.state.month}-{this.state.year}</h3>
                    <div>
                            <Button color='light' onClick={() => this.decreaseDate()}>
                                Poprzedni miesiac
                            </Button>{' '}
                            <Button color='light' onClick={() => this.increaseDate()}>
                                Nastepny miesiac
                            </Button>{' '}
                            <Button color='light' tag={Link} to="/incomes/new">Nowy wydatek</Button>
                    </div>
                    <Table className="mt-4" responsive hover>
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
                        {incomeList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default IncomeList;