import React, {Component} from 'react';
import {Button, Container, FormGroup, Input, Table} from 'reactstrap';
import AppNavBar from '../../AppNavBar';
import {Link} from 'react-router-dom';
import Form from "reactstrap/es/Form";
import Select from "react-select";
import PanelNavBar from "../PanelNavBar";
import MonthManager from "../MonthManager";

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
        super(props);
        this.state = {
            incomes: [],
            currentDate: new Date(),
            item: this.income,
            incomeCategories: []
        };
        this.remove = this.remove.bind(this);
        this.handleIncomeDescriptionChange = this.handleIncomeDescriptionChange.bind(this);
        this.handleIncomeValueChange = this.handleIncomeValueChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentDidMount() {
        this.getIncomes(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
        this.getIncomeCategories();
    }

    handleDateChange(date) {
        this.getIncomes(date.getFullYear(), date.getMonth() + 1)
        this.setState({currentDate: date})
    }

    getIncomes(year, month) {
        fetch('/incomes?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({incomes: data}));
    }

    getIncomeCategories() {
        fetch('/categories/income')
            .then(response => response.json())
            .then(data => this.setState({incomeCategories: data}));
    }

    getSelectedOptions() {
        const data = this.state.incomeCategories

        return data.map(d => ({
            "value": d.id,
            "label": d.description,
        }))
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
        this.setState({item: this.income});
        document.getElementById('incomesForm').reset()
        await this.getIncomeCategories();
        await this.getIncomes(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1)
    }

    handleIncomeDescriptionChange(event) {
        let item;
        const target = event.target;
        item = {
            value: this.state.item.value,
            additionalInformation: target.value,
            insertDate: this.state.currentDate,
            category: {
                id: target.value
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
        const {item} = this.state;
        const {incomeCategories} = this.state;
        const incomeCategoryList = incomeCategories.map(category => {
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
                <MonthManager currentDate={this.state.currentDate} handleDateChange={this.handleDateChange.bind(this)}/>
                <Container fluid>
                    <div>
                        <br/>
                        <Container>
                            <PanelNavBar month={this.state.currentDate.getMonth() + 1} panelName={'Przychody'} />
                            <Form id='incomesForm' onSubmit={this.handleSubmit}>
                                <FormGroup className='card p-3 bg-light'>
                                    <h5>Nowy przychod</h5>
                                    <Input placeholder='Opis'
                                           onChange={this.handleIncomeDescriptionChange}/>
                                    <Input placeholder='Kwota'
                                           onChange={this.handleIncomeValueChange}/>
                                    <Select options={this.getSelectedOptions()}
                                            placeholder={item.category.description || 'Wybierz kategorie'}
                                            onChange={this.handleCategoryChange}/>
                                    <Button size="sm">Dodaj</Button>
                                </FormGroup>
                                <br/>
                                <div className='card p-3 bg-light'>
                                    <Table responsive hover>
                                        <thead>
                                        <tr>
                                            <th>Kategoria/Opis</th>
                                            <th>Kwota</th>
                                            <th>Data dodania</th>
                                            <th>Akcja</th>
                                        </tr>
                                        </thead>
                                        {incomeCategoryList}
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

export default IncomeList;