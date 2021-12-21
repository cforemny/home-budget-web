import React, {Component} from 'react';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

class MonthSummary extends Component {

    render() {
        const expensesSum = this.props.expensesSum;
        const incomesSum = this.props.incomesSum;
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                // title: {
                //     display: true,
                //     text: 'Here i can add title',
                // },
            },
        };

        const labels = ['Zestawienie'];

        const data = {
            labels,
            datasets: [
                {
                    label: 'Wydatki',
                    data: labels.map(() => expensesSum),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Przychody',
                    data: labels.map(() => incomesSum),
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        };

        return <Bar options={options} data={data}/>;
    }
}

export default MonthSummary;
