import React, {Component} from 'react';
import {Container, Table} from 'reactstrap';
import AppNavBar from '../../AppNavBar';
import MonthManager from "../MonthManager";
import PanelNavBar from "../PanelNavBar";

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
        const date = this.getFormattedDate();
        this.getAccounts(date);
    }

    getFormattedDate() {
        const dateObj = new Date();
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();

        return year + '-' + month + '-' + day;
    }

    getAccounts() {
        let date = this.getFormattedDate()
        fetch('/account?date=' + date)
            .then(response => response.json())
            .then(data => this.setState({accounts: data}));
    }

    handleDateChange(date) {
        this.setState({currentDate: date})
        this.getAccounts()
    }

    renderTableData() {
        console.log('rendruj dziadu')
        return this.state.accounts.map(account => {
            return (
                <tr key={account.id}>
                    <td>{account.description}</td>
                    <td>{account.moneyAmount}</td>
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
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Nazwa konta</th>
                                        <th>Stan konta</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.renderTableData()}
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