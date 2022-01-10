import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ExpenseList from './panels/expenses/ExpenseList';
import ExpenseEdit from "./panels/expenses/ExpenseEdit";
import IncomeList from "./panels/incomes/IncomeList";
import IncomeEdit from "./panels/incomes/IncomeEdit";
import AdminPanel from "./panels/AdminPanel";
import SummaryPanel from "./panels/summary/SummaryPanel";
import MonthPlanner from "./panels/planner/MonthPlanner";
import AccountSummary from "./panels/accounts/AccountSummary";
import Home from "./Home";

class App extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         isUserValid: 'false'
    //     }
    // }
    //
    // componentDidMount() {
    //     this.setState({isUserValid: sessionStorage.getItem('isUserValid')});
    // }

    render() {
        // if (this.state.isUserValid !== 'true') {
        //     return (
        //         <Home/>
        //     )
        // } else {
            return (<Router>
                    <Switch>
                        <Route path='/' exact={true} component={Home}/>
                        <Route path='/expenses' exact={true} component={ExpenseList}/>
                        <Route path='/expenses/:id' component={ExpenseEdit}/>
                        <Route path='/incomes' exact={true} component={IncomeList}/>
                        <Route path='/incomes/:id' component={IncomeEdit}/>
                        <Route path='/admin-panel' exact={true} component={AdminPanel}/>
                        <Route path='/summary' exact={true} component={SummaryPanel}/>
                        <Route path='/planner' exact={true} component={MonthPlanner}/>
                        <Route path='/accounts' exact={true} component={AccountSummary}/>
                    </Switch>
                </Router>
            )
        }
    // }
}

export default App;