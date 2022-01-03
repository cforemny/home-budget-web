import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavBar from '../../AppNavBar';
import axios from "axios";
import Select from 'react-select'

class ExpenseEdit extends Component {

    category = {
        id: '',
        description: ''
    }

    emptyItem = {
        value: '',
        additionalInformation: '',
        category: '',
        insertDate: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            selectOptions: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const expense = await (await fetch(`/expenses/${this.props.match.params.id}`)).json();
            this.setState({item: expense});
        }
        await this.getOptions();
    }

    async getOptions() {
        const res = await axios.get('/categories/expense')
        const data = res.data

        const options = data.map(d => ({
            "value": d.id,
            "label": d.description,
        }))
        this.setState({selectOptions: options})
    }

    handleChange(event) {
        let item = {...this.state.item};
        const target = event.target;
        if (target !== undefined) {
            const value = target.value;
            const name = target.name;
            item[name] = value;
            this.setState({item});
        } else {
            item["category"] = {
                id: event.value,
                description: event.label
            }
            this.setState({item});
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;

        await fetch('/expenses' + (item.id ? '/' + item.id : ''), {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/expenses');
    }

    render() {
        const {item} = this.state;
        const title = <h2>Edytuj wydatek</h2>;

        return <div>
            <AppNavBar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="value">Kwota</Label>
                        <Input type="number" name="value" id="value" value={item.value || ''}
                               onChange={this.handleChange} autoComplete="value"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="category">Kategoria</Label>
                        <Select options={this.state.selectOptions}
                                placeholder={item.category.description || 'Wybierz kategorie'}
                                onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="additionalInformation">Dodatkowe informacje</Label>
                        <Input type="text" name="additionalInformation" id="additionalInformation"
                               value={item.additionalInformation || ''}
                               onChange={this.handleChange} autoComplete="additionalInformation"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="insertDate">Data dodania</Label>
                        <Input type="text" name="insertDate" id="insertDate"
                               value={item.insertDate || ''}
                               onChange={this.handleChange} autoComplete="insertDate"/>
                    </FormGroup>
                        <Button color="primary" type="submit">Zapisz</Button>{' '}
                        <Button color="secondary" tag={Link} to="/expenses">Anuluj</Button>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(ExpenseEdit);