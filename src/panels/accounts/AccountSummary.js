import React, {Component} from 'react';
import {Button, Container, Table} from 'reactstrap';
import AppNavBar from '../../AppNavBar';
import MonthManager from "../MonthManager";
import PanelNavBar from "../PanelNavBar";
import {Link} from "react-router-dom";

class AccountSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            accounts: []
        };
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentDidMount() {
        this.getAccounts(this.state.currentDate);
    }

    getFormattedDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return year + '-' + month + '-' + day;
    }

    getAccounts(date) {
        let formattedDate = this.getFormattedDate(date)
        fetch('/account?date=' + formattedDate)
            .then(response => response.json())
            .then(data => this.setState({accounts: data}));
    }

    handleDateChange(date) {
        this.getAccounts(date)
        this.setState({currentDate: date})
    }

    renderTableData() {
        return this.state.accounts.map(account => {
            return (
                <tr key={account.id}>
                    <td>{account.description}</td>
                    <td>{account.moneyAmount}</td>
                    <td>
                        <Button size="sm" color="primary" tag={Link}
                                to={"/accounts/" + account.id}>Edytuj</Button>
                    </td>
                </tr>
            )
        })
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
                            <PanelNavBar month={this.state.currentDate.getMonth() + 1} panelName={'Stan kont'}/>
                            <div>
                                <Table responsive hover>
                                    <thead>
                                    <tr>
                                        <th>Nazwa konta</th>
                                        <th>Stan konta</th>
                                        <th>Akcja</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.renderTableData()}
                                    <tr>
                                        <td><strong>Suma</strong></td>
                                        <td><strong>{this.state.accounts.reduce((a, v) => a + v.moneyAmount, 0)}zł</strong></td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Container>
                    </div>
                </Container>
            </div>
        )
    }
}

export default AccountSummary;