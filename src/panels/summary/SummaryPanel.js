import React, {Component} from 'react';
import AppNavBar from '../../AppNavBar';
import ExpenseSummary from "./ExpenseSummary";
import {Col, Container, Row} from "reactstrap";
import IncomeSummary from "./IncomeSummary";
import MonthSummary from "./MonthSummary";
import PanelNavBar from "../PanelNavBar";
import MonthManager from "../MonthManager";

class SummaryPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expenses: [],
            incomes: [],
            expensesSum: 0,
            incomesSum: 0,
            currentDate:  new Date()
        };
    }

    componentDidMount() {
        this.fetchExpenseSummary(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
        this.fetchIncomesSummary(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
        this.fetchExpenseSummaryValue(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
        this.fetchIncomesSummaryValue(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1)
    }

    handleDateChange(date) {
        this.setState({currentDate: date})
        this.fetchExpenseSummary(date.getFullYear(), date.getMonth() + 1);
        this.fetchIncomesSummary(date.getFullYear(), date.getMonth() + 1);
        this.fetchExpenseSummaryValue(date.getFullYear(), date.getMonth() + 1);
        this.fetchIncomesSummaryValue(date.getFullYear(), date.getMonth() + 1)
    }

    fetchExpenseSummary(year, month) {
       fetch('/expenses/summary/category?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({expenses: data}));
    }

    fetchIncomesSummary(year, month) {
       fetch('/incomes/summary/category?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({incomes: data}));
    }

    fetchExpenseSummaryValue(year, month) {
       fetch('/expenses/summary?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({expensesSum: data.value}));
    }

    fetchIncomesSummaryValue(year, month) {
       fetch('/incomes/summary?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({incomesSum: data.value}));
    }

    render() {
        return (
            <div>
                <AppNavBar/>
                <MonthManager currentDate={this.state.currentDate} handleDateChange={this.handleDateChange.bind(this)}/>
                <Container fluid="sm">
                    <PanelNavBar month={this.state.currentDate.getMonth() + 1} panelName={'Podsumowanie miesiaca: '} />
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