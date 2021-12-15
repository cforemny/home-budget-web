import React, {Component} from 'react';
import './App.css';
import AppNavBar from './AppNavBar';
import {Container} from 'reactstrap';
import zyd from './zyd.png';

class Home extends Component {
    render() {
        return (
            <div>
                <AppNavBar/>
                <Container fluid>
                    <img src={zyd}/>
                </Container>
            </div>
        );
    }
}
export default Home;