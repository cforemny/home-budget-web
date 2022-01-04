import React, {Component} from 'react';
import AppNavBar from '../../AppNavBar';
import ExpenseSummary from "./ExpenseSummary";
import {Button, Col, Container, Row} from "reactstrap";
import IncomeSummary from "./IncomeSummary";
import MonthSummary from "./MonthSummary";

class SummaryPanel extends Component {

    constructor(props) {
        let today = new Date();
        super(props);
        this.state = {
            expenses: [],
            incomes: [],
            expensesSum: 0,
            incomesSum: 0,
            month: today.getMonth() + 1,
            year: today.getFullYear()
        };
    }

    componentDidMount() {
        this.fetchExpenseSummary(this.state.year, this.state.month);
        this.fetchIncomesSummary(this.state.year, this.state.month);
        this.fetchExpenseSummaryValue(this.state.year, this.state.month);
        this.fetchIncomesSummaryValue(this.state.year, this.state.month)
    }

    increaseDate() {
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 12) {
            let nextYear = actualYear + 1
            this.setState({year: nextYear})
            this.setState({month: 1})
            this.fetchExpenseSummary(nextYear, 1);
            this.fetchIncomesSummary(nextYear, 1);
        } else {
            let nextMonth = actualMonth + 1;
            this.setState({month: nextMonth})
            this.fetchExpenseSummary(this.state.year, nextMonth);
            this.fetchIncomesSummary(this.state.year, nextMonth);
        }

    }

    decreaseDate() {
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 1) {
            let previousYear = actualYear - 1
            this.setState({year: previousYear})
            this.setState({month: 12})
            this.fetchExpenseSummary(previousYear, 12);
            this.fetchIncomesSummary(previousYear, 12);
        } else {
            let previousMonth = actualMonth - 1;
            this.setState({month: previousMonth})
            this.fetchExpenseSummary(this.state.year, previousMonth);
            this.fetchIncomesSummary(this.state.year, previousMonth);
        }

    }

    fetchExpenseSummary(year, month) {
        fetch('http://cypole.pl:8090/expenses/summary/category?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({expenses: data}));
    }

    fetchIncomesSummary(year, month) {
        fetch('http://cypole.pl:8090/incomes/summary/category?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({incomes: data}));
    }

    fetchExpenseSummaryValue(year, month) {
        fetch('http://cypole.pl:8090/expenses/summary?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({expensesSum: data.value}));
    }

    fetchIncomesSummaryValue(year, month) {
        fetch('http://cypole.pl:8090/incomes/summary?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({incomesSum: data.value}));
    }

    render() {
        return (
            <div>
                <AppNavBar/>
                <h3>Podsumowanie miesiaca {this.state.month}-{this.state.year}</h3>
                <div>
                    <Button color='light' onClick={() => this.decreaseDate()}>Poprzedni
                        miesiac
                    </Button>{' '}
                    <Button color='light' onClick={() => this.increaseDate()}>Nastepny
                        miesiac
                    </Button>
                </div>
                <Container fluid="sm">
                    <Row>
                        <Col>Rozkład wydatków<ExpenseSummary expenses={this.state.expenses}/></Col>
                        <Col>Rozkład przychodów <IncomeSummary incomes={this.state.incomes}/></Col>
                    </Row>
                    <Row>
                        <Col><MonthSummary expensesSum={this.state.expensesSum}
                                           incomesSum={this.state.incomesSum}/></Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default SummaryPanel;