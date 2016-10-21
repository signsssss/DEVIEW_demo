import update from 'react-addons-update';
import { combineReducers } from 'redux';
import { INCREMENT, SELECT_PING, SET_IP,
    SET_PORT, SET_SIZE, SET_PING_CHART,
    SET_ECHO_CHART, SET_THROUGHPUT_CHART, SET_LATENCY_CHART } from '../actions';

const initialState = {
    value: 0,
    linux_config: {
        ip:'192.168.10.152',    // 192.168.10.152
        port: '7'               // 7
    },
    packetngin_config: {
        ip:'192.168.10.151',     // 192.168.10.151
        port: '7'
    },
    packet_size: 64,
    chart_data: {
        latency: {
            packetngin: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
            linux:  [20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1],
            count: 0
        },
        throughput: {
            packetngin: [20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1],
            linux: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
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
                packet_size: { $set: action.size }
            })

        case SET_PING_CHART:
            return update(state, {
                chart_data: {
                    ping_linux: {
                        data: { $set: action.data.linux },
                        count: { $set: action.data.count }
                    },
                    ping_packetngin: {
                        data: { $set: action.data.packetngin },
                        count: { $set: action.data.count }
                    }
                }
            })

        case SET_ECHO_CHART:
            return update(state, {
                chart_data: {
                    echo_linux: {
                        data: { $set: action.data.linux },
                        count: { $set: action.data.count }
                    },
                    echo_packetngin: {
                        data: { $set: action.data.packetngin },
                        count: { $set: action.data.count }
                    }
                }
            })

        case SET_THROUGHPUT_CHART:
            return update(state, {
                chart_data: {
                    throughput: {
                        packetngin: { $set: action.data.packetngin },
                        linux: { $set: action.data.linux },
                        count: { $set: action.data.count }
                    }
                }
            })

        case SET_LATENCY_CHART:
            return update(state, {
                chart_data: {
                    latency: {
                        packetngin: { $set: action.data.packetngin },
                        linux: { $set: action.data.linux },
                        count: { $set: action.data.count }
                    }
                }
            })

        default:
            return state;
    }
}
