import React, {Component} from 'react';
import {Button} from "reactstrap";

export default class MonthManager extends Component {

    render() {
        return (
            <div>
                <Button color='light' onClick={() => this.decreaseDate()}>
                    Poprzedni miesiac
                </Button>{' '}
                <Button color='light' onClick={() => this.increaseDate()}>
                    Nastepny miesiac
                </Button>
            </div>
        );
    }
}