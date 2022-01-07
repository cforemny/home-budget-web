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
            expenses: [],
            currentDate: new Date(),
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
        this.getExpenses(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
        this.getExpenseCategories();
    }

    handleDateChange(date) {
        this.getExpenses(date.getFullYear(), date.getMonth() + 1)
        this.setState({currentDate: date})
    }

    getExpenseCategories() {
        fetch('/categories/expense')
            .then(response => response.json())
            .then(data => this.setState({expenseCategories: data}));
    }

    getExpenses(year, month) {
        fetch('/expenses?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({expenses: data}));
    }

    getSelectedOptions() {
        return this.state.expenseCategories.map(d => ({
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
            let updatedExpenses = [...this.state.expenses].filter(i => i.id !== id);
            this.setState({expenses: updatedExpenses});
        });
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
        this.getExpenseCategories();
        this.getExpenses(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1)
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
        let filteredExpenses = [...this.state.expenses].filter(expense => expense.category.id === categoryId);
        return filteredExpenses.map(expense => {
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