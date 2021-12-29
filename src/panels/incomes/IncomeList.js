import React, {Component} from 'react';
import {Button, Container, Input, Table} from 'reactstrap';
import AppNavBar from '../../AppNavBar';
import {Link} from 'react-router-dom';
import Form from "reactstrap/es/Form";

class IncomeList extends Component {

    category = {
        id: '',
        description: ''
    }

    income = {
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
            incomes: [],
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            item: this.income,
            incomeCategories: []
        };
        this.remove = this.remove.bind(this);
        this.handleIncomeDescriptionChange = this.handleIncomeDescriptionChange.bind(this);
        this.handleIncomeValueChange = this.handleIncomeValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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


    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        await fetch('/incomes',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
        this.setState({item: this.plannedExpense});
        document.getElementById('incomesForm').reset()
        window.location.reload(false);
    }

    handleIncomeDescriptionChange(event) {
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

    handleIncomeValueChange(event) {
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
        return this.state.incomes.map(income => {
            if (categoryId === income.category.id) {
                return (
                    <tr key={income.id}>
                        <td>{income.additionalInformation}</td>
                        <td>{income.value} zł</td>
                        <td>{income.insertDate}</td>
                        <td>
                            <Button size="sm" color="primary" tag={Link}
                                    to={"/incomes/" + income.id}>Edytuj</Button>{' '}
                            <Button size="sm" color="danger" onClick={() => this.remove(income.id)}>Usun</Button>
                        </td>
                    </tr>
                )
            } else {
                return null;
            }
        });
    }

    render() {
        const {incomeCategories} = this.state;
        const incomeCategoryList = incomeCategories.map(category => {
            return <tbody key={category.description}>
            <tr className="text-uppercase" key={category.id}>
                <td>{category.description}</td>
            </tr>
            {this.renderTableData(category.id)}
            <tr>
                <td>
                    <Input id={category.id} placeholder='Opis'
                           onChange={this.handleIncomeDescriptionChange}/>
                </td>
                <td>
                    <Input id={category.id} placeholder='Kwota'
                           onChange={this.handleIncomeValueChange}/>
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
                    <h3>Przychody {this.state.month}-{this.state.year}</h3>
                    <div>
                        <Button color='light' onClick={() => this.decreaseDate()}>
                            Poprzedni miesiac
                        </Button>{' '}
                        <Button color='light' onClick={() => this.increaseDate()}>
                            Nastepny miesiac
                        </Button>
                    </div>
                    <div>
                        <Container>
                            <Form id='incomesForm' onSubmit={this.handleSubmit}>
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
                            </Form>
                        </Container>
                    </div>
                </Container>
            </div>
        );
    }
}

export default IncomeList;