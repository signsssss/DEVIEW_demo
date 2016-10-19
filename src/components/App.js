import React from 'react';

import Form from './Form';
import Chart from './Chart';
import styles from './App.css';

import { connect } from 'react-redux';
import { increase } from '../actions'

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Form />
                <div className={styles.charts_area}>
                    <div className={styles.ping_charts}>
                        <Chart label='linux_throughput' data={this.props.chart_data.ping_throughput.data} count={this.props.chart_data.ping_throughput.count} />
                        <Chart label='linux_latency' data={this.props.chart_data.ping_latency.data} count={this.props.chart_data.ping_latency.count} />
                    </div>
                    <div className={styles.echo_charts}>
                        <Chart label='packetngin_throughput' data={this.props.chart_data.echo_throughput.data} count={this.props.chart_data.echo_throughput.count} />
                        <Chart label='packetngin_latency' data={this.props.chart_data.echo_latency.data} count={this.props.chart_data.echo_latency.count} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        chart_data: state.chart_data
    }
}

export default connect(mapStateToProps, null)(App)
