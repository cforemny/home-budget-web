import React, {Component} from 'react';
import {Button, Form, FormGroup, Input, Label} from "reactstrap";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            cyp: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
    }

    verifyUser() {
        // TODO: zrobic to chytrze, a nie w parametrach
        return fetch('/login?user=' + this.state.userName + '&password=' + this.state.password, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                return data.valid
            });
    }

    async handleSubmit(e) {
        e.preventDefault();
        let val = await this.verifyUser();
        if (val) {
            sessionStorage.setItem('isUserValid', 'true');
            window.location.reload(false);
        } else {
            sessionStorage.setItem('isUserValid', 'false');
            window.location.reload(false);
        }
    }

    changePassword(e) {
        e.preventDefault();
        this.setState({password: e.target.value})
    }

    changeUsername(e) {
        e.preventDefault();
        this.setState({userName: e.target.value})
    }

    render() {
        return (
            <div>
                <Form className="form" onSubmit={this.handleSubmit}>
                    <FormGroup className="lead">
                        <Label>Użytkownik </Label>
                        <Input type="text" onChange={this.changeUsername}/>
                        <Label>Hasło </Label>
                        <Input type="password" onChange={this.changePassword}/>
                        <Button style={{marginTop: 5}}>Zaloguj</Button>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}

export default Login