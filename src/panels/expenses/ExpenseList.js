import React, {Component} from 'react';
import {Button, Container, FormGroup, Input, Table} from 'reactstrap';
import AppNavBar from '../../AppNavBar';
import {Link} from 'react-router-dom';
import Form from "reactstrap/es/Form";
import Select from "react-select";
import PanelNavBar from "../PanelNavBar";


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
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getExpenses(this.state.year , this.state.month);
        this.getExpenseCategories();
    }

    getExpenseCategories() {
        fetch('/categories/expense')
            .then(response => response.json())
            .then(data => this.setState({expenseCategories: data}));
    }

    getSelectedOptions() {
        const data = this.state.expenseCategories

        return data.map(d => ({
            "value": d.id,
            "label": d.description,
        }))
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
            this.getExpenses(nextYear, 1);
        } else {
            let nextMonth = actualMonth + 1;
            this.setState({month: nextMonth})
            this.getExpenses(this.state.year , nextMonth);
        }
    }

    decreaseDate() {
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 1) {
            let previousYear = actualYear - 1
            this.setState({year: previousYear})
            this.setState({month: 12})
            this.getExpenses(previousYear, 12);
        } else {
            let previousMonth = actualMonth - 1;
            this.setState({month: previousMonth})
            this.getExpenses(this.state.year, previousMonth);
        }
    }


    getExpenses(year, month) {
        fetch('/expenses?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({expenses: data}));
    }

    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        await fetch('/expenses',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
        this.setState({item: this.expense});
        document.getElementById('expensesForm').reset()
        await this.getExpenseCategories();
        await this.getExpenses(this.state.year, this.state.month)
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

    handleCategoryChange(event) {
        let item;
        item = {
            value: this.state.item.value,
            additionalInformation: this.state.item.additionalInformation,
            insertDate: this.state.currentDate,
            category: {
                id: event.value,
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
            } else {
                return null;
            }
        });
    }

    render() {
        const {item} = this.state;
        const {expenseCategories} = this.state;
        const expenseCategoryList = expenseCategories.map(category => {
            return <tbody key={category.description}>
            <tr className="text-uppercase" key={category.id}>
                <td><strong>{category.description}</strong></td>
            </tr>
            {this.renderTableData(category.id)}
            </tbody>
        });

        return (
            <div>
                <AppNavBar/>
                <Container fluid>
                    <div>
                        <Button color='light' onClick={() => this.decreaseDate()}>Poprzedni
                            miesiac
                        </Button>{' '}
                        <Button color='light' onClick={() => this.increaseDate()}>Nastepny
                            miesiac
                        </Button>
                    </div>
                    <div>
                        <br/>
                        <Container>
                            <PanelNavBar month={this.state.month} panelName={'Wydatki'} />
                            <Form id='expensesForm' onSubmit={this.handleSubmit}>
                                <FormGroup className='card p-3 bg-light'>
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
                                <div className='card p-3 bg-light'>
                                    <Table hover responsive>
                                        <thead>
                                        <tr>
                                            <th>Kategoria/Opis</th>
                                            <th>Kwota</th>
                                            <th>Data dodania</th>
                                            <th>Akcja</th>
                                        </tr>
                                        </thead>
                                        {expenseCategoryList}
                                    </Table>
                                </div>
                            </Form>
                        </Container>
                    </div>
                </Container>
            </div>
        );
    }
}

export default ExpenseList;