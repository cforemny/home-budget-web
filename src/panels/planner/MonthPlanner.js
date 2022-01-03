import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from "../../AppNavBar";
import {Button, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import ExpensePlanner from "./ExpensePlanner";
import IncomePlanner from "./IncomePlanner";
import BudgetRealization from "./BudgetRealization";

class MonthPlanner extends Component {

    constructor(props) {
        super(props);
        let today = new Date();
        this.state = {
            currentDate: today,
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            activeTab: 'expenses',
            expenseSummary: 0,
            incomesSummary: 0
        }
    }

    componentDidMount() {
        this.getExpenseSummary(this.state.year, this.state.month);
        this.getIncomeSummary(this.state.year, this.state.month);
    }

    getExpenseSummary(year, month) {
        fetch('http://46.41.137.113:8090/planner/expenses/summary?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({expenseSummary: data}));
    }

    getIncomeSummary(year, month) {
        fetch('http://46.41.137.113:8090/planner/incomes/summary?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({incomesSummary: data}));
    }

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
                        <BudgetRealization expenseSummary={this.state.expenseSummary} incomesSummary={this.state.incomesSummary}/>
                        <Nav tabs>
                            <NavItem>
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
                                    <Col>
                                        <ExpensePlanner year={this.state.year} month={this.state.month}/>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="incomes">
                                <IncomePlanner year={this.state.year} month={this.state.month}/>
                            </TabPane>
                        </TabContent>
                    </div>
                </Container>
            </div>
        );
    }
}

export default MonthPlanner;