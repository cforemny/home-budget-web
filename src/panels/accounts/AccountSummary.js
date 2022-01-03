import React, {Component} from 'react';
import {Container, Table} from 'reactstrap';
import AppNavBar from '../../AppNavBar';

class AccountSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accounts: []
        };
    }

    componentDidMount() {
        let today = new Date()
        fetch('http://localhost:8090/account?date=' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate())
            .then(response => response.json())
            .then(data => this.setState({accounts: data}));
    }

    renderTableData(monthIndex) {
        console.log('index' + monthIndex)
        return this.state.accounts.map(account => {
            console.log(account.insertDate.substring(5, 7))
            if (account.insertDate.substring(5, 7) === monthIndex) {
                return (
                    <tr key={account.id}>
                        <td>{account.description}</td>
                        <td>{account.moneyAmount} zł</td>
                    </tr>
                )
            } else {
                return null;
            }
        });
    }

    renderMonths(months) {
        return months.map((month => {
            return (
                <tr>
                    <td>
                        {month}
                    </td>
                    {this.state.accounts}.map((account => {

                })
                </tr>
            )
        }))
    }


    render() {
        const months = [
            'Styczeń',
            'Luty',
            'Marzec',
            'Kwiecien',
            'Maj',
            'Czerwiec',
            'Lipiec',
            'Sierpień',
            'Wrzesień',
            'Październik',
            'Listopad',
            'Grudzien'
        ]
        return <div>
            <AppNavBar/>
            <Container fluid>
                <h3>Stan kont</h3>
                <div>
                    <Table>
                        {this.renderMonths(months)}
                        <tbody>

                        </tbody>
                    </Table>
                </div>
            </Container>
        </div>
    }
}

export default AccountSummary;