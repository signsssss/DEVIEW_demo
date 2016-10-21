import React from 'react'
// import { Line } from 'react-chartjs'
import { Line, defaults } from 'react-chartjs-2';
import styles from './Chart.css';

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        defaults.global.animation = false;
        let data_labels = [];
        console.log('this.props.data.count', this.props.title, this.props.data.count);
        if(this.props.data.count >= 20) {
            for(let i = this.props.data.count; i < this.props.data.count + 20; i++) {
                data_labels.push(i - 19);
            }
        } else {
            for(let i = 0; i < 20; i++) {
                data_labels.push(i + 1);
            }
        }


        // let chartData = {
        //     labels: data_labels,
        //     datasets: [
        //         {
        //             label: this.props.label,
        //             fillColor: "rgba(220,220,220,0.2)",
        //             strokeColor: "rgba(220,220,220,1)",
        //             pointColor: "rgba(220,220,220,1)",
        //             pointStrokeColor: "#fff",
        //             pointHighlightFill: "#fff",
        //             pointHighlightStroke: "rgba(220,220,220,1)",
        //             data: this.props.data
        //         }
        //     ]
        // };

        let chartOptions = {
            title: {
                display: true,
                text: this.props.title,
                fontSize: 20,
                fontFamily: "'Segoe UI', 'Open Sans', sans-serif, serif",
                fontColor: '#062240'
            },
            legend: {
                display: true
            }
        }

        let chartData = {
            labels: data_labels,
            datasets: [
                {
                    label: 'Linux',
                    fill: false,
                    lineTension: 0.3,
                    backgroundColor: 'rgba(12,66,125,0.4)',
                    borderColor: 'rgba(12,66,125,1)',
                    borderWidth: 2,
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(12,66,125,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(12,66,125,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.props.data.linux
                },
                {
                    label: 'PacketNgin',
                    fill: false,
                    lineTension: 0.3,
                    backgroundColor: 'rgba(150,45,62,0.4)',
                    borderColor: 'rgba(150,45,62,1)',
                    borderWidth: 2,
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(150,45,62,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(150,45,62,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.props.data.packetngin
                }
            ]
        };

        return (
            <div className={styles.chart}>
                <Line data={chartData} options={chartOptions} height={800} width={1500} />
            </div>
        )
    }

}

export default Chart
