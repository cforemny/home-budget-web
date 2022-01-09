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
            currentDate: new Date(),
            item: this.income,
            incomesGrouped: []
        };
        this.remove = this.remove.bind(this);
        this.handleIncomeDescriptionChange = this.handleIncomeDescriptionChange.bind(this);
        this.handleIncomeValueChange = this.handleIncomeValueChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentDidMount() {
        this.getIncomesGrouped();
    }

    handleDateChange(date) {
        this.getIncomesGrouped(date.getFullYear(), date.getMonth() + 1)
        this.setState({currentDate: date})
    }

    getIncomesGrouped() {
        fetch('/incomes/grouped?year=' + this.state.currentDate.getFullYear() + '&month='
            + this.state.currentDate.getMonth() + 1)
            .then(response => response.json())
            .then(data => this.setState({incomesGrouped: data}));
    }

    getSelectedOptions() {
        const data = this.state.incomesGrouped

        return data.map(d => ({
            "value": d.categoryId,
            "label": d.category,
        }))
    }

    remove(id) {
        fetch(`/incomes/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            this.getIncomesGrouped();
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        try {
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
            this.getIncomesGrouped()
        } catch (error) {
            console.log('Problem with submitting income')
        }
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

    renderGroupedIncome(incomeByCategory) {
        return (
            incomeByCategory.map(income => {
                    return (
                        <tr key={income.id}>
                            <td>{income.additionalInformation}</td>
                            <td>{income.value}zł</td>
                            <td>{income.insertDate}</td>
                            <td>
                                <Button size="sm" color="primary" tag={Link}
                                        to={"/incomes/" + income.id}>Edytuj</Button>{' '}
                                <Button size="sm" color="danger" onClick={() => this.remove(income.id)}>Usun</Button>
                            </td>
                        </tr>
                    )
                }
            )
        )
    }

    renderGroupedData() {
        return this.state.incomesGrouped.map(incomeByCategory => {
            return (
                <tbody>
                <tr key={incomeByCategory.category} >
                    <td className="text-uppercase"><strong>{incomeByCategory.category}</strong></td>
                    <td><strong>{incomeByCategory.incomes.reduce((a, v) => a+v.value, 0)}zł</strong></td>
                </tr>
                {this.renderGroupedIncome(incomeByCategory.incomes)}
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
                            <PanelNavBar month={this.state.currentDate.getMonth() + 1} panelName={'Przychody'}/>
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
                            </Form>
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

export default IncomeList;