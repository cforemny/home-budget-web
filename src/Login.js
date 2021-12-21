import React, {useState} from 'react';
import PropTypes from 'prop-types';

async function loginUser(userName) {
    return fetch('/login?user=' + userName, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export default function Login({ setToken }) {
    const [username, setUserName] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        if('cyp' === username){
            sessionStorage.setItem('token', 'true');
        }else {
            sessionStorage.setItem('token', 'false');
        }

    }

    return(
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Uzytkownik</p>
                    <input type="text" onChange={e => setUserName(e.target.value)} />
                </label>
                {/*<label>*/}
                {/*    <p>Haslo</p>*/}
                {/*    <input type="password" onChange={e => setPassword(e.target.value)} />*/}
                {/*</label>*/}
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};