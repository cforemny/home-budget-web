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

class PlannedExpensesMonthSummary extends Component {
    render() {
        const expensesSum = this.props.expensesSum;
        const plannedExpensesSum = this.props.plannedExpensesSum;
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Realizacja wydatkow',
                },
            },
        };

        const labels = ['Zestawienie'];

        const data = {
            labels,
            datasets: [
                {
                    label: 'Reczywiste wydatki',
                    data: labels.map(() => expensesSum),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Zaplanowane wydatki',
                    data: labels.map(() => plannedExpensesSum),
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        };
        return <Bar options={options} data={data}/>;
    }
}

export default PlannedExpensesMonthSummary;
