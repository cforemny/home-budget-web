import React, {Component} from 'react';
import {Button} from "reactstrap";

export default class MonthManager extends Component {

    subtractMonth() {
        let now =this.props.currentDate
        if (now.getMonth() === 0) {
            return new Date(now.getFullYear() -1, 11);
        } else {
            return new Date(now.getFullYear(), now.getMonth() - 1);
        }
    }

    addMonth() {
        let now =this.props.currentDate
        if (now.getMonth() === 11) {
            return new Date(now.getFullYear() + 1, 0, 1);
        } else {
            return new Date(now.getFullYear(), now.getMonth() + 1);
        }
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