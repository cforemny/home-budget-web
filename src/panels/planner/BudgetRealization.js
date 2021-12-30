import React, {Component} from 'react';
import {Container, Table} from "reactstrap";

class BudgetRealization extends Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setBudgetRealizationSummaryBackgroundColor();
    }

    setBudgetRealizationSummaryBackgroundColor() {
        let element = document.getElementById("budgetRealizationSummary");
        let summary = this.props.incomesSummary - this.props.expenseSummary
        if (summary > 0) {
            element.className = 'bg-success';
        } else if (summary === 0) {
            element.className = 'bg-info';
        } else {
            element.className = 'bg-danger';
        }
    }

    render() {
        return (
            <Container fluid>
                <div>
                    <Table responsive hover>
                        <thead>
                        <tr>
                            <th>
                                Całkowity stopień realizacji budzetu
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                Planowana suma wydatków:
                            </td>
                            <td>
                                {this.props.expenseSummary} zł
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Planowana suma przychodow:
                            </td>
                            <td>
                                {this.props.incomesSummary} zł
                            </td>
                        </tr>
                        <tr id="budgetRealizationSummary">
                            <td>
                                Pozostaje do
                                rozdysponowania:
                            </td>
                            <td>
                                {this.props.incomesSummary - this.props.expenseSummary} zł
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            </Container>
        );
    }
}

export default BudgetRealization;