import React, {Component} from 'react';
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

class ExpenseSummary extends Component {

    render() {
        const expenses = this.props.expenses;
        const data = {
            labels: expenses.map((expense => expense.description)),
            datasets: [
                {
                    data: expenses.map((expense => expense.value)),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(155, 139, 74, 1)',
                        'rgba(235, 109, 64, 2)',
                        'rgba(135, 69, 54, 2)',
                        'rgba(135, 109, 24, 2)',
                        'rgba(135, 99, 14, 2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(155, 139, 74, 1)',
                        'rgba(235, 109, 64, 2)',
                        'rgba(135, 69, 54, 2)',
                        'rgba(135, 109, 24, 2)',
                        'rgba(135, 99, 14, 2)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
        return <Doughnut data={data}/>;
    }
}

export default ExpenseSummary;
