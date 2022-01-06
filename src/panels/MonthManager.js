import React, {Component} from 'react';
import {Button} from "reactstrap";

export default class MonthManager extends Component {

    subtractMonth() {
        let date = this.props.currentDate
        date.setMonth(date.getMonth() - 1)
        return date;
    }

    addMonth() {
        let date = this.props.currentDate
        date.setMonth(date.getMonth() + 1)
        return date;
    }

    render() {
        let handleDateChange = this.props.handleDateChange;
        return (
            <div>
                <Button onClick={() => handleDateChange(this.subtractMonth())}>Poprzedni
                    miesiac
                </Button>{' '}
                <Button onClick={() => handleDateChange(this.addMonth())}>Następny
                    miesiac
                </Button>
            </div>
        );
    }
}