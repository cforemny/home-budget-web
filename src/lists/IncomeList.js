import React, {Component} from 'react';
import {Button, Container, Table} from 'reactstrap';
import AppNavBar from '../AppNavBar';
import {Link} from 'react-router-dom';

class IncomeList extends Component {

    constructor(props) {
        let today = new Date();
        super(props);
        this.state = {
            incomes: [],
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            incomeCategories: []
        };
    }

    componentDidMount() {
        fetch('/incomes?year=' + this.state.year + '&month=' + this.state.month)
            .then(response => response.json())
            .then(data => this.setState({incomes: data}));
        this.getIncomeCategories();
    }

    getIncomeCategories() {
        fetch('/categories/income')
            .then(response => response.json())
            .then(data => this.setState({incomeCategories: data}));
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
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 12) {
            let nextYear = actualYear + 1
            this.setState({year: nextYear})
            this.setState({month: 1})
            fetch('/incomes?year=' + nextYear + '&month=' + 1)
                .then(response => response.json())
                .then(data => this.setState({incomes: data}));
        } else {
            let nextMonth = actualMonth + 1;
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

    renderTableData(categoryId) {
        return this.state.incomes.map(income => {
            if (categoryId === income.category.id) {
                return (
                    <tr key={income.id}>
                        <td>{income.additionalInformation}</td>
                        <td>{income.value} zł</td>
                        <td>{income.insertDate}</td>
                        <td>
                            <Button size="sm" color="primary" tag={Link}
                                    to={"/expenses/" + income.id}>Edytuj</Button>{' '}
                            <Button size="sm" color="danger" onClick={() => this.remove(income.id)}>Usun</Button>
                        </td>
                    </tr>
                )
            }
        });
    }

    render() {
        const {incomeCategories} = this.state;
        const incomeCategoryList = incomeCategories.map(category => {
            return <tbody>
            <tr class="text-uppercase" key={category.id}>
                <td>{category.description}</td>
            </tr>
            {this.renderTableData(category.id)}
            </tbody>
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
                    <div>
                        <Container>
                            <Table className="mt-4" responsive hover>
                                <thead>
                                <tr>
                                    <th width="20%">Kategoria/Opis</th>
                                    <th width="10%">Kwota</th>
                                    <th width="20%">Data dodania</th>
                                    <th width="30%">Akcja</th>
                                </tr>
                                </thead>
                                {incomeCategoryList}
                            </Table>
                        </Container>
                    </div>
                </Container>
            </div>
        );
    }
}

export default IncomeList;