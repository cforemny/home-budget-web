import React, {Component} from 'react';
import './App.css';
import AppNavBar from './AppNavBar';

class Home extends Component {
    render() {
        return (
            <div>
                <AppNavBar/>
                <div fluid class="d-flex justify-content-center">
                    <p class="lead">
                        <br/>
                        <br/>
                        „Zrobić budżet to wskazać swoim pieniądzom, dokąd mają iść,zamiast się zastanawiać, gdzie się <br/>
                        rozeszły” – John C. Maxwell.
                    </p>
                </div>
            </div>
        );
    }
}

export default Home;