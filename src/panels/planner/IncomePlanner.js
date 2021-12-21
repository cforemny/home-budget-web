import React, {Component} from 'react';
import {Container, Input, Table} from 'reactstrap';
import Button from "reactstrap/es/Button";
import Form from "reactstrap/es/Form";

class IncomePlanner extends Component {

    category = {
        id: '',
        description: ''
    }

    plannedIncome = {
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
            item: this.plannedIncome
        }
        this.handleIncomeDescriptionChange = this.handleIncomeDescriptionChange.bind(this);
        this.handleIncomeValueChange = this.handleIncomeValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        await fetch('/planner/incomes',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
        this.setState({item: this.plannedIncome});
        document.getElementById('incomesForm').reset()
        window.location.reload(false);
    }

    async remove(id) {
        await fetch(`/planner/incomes/` + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )
        window.location.reload(false);
    }

    handleIncomeDescriptionChange(event) {
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

    handleIncomeValueChange(event) {
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
        return this.props.plannedIncomes.map((plannedIncome) => {
            const {id, value, description, category} = plannedIncome
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
        const {incomesCategories} = this.props;
        const incomesCategoryList = incomesCategories.map(category => {
            return <tbody>
            <tr key={category.id}>
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
                <td>
                    <Button size="sm">Dodaj</Button>
                </td>
            </tr>
            </tbody>
        });

        return (
            <div>
                <Container>
                    <Form id='incomesForm' onSubmit={this.handleSubmit}>
                        <Table stripped hover className="mt-4">
                            <thead>
                            <tr>
                                <th> Opis/Kategoria</th>
                                <th> Planowana wysokość przychodu</th>
                                <th>Akcja</th>
                            </tr>
                            </thead>
                            {incomesCategoryList}
                        </Table>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default IncomePlanner;