import React, {Component} from 'react';
import {Button, Container, Form, Input, Table} from 'reactstrap';
import AppNavBar from '../AppNavBar';
import PanelNavBar from "./PanelNavBar";

class AdminPanel extends Component {

    category = {
        category: '',
        description: ''
    }

    account = {
        description: '',
        moneyAmount: '',
        insertDate: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            item: this.category,
            accountItem: this.account
        };
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleAccountChange = this.handleAccountChange.bind(this);
        this.handleCategorySubmit = this.handleCategorySubmit.bind(this);
        this.handleAccountSubmit = this.handleAccountSubmit.bind(this);
    }

     handleCategorySubmit(event) {
        event.preventDefault();
        let {item} = this.state;
         fetch('/admin-panel/category/' + item.category,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
        document.getElementById('categoriesForm').reset()
    }

    handleAccountSubmit(event) {
        event.preventDefault();
        let {accountItem} = this.state;
        fetch('/account',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(accountItem),
            });
        document.getElementById('accountForm').reset()
    }

    handleCategoryChange(event) {
        let item;
        const target = event.target;
        item = {
            description: target.value,
            category: target.name
        }
        this.setState({item});
    }

    handleAccountChange(event) {
        let accountItem;
        const target = event.target;
        accountItem = {
            description: target.value,
            moneyAmount: 0,
            insertDate: new Date()
        }
        this.setState({accountItem});
    }

    render() {
        return (
            <div>
                <AppNavBar/>
                <Container>
                    <Form id='categoriesForm' onSubmit={this.handleCategorySubmit}>
                        <PanelNavBar panelName={'Panel Administratora'} />
                        <br/>
                        <h5 className="text-muted">Kategorie</h5>
                        <Table>
                            <tbody>
                            <tr>
                                <td>
                                    <Input name='expense' placeholder='Dodaj kateogorie wydatkow'
                                           onChange={this.handleCategoryChange}
                                    />
                                </td>
                                <td>
                                    <Button size="sm" color="primary" type="submit">Dodaj</Button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input name='income' placeholder='Dodaj kateogorie przychodow'
                                           onChange={this.handleCategoryChange}/>
                                </td>
                                <td><Button size="sm" color="primary" type="submit">Dodaj</Button></td>
                            </tr>
                            </tbody>
                        </Table>
                    </Form>
                    <Form id='accountForm' onSubmit={this.handleAccountSubmit}>
                        <h5 className="text-muted">Konta</h5>
                        <Table>
                            <tbody>
                            <tr>
                                <td>
                                    <Input name='income' placeholder='Dodaj nowe konto'
                                           onChange={this.handleAccountChange}/>
                                </td>
                                <td><Button size="sm" color="primary" type="submit">Dodaj</Button></td>
                            </tr>
                            </tbody>
                        </Table>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default AdminPanel;