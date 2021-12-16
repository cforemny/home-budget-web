import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from "../AppNavBar";
import {Button, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import MonthPlanner from "./MonthPlanner";

class PlannerNavBar extends Component {

    constructor(props) {
        super(props);
        let today = new Date();
        this.state = {
            currentDate: today,
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            activeTab: "expenses",
            expenseCategories: [],
            plannedExpenses: []
        }
    }

    componentDidMount() {
        this.getPlannedExpenses(this.state.year, this.state.month);
        this.getCategories();
    }

    getCategories() {
        fetch('/categories/expense')
            .then(response => response.json())
            .then(data => this.setState({expenseCategories: data}));
    }

    increaseDate() {
        let actualYear = this.state.year
        let actualMonth = this.state.month
        if (actualMonth === 12) {
            let nextYear = actualYear + 1
            this.setState({year: nextYear})
            this.setState({month: 1})
            this.getPlannedExpenses(nextYear, 1)
        } else {
            let nextMonth = actualMonth + 1;
            this.setState({month: nextMonth})
            this.getPlannedExpenses(this.state.year, nextMonth)
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
        } else {
            let previousMonth = actualMonth - 1;
            this.setState({month: previousMonth})
            this.getPlannedExpenses(this.state.year, previousMonth)
        }
    }

    getPlannedExpenses(year, month) {
        fetch('/planner/expenses?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({plannedExpenses: data}));
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
                        <Nav tabs light>
                            <NavItem>
                                <NavLink onClick={() => this.setState({activeTab: 'expenses'})}> Wydatki
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={() => this.setState({activeTab: 'incomes'})}> Przychody
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="expenses">
                                <Row>
                                    <Col sm="120">
                                        <MonthPlanner year={this.state.year} month={this.state.month}
                                                      plannedExpenses={this.state.plannedExpenses}
                                                      expenseCategories={this.state.expenseCategories}/>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="incomes">
                                tutaj beda planowane przychody
                            </TabPane>
                        </TabContent>
                    </div>
                </Container>
            </div>
        );
    }
}

export default PlannerNavBar;