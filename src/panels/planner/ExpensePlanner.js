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
        today.setFullYear(this.props.year, this.props.month )
        this.state = {
            currentDate: today,
            item: this.plannedExpense,
            plannedExpenses : [],
            expenseCategories: []
        }
        this.handleExpenseDescriptionChange = this.handleExpenseDescriptionChange.bind(this);
        this.handleExpenseValueChange = this.handleExpenseValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getPlannedExpenses(this.props.year, this.props.month)
        this.getExpenseCategories();
    }

    componentDidUpdate(prevState) {
        if(prevState.month !== this.props.month){
            this.getPlannedExpenses(this.props.year, this.props.month)
        }
    }

    getExpenseCategories() {
       fetch('/categories/expense')
            .then(response => response.json())
            .then(data => this.setState({expenseCategories: data}));
    }

    getPlannedExpenses(year, month) {
       fetch('/planner/expenses?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({plannedExpenses: data}));
    }

    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        awaitfetch('/planner/expenses',
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
        this.getPlannedExpenses(this.props.year, this.props.month)
        this.getExpenseCategories();
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
        this.getPlannedExpenses(this.props.year, this.props.month)
    }

    handleExpenseDescriptionChange(event) {
        let item;
        const target = event.target;
        let date = new Date();
        date.setMonth(this.props.month - 1)
        date.setFullYear(this.props.year)
        item = {
            value: this.state.item.value,
            description: target.value,
            insertDate: date,
            category: {
                id: target.id
            }
        }
        this.setState({item});
    }

    handleExpenseValueChange(event) {
        let item;
        const target = event.target;
        let date = new Date();
        date.setMonth(this.props.month - 1)
        date.setFullYear(this.props.year)
        item = {
            value: target.value,
            description: this.state.item.description,
            insertDate: date,
            category: {
                id: target.id
            }
        }
        this.setState({item});
    }

    renderTableData(categoryId) {
        return this.state.plannedExpenses.map((plannedExpense) => {
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
            } else {
                return null;
            }
        })
    }

    render() {
        const {expenseCategories} = this.state;
        const expenseCategoryList = expenseCategories.map(category => {
            return <tbody key={category.description}>
            <tr key={category.id}>
                <td><strong>{category.description}</strong></td>
            </tr>
            {this.renderTableData(category.id)}
            <tr key="expenseInputRow">
                <td>
                    <Input id={category.id} placeholder='Opis'
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
                        <Table hover>
                            <thead>
                            <tr>
                                <th> Opis/Kategoria</th>
                                <th> Planowana wysokość wydatku</th>
                                <th> Akcja</th>
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