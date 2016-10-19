import update from 'react-addons-update';
import { combineReducers } from 'redux';
import { INCREMENT, SELECT_PING, SET_IP,
    SET_PORT, SET_SIZE, SET_PING_CHART } from '../actions';

const initialState = {
    value: 0,
    inputs: {
        ping: true,
        ip:'127.0.0.1',
        port: '8000',
        size_options: [ 64, 128, 256, 512, 1024, 1500 ],
        selected_size: 0
    },
    chart_data: {
        ping_throughput: {
            data: [1, 2, 3, 4, 5],
            count: 0
        },
        ping_latency: {
            data: [],
            count: 0
        },
        echo_throughput: {
            data: [],
            count: 0
        },
        echo_latency: {
            data: [],
            count: 0
        }
    }
};

export default function mainReducer(state = initialState, action) {
    switch(action.type) {
        case INCREMENT:
            return update(state, {
                value: { $set: state.value + 1 }
            });

        case SELECT_PING:
            return update(state, {
                inputs: {
                    ping: { $set: action.value }
                }
            })

        case SET_IP:
            return update(state, {
                inputs: {
                    ip: { $set: action.ip }
                }
            })

        case SET_PORT:
            return update(state, {
                inputs: {
                    port: { $set: action.port }
                }
            })

        case SET_SIZE:
            return update(state, {
                inputs: {
                    selected_size: { $set: action.size }
                }
            })

        case SET_PING_CHART:
            return update(state, {
                chart_data: {
                    ping_latency: {
                        data: { $set: action.data.latency }
                    },
                    ping_throughput: {
                        data: { $set: action.data.throughput }
                    }
                }
            })

        default:
            return state;
    }
}
