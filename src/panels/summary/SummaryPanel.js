import React, {Component} from 'react';
import AppNavBar from '../../AppNavBar';
import ExpenseSummary from "./ExpenseSummary";
import {Col, Container, Row} from "reactstrap";
import IncomeSummary from "./IncomeSummary";
import MonthSummary from "./MonthSummary";
import PanelNavBar from "../PanelNavBar";
import MonthManager from "../MonthManager";
import PlannedExpensesMonthSummary from "./PlannedExpensesMonthSummary";
import PlannedIncomesMonthSummary from "./PlannedIncomesMonthSummary";

class SummaryPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expenses: [],
            incomes: [],
            plannedExpensesSum: 0,
            plannedIncomesSum: 0,
            expensesSum: 0,
            incomesSum: 0,
            currentDate: new Date()
        };
    }

    componentDidMount() {
        this.fetchExpenseSummary(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
        this.fetchIncomesSummary(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
        this.fetchExpenseSummaryValue(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
        this.fetchIncomesSummaryValue(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
        this.fetchPlannedExpenses(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
        this.fetchPlannedIncomes(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
    }

    handleDateChange(date) {
        this.setState({currentDate: date})
        this.fetchExpenseSummary(date.getFullYear(), date.getMonth() + 1);
        this.fetchIncomesSummary(date.getFullYear(), date.getMonth() + 1);
        this.fetchExpenseSummaryValue(date.getFullYear(), date.getMonth() + 1);
        this.fetchIncomesSummaryValue(date.getFullYear(), date.getMonth() + 1)
        this.fetchPlannedIncomes(date.getFullYear(), date.getMonth() + 1)
        this.fetchPlannedExpenses(date.getFullYear(), date.getMonth() + 1)
    }

    fetchPlannedIncomes(year, month) {
        fetch('/planner/incomes/summary?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({plannedIncomesSum: data}));
    }


    fetchPlannedExpenses(year, month) {
        fetch('/planner/expenses/summary?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({plannedExpensesSum: data}));
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
                <br/>
                <Container fluid="sm">
                    <MonthManager currentDate={this.state.currentDate}
                                  handleDateChange={this.handleDateChange.bind(this)}/>
                    <PanelNavBar month={this.state.currentDate.getMonth() + 1} panelName={'Podsumowanie miesiaca: '}/>
                    <Row>
                        <Col><PlannedExpensesMonthSummary expensesSum={this.state.expensesSum}
                                                          plannedExpensesSum={this.state.plannedExpensesSum}/></Col>
                    </Row>
                    <Row>
                        <Col><PlannedIncomesMonthSummary incomesSum={this.state.incomesSum}
                                                         plannedIncomesSum={this.state.plannedIncomesSum}/></Col>
                    </Row>
                    <Row>
                        <Col><MonthSummary expensesSum={this.state.expensesSum}
                                           incomesSum={this.state.incomesSum}/></Col>
                    </Row>
                    <Row>
                        <Col>Rozkład wydatków<ExpenseSummary expenses={this.state.expenses}/></Col>
                        <Col>Rozkład przychodów<IncomeSummary incomes={this.state.incomes}/></Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default SummaryPanel;