import React, {Component} from 'react';
import {Button, Container, Form, Input, Table} from 'reactstrap';
import AppNavBar from '../AppNavBar';

class AdminPanel extends Component {

    category = {
        category: '',
        description: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            item: this.category
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        let {item} = this.state;
        await fetch('/admin-panel/category/' + item.category,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
        item = {
            description: '',
            category: ''
        }
        this.setState({item});
        document.getElementById('categoriesForm').reset()
        this.props.history.push('/admin-panel');
    }

    handleChange(event) {
        let item;
        const target = event.target;
        item = {
            description: target.value,
            category: target.name
        }
        this.setState({item});
    }

    render() {
        return (
            <div>
                <AppNavBar/>
                <h3>Panel administratora</h3>
                <Container>
                    <Form id='categoriesForm' onSubmit={this.handleSubmit}>
                        <Table>
                            <tbody>
                            <tr>
                                <td>
                                    <Input name='expense' placeholder='Dodaj kateogorie wydatkow'
                                           onChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Button size="sm" color="primary" type="submit">Dodaj</Button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input name='income' placeholder='Dodaj kateogorie przychodow'
                                           onChange={this.handleChange}/>
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