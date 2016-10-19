import React from 'react'
import { Line } from 'react-chartjs'
import styles from './Chart.css';

const chartOptions = {
    datasetFill: false,
    bezierCurve: false
}

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let data_labels = [];
        for(let i = this.props.count; i < 20; i++) {
            data_labels.push(i + 1);
        }

        let chartData = {
            labels: data_labels,
            datasets: [
                {
                    label: this.props.label,
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: this.props.data
                }
            ]
        };

        return (
            <div className={styles.chart}>
                <Line data={chartData} options={chartOptions} height='300' />
                <h2 className='chart-title'>{this.props.label}</h2>
            </div>
        )
    }

}

export default Chart
