import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from "../../AppNavBar";
import {Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import ExpensePlanner from "./ExpensePlanner";
import IncomePlanner from "./IncomePlanner";
import BudgetRealization from "./BudgetRealization";
import PanelNavBar from "../PanelNavBar";
import MonthManager from "../MonthManager";

class MonthPlanner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            activeTab: 'expenses',
            expenseSummary: 0,
            incomesSummary: 0
        }
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentDidMount() {
        this.getExpenseSummary(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
        this.getIncomeSummary(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1);
    }

    handleDateChange(date) {
        this.getExpenseSummary(date.getFullYear(), date.getMonth() + 1)
        this.getIncomeSummary(date.getFullYear(), date.getMonth() + 1)
        this.setState({currentDate: date})
    }

    getExpenseSummary(year, month) {
        fetch('/planner/expenses/summary?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({expenseSummary: data}));
    }

    getIncomeSummary(year, month) {
        fetch('/planner/incomes/summary?year=' + year + '&month=' + month)
            .then(response => response.json())
            .then(data => this.setState({incomesSummary: data}));
    }

    render() {
        return (
            <div>
                <AppNavBar/>
                <Container fluid>
                    <div>
                        <br/>
                        <Container>
                            <MonthManager currentDate={this.state.currentDate}
                                          handleDateChange={this.handleDateChange.bind(this)}/>
                            <PanelNavBar month={this.state.currentDate.getMonth() + 1} panelName={'Planer budzetu'}/>
                            <BudgetRealization expenseSummary={this.state.expenseSummary}
                                               incomesSummary={this.state.incomesSummary}/>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink style={{color: 'white', background: '#6c757d', margin: 5}} className="text-uppercase "
                                             onClick={() => this.setState({activeTab: 'expenses'})}> Wydatki
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink style={{color: 'white', background: '#6c757d', margin: 5}} className="text-uppercase"
                                             onClick={() => this.setState({activeTab: 'incomes'})}> Przychody
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="expenses">
                                    <Row>
                                        <Col>
                                            <ExpensePlanner year={this.state.currentDate.getFullYear()}
                                                            month={this.state.currentDate.getMonth() + 1}/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="incomes">
                                    <IncomePlanner year={this.state.currentDate.getFullYear()}
                                                   month={this.state.currentDate.getMonth() + 1}/>
                                </TabPane>
                            </TabContent>
                        </Container>
                    </div>
                </Container>
            </div>
        );
    }
}

export default MonthPlanner;