import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { selectPing, setIp, setPort, setPacketSize, setPingChart, setEchoChart } from '../actions';
import styles from './Form.css';

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.onRadioChange = this.onRadioChange.bind(this);
        this.onIpChange = this.onIpChange.bind(this);
        this.onPortChange = this.onPortChange.bind(this);
        this.onSizeChange = this.onSizeChange.bind(this);
        this.onStartClick = this.onStartClick.bind(this);
        this.onAbortClick = this.onAbortClick.bind(this);
    }

    render() {
        return (
            <div>
                <form className={styles.form}>
                    <ul>
                        <li className={styles.radio_group}>
                            <label className={styles.radio_label}><input type='radio' name='ping' value='ping' checked={this.props.inputs.ping} onChange={this.onRadioChange} /><span>Ping</span></label>
                            <label className={styles.radio_label}><input type='radio' name='ping' value='echo' checked={!this.props.inputs.ping} onChange={this.onRadioChange} /><span>Echo</span></label>
                        </li>
                        <li>
                            <span className={styles.styled_input}>
                                <label htmlFor='ip'><span>IP</span></label>
                                <input type='text' name='ip' value={ this.props.inputs.ip } onChange={this.onIpChange} />
                            </span>
                        </li>

                        {(this.props.inputs.ping
                            ? null
                            : <li>
                                <span className={styles.styled_input}>
                                    <label htmlFor='port'><span>Port</span></label>
                                    <input type='text' name='port' value={ this.props.inputs.port } onChange={this.onPortChange} />
                                </span>
                            </li>

                        )}

                        {(this.props.inputs.ping
                            ? null
                            : <li>
                                <select name='size_options' onChange={this.onSizeChange}>
                                    <option value=''>Packet Size</option>
                                    {(this.props.inputs.size_options).map((data, index) => {
                                        return (
                                            <option value={data} key={index}>{data}</option>
                                        );
                                    })}
                                </select>
                            </li>

                        )}

                        <li className={styles.button_group}>
                            <button type="button" onClick={this.onStartClick}>Start</button>
                            <button type="button" onClick={this.onAbortClick}>Abort</button>
                        </li>
                    </ul>
                </form>
            </div>
        )
    }

    onRadioChange(e) {
        if(e.target.value == 'ping') {
            this.props.selectPing(true);
        } else if(e.target.value == 'echo') {
            this.props.selectPing(false);
        }
    }

    onIpChange(e) {
        this.props.setIp(e.target.value);
    }

    onPortChange(e) {
        this.props.setPort(e.target.value);
    }

    onSizeChange(e) {
        this.props.setPacketSize(e.target.value);
    }

    onStartClick() {
        let getData;
        if(this.props.inputs.ping) {
            getData = () => {
                axios.get('/1/ping').then(response => {
                    console.log(response.data.ping_data);
                    this.props.setPingChart(response.data.ping_data);
                })
            };

            axios.post('/1/ping', { ip: this.props.inputs.ip })
            .then(response => {
                    this.chart_request = setInterval(getData, 1000);
            })
        } else {
            getData = () => {
                axios.get('/1/echo').then(response => {
                    this.props.setEchoChart(response.data.data);
                })
            };

            axios.post('/1/echo', { ip: this.props.inputs.ip, port: this.props.inputs.port, packet_size: this.props.inputs.selected_size })
            .then(response => {
                this.chart_request = setInterval(getData, 1000);
            })
        }
    }

    onAbortClick() {
        if(this.chart_request) {
            console.log('clearing interval');
            clearInterval(this.chart_request);
        }
    }
}

const mapStateToProps = (state) => {
    return {
        inputs: state.inputs
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectPing: (value) => dispatch(selectPing(value)),
        setIp: (ip) => dispatch(setIp(ip)),
        setPort: (port) => dispatch(setPort(port)),
        setPacketSize: (size) => dispatch(setPacketSize(size)),
        setPingChart: (data) => dispatch(setPingChart(data)),
        setEchoChart: (data) => dispatch(setEchoChart(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)
