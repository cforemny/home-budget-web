import React, {useState} from 'react';
import {useHistory} from "react-router-dom";
import {Button, Form} from "reactstrap";

export default function Login() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [validation, setIsValid] = useState();

    function verifyUser() {
        // TODO: zrobic to chytrze, a nie w parametrach
         fetch('/login?user=' + username + '&password=' + password, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => setIsValid(data.valid));
    }
    let history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();
        verifyUser();
        console.log(validation)
        if (validation) {
            sessionStorage.setItem('isUserValid', 'true');
            history.push('/expenses')
        } else {
            sessionStorage.setItem('isUserValid', 'false');
        }
    }



    return (
        <div className="login-wrapper">
            <Form onSubmit={handleSubmit}>
                <label>
                    <p>Uzytkownik</p>
                    <input type="text" onChange={e => setUserName(e.target.value)}/>
                </label>
                <label>
                    <p>Haslo</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <Button color='light'>Login</Button>
                </div>
            </Form>
        </div>
    )
}