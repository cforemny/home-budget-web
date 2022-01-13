import React, {Component} from 'react';
import {Button, Container, FormGroup, Input, Table} from 'reactstrap';
import AppNavBar from '../../AppNavBar';
import {Link} from 'react-router-dom';
import Form from "reactstrap/es/Form";
import Select from "react-select";
import PanelNavBar from "../PanelNavBar";
import MonthManager from "../MonthManager";

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
        super(props);
        this.state = {
            currentDate: new Date(),
            item: this.expense,
            expensesGrouped: [],
            expenseCategories: []
        };
        this.remove = this.remove.bind(this);
        this.handleExpenseDescriptionChange = this.handleExpenseDescriptionChange.bind(this);
        this.handleExpenseValueChange = this.handleExpenseValueChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentDidMount() {
        this.getExpensesGrouped(this.state.currentDate);
        this.getExpenseCategories();
    }

    handleDateChange(date) {
        this.setState({currentDate: date})
        this.getExpensesGrouped(date)
    }

    getExpensesGrouped(date) {
        console.log(this.state.currentDate.getFullYear())
        console.log(this.state.currentDate.getMonth() + 1)
        fetch('/expenses/grouped?year=' + date.getFullYear() + '&month=' + (date.getMonth() + 1))
            .then(response => response.json())
            .then(data => this.setState({expensesGrouped: data}));
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

    remove(id) {
        fetch(`/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            this.getExpensesGrouped(this.state.currentDate);
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        try {
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
            this.getExpensesGrouped(this.state.currentDate)
        } catch (error) {
            console.log('Problem with submitting expense')
        }
    }

    handleExpenseDescriptionChange(event) {
        let item;
        const target = event.target;
        item = {
            value: this.state.item.value,
            additionalInformation: target.value,
            insertDate: this.state.currentDate,
            category: {
                id: this.state.item.category.id
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
                id: this.state.item.category.id
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

    renderGroupedExpense(expenseByCategory) {
        return (
            expenseByCategory.map(expense => {
                    return (
                        <tr key={expense.id}>
                            <td>{expense.additionalInformation}</td>
                            <td>{expense.value}zł</td>
                            <td>{expense.insertDate}</td>
                            <td>
                                <Button size="sm" color="primary" tag={Link}
                                        to={"/expenses/" + expense.id}>Edytuj</Button>{' '}
                                <Button size="sm" color="danger" onClick={() => this.remove(expense.id)}>Usun</Button>
                            </td>
                        </tr>
                    )
                }
            )
        )
    }

    renderGroupedData() {
        return this.state.expensesGrouped.map(expenseByCategory => {
            return (
                <tbody>
                <tr key={expenseByCategory.category}>
                    <td className="text-uppercase"><strong>{expenseByCategory.category}</strong></td>
                    <td><strong>{expenseByCategory.expenses.reduce((a, v) => a + v.value, 0)}zł</strong></td>
                </tr>
                {this.renderGroupedExpense(expenseByCategory.expenses)}
                </tbody>
            )
        })
    }

    render() {
        const {item} = this.state;
        return (
            <div>
                <AppNavBar/>
                <Container fluid>
                    <div>
                        <br/>
                        <Container>
                            <MonthManager currentDate={this.state.currentDate}
                                          handleDateChange={this.handleDateChange.bind(this)}/>
                            <PanelNavBar month={this.state.currentDate.getMonth() + 1} panelName={'Wydatki'}/>
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
                            </Form>
                            <br/>
                            <div className='card p-3 bg-light'>
                                <Table responsive hover>
                                    <thead>
                                    <tr>
                                        <th>Kategoria/Opis</th>
                                        <th>Kwota/Suma</th>
                                        <th>Data dodania</th>
                                        <th>Akcja</th>
                                    </tr>
                                    </thead>
                                    {this.renderGroupedData()}
                                </Table>
                            </div>
                        </Container>
                    </div>
                </Container>
            </div>
        );
    }
}

export default ExpenseList;