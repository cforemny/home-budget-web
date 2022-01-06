import React, {Component} from 'react';
import {Button} from "reactstrap";

export default class MonthManager extends Component {
    increaseDate() {
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 12) {
            let nextYear = actualYear + 1
            this.setState({year: nextYear})
            this.setState({month: 1})
            this.getIncomeSummary(nextYear, 1)
            this.getExpenseSummary(nextYear, 1)
        } else {
            let nextMonth = actualMonth + 1;
            this.setState({month: nextMonth})
            this.getExpenseSummary(this.state.year, nextMonth)
            this.getIncomeSummary(this.state.year, nextMonth)
        }
    }

    decreaseDate() {
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 1) {
            let previousYear = actualYear - 1
            this.setState({year: previousYear})
            this.setState({month: 12})
            this.getExpenseSummary(previousYear, 12)
            this.getIncomeSummary(previousYear, 12)
        } else {
            let previousMonth = actualMonth - 1;
            this.setState({month: previousMonth})
            this.getExpenseSummary(this.state.year, previousMonth)
            this.getIncomeSummary(this.state.year, previousMonth)
        }
    }

    subtractMonth(){
        let date = this.props.currentDate
        date.setMonth(date.getMonth() - 1)
        return date;
    }

    addMonth(){
        let date = this.props.currentDate
        date.setMonth(date.getMonth() + 1)
        return date;
    }

    render() {
        let handleDateChange = this.props.handleDateChange;
        return (
        <div style={{padding: 10}}>
            <Button color='light' onClick={() => handleDateChange(this.subtractMonth())}>Poprzedni
                miesiac
            </Button>{' '}
            <Button color='light' onClick={() => handleDateChange(this.addMonth())}>Następny
                miesiac
            </Button>
        </div>
        );
    }
}