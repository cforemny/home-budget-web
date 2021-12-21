import React, {Component} from 'react';
import './App.css';
import Home from './Home';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ExpenseList from './lists/ExpenseList';
import ExpenseEdit from "./editors/ExpenseEdit";
import IncomeList from "./lists/IncomeList";
import IncomeEdit from "./editors/IncomeEdit";
import AdminPanel from "./panels/AdminPanel";
import SummaryPanel from "./panels/summary/SummaryPanel";
import MonthPlanner from "./panels/planner/MonthPlanner";


class App extends Component {

    getToken(){
         let token = sessionStorage.getItem('token');

         return token;
    }

    render() {
        if (this.getToken() === 'false') {
            return (
                <Home/>
        )
        } else {
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
                    </Switch>
                </Router>
            )
        }
    }
}

export default App;