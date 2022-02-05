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

class PlannedIncomesMonthSummary extends Component {
    render() {
        const incomesSum = this.props.incomesSum;
        const plannedIncomesSum = this.props.plannedIncomesSum;
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Realizacja przychodow',
                },
            },
        };

        const labels = ['Zestawienie'];

        const data = {
            labels,
            datasets: [
                {
                    label: 'Reczywiste przychody',
                    data: labels.map(() => incomesSum),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Zaplanowane przychody',
                    data: labels.map(() => plannedIncomesSum),
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        };
        return <Bar options={options} data={data}/>;
    }
}

export default PlannedIncomesMonthSummary;
