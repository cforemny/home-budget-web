import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from "../../AppNavBar";
import {Button, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import ExpensePlanner from "./ExpensePlanner";
import IncomePlanner from "./IncomePlanner";

class MonthPlanner extends Component {

    constructor(props) {
        super(props);
        let today = new Date();
        this.state = {
            currentDate: today,
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            activeTab: "expenses",
            expenseCategories: [],
            incomeCategories: [],
            plannedExpenses: [],
            plannedIncomes: []
        }
    }

    componentDidMount() {
        this.getPlannedExpenses(this.state.year, this.state.month);
        this.getPlannedIncomes(this.state.year, this.state.month)
        this.getExpenseCategories();
        this.getIncomeCategories();
    }

    getExpenseCategories() {
        fetch('/categories/expense')
            .then(response => response.json())
            .then(data => this.setState({expenseCategories: data}));
    }

    getIncomeCategories() {
        fetch('/categories/income')
            .then(response => response.json())
            .then(data => this.setState({incomeCategories: data}));
    }

    increaseDate() {
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 12) {
            let nextYear = actualYear + 1
            this.setState({year: nextYear})
            this.setState({month: 1})
            this.getPlannedExpenses(nextYear, 1)
            this.getPlannedIncomes(nextYear, 1)
        } else {
            let nextMonth = actualMonth + 1;
            this.setState({month: nextMonth})
            this.getPlannedExpenses(this.state.year, nextMonth)
            this.getPlannedIncomes(this.state.year, nextMonth)
        }
    }

    decreaseDate() {
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 1) {
            let previousYear = actualYear - 1
            this.setState({year: previousYear})
            this.setState({month: 12})
            this.getPlannedExpenses(previousYear, 12)
            this.getPlannedIncomes(previousYear, 12)
        } else {
            let previousMonth = actualMonth - 1;
            this.setState({month: previousMonth})
            this.getPlannedExpenses(this.state.year, previousMonth)
            this.getPlannedIncomes(this.state.year, previousMonth)
        }
    }

    getPlannedExpenses(year, month) {
        fetch('/planner/expenses?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({plannedExpenses: data}));
    }

    getPlannedIncomes(year, month) {
        fetch('/planner/incomes?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({plannedIncomes: data}));
    }

    render() {
        return (
            <div>
                <AppNavBar/>
                <Container fluid>
                    <div>
                        <h3>Planer budzetu na {this.state.month}-{this.state.year}</h3>
                        <div style={{padding: 10}}>
                            <Button color='light' onClick={() => this.decreaseDate()}>Poprzedni
                                miesiac
                            </Button>{' '}
                            <Button color='light' onClick={() => this.increaseDate()}>Nastepny
                                miesiac
                            </Button>
                        </div>
                        <Nav tabs>
                            <NavItem >
                                <NavLink onClick={() => this.setState({activeTab: 'expenses'})}> Wydatki
                                </NavLink>
                            </NavItem>
                            <NavItem color='light'>
                                <NavLink onClick={() => this.setState({activeTab: 'incomes'})}> Przychody
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="expenses">
                                <Row>
                                    <Col sm="120">
                                        <ExpensePlanner year={this.state.year} month={this.state.month}
                                                        plannedExpenses={this.state.plannedExpenses}
                                                        expenseCategories={this.state.expenseCategories}/>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="incomes">
                                <IncomePlanner year={this.state.year} month={this.state.month}
                                               plannedIncomes={this.state.plannedIncomes}
                                                incomesCategories={this.state.incomeCategories}/>
                            </TabPane>
                        </TabContent>
                    </div>
                </Container>
            </div>
        );
    }
}

export default MonthPlanner;