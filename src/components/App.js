import React from 'react';

import Form from './Form';
import Chart from './Chart';
import styles from './App.css';

import axios from 'axios';

import { connect } from 'react-redux';
import { setPacketSize, setThroughputChart, setLatencyChart } from '../actions'

const Rcslider = require('rc-slider');

class App extends React.Component {
    constructor(props) {
        super(props);

        this.onSliderChange = this.onSliderChange.bind(this);
    }

    componentDidMount() {
        // axios.get('/1/parse').then(response => {
        //     console.log('data parsed!');
        // })

        let getThroughputData = () => {
            axios.get('/1/throughput').then(response => {
                this.props.setThroughputChart(response.data.data);
            })
        };

        axios.post('/1/throughput', { linux_config: this.props.linux_config, packetngin_config: this.props.packetngin_config, packet_size: this.props.packet_size })
        .then(response => {
            this.throughput_request = setInterval(getThroughputData, 1000);
        })

        // let getLatencyData = () => {
        //     axios.get('/1/latency').then(response => {
        //         this.props.setLatencyChart(response.data.data);
        //     })
        // };
        //
        // axios.post('/1/latency', { linux_config: this.props.linux_config, packetngin_config:this.props.packetngin_config })
        // .then(response => {
        //     this.latency_request = setInterval(getLatencyData, 1000)
        // })
    }

    componentWillUnmount() {
        console.log('compnent will be unmounted');
        clearInterval(this.throughput_request);
    }

    render() {
        const marks = {
            0: '',
            4: '64',
            10: '128',
            18: '256',
            32: '512',
            64: '1024',
            100: '1500'
        }

        return (
            <div>
                <div className={styles.slider_area}>
                    <div className={styles.slider_label}>Packet Size</div>
                    <Rcslider min={0} marks={marks} step={null} onChange={this.onSliderChange} />
                </div>
                <div className={styles.charts_area}>
                    <div className={styles.throughput_charts}>
                        <Chart title="Throughput" data={this.props.chart_data.throughput} />
                    </div>
                </div>
            </div>
        );
    }

    onSliderChange(value) {
        let packet_size = 64;
        console.log(value);
        switch(value) {
            case 0:
                packet_size = 64;
                break;
            case 4:
                packet_size = 64;
                break;
            case 10:
                packet_size = 128;
                break;
            case 18:
                packet_size = 256;
                break;
            case 32:
                packet_size = 512;
                break;
            case 64:
                packet_size = 1024;
                break;
            case 100:
                packet_size = 1500;
                break;
            default:
                packet_size = 64;
        }
        console.log('packet_size:', packet_size);
        this.props.setPacketSize(packet_size);

        let getThroughputData = () => {
            axios.get('/1/throughput').then(response => {
                this.props.setThroughputChart(response.data.data);
            })
        };

        if(this.throughput_request) {
            console.log('packet size changed, re-post throughput data');
            clearInterval(this.throughput_request);

            axios.post('/1/throughput', { linux_config: this.props.linux_config, packetngin_config: this.props.packetngin_config, packet_size: packet_size })
            .then(response => {
                this.throughput_request = setInterval(getThroughputData, 1000);
            })
        }
    }
}

const mapStateToProps = (state) => {
    return {
        linux_config: state.linux_config,
        packetngin_config: state.packetngin_config,
        packet_size: state.packet_size,
        chart_data: state.chart_data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPacketSize: (size) => dispatch(setPacketSize(size)),
        setThroughputChart: (data) => dispatch(setThroughputChart(data)),
        setLatencyChart: (data) => dispatch(setLatencyChart(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
