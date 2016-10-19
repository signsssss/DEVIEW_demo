export const INCREMENT = "INCREMENT"
export const SELECT_PING = "SELECT_PING"
export const SET_IP = "SET_IP"
export const SET_PORT = "SET_PORT"
export const SET_SIZE = "SET_SIZE"
export const SET_PING_CHART = "SET_PING_CHART"

export function increase() {
    return {
        type: INCREMENT
    }
}

export function selectPing(value) {
    return {
        type: SELECT_PING,
        value: value
    }
}

export function setIp(ip) {
    return {
        type: SET_IP,
        ip: ip
    }
}

export function setPort(port) {
    return {
        type: SET_PORT,
        port: port
    }
}

export function setPacketSize(size) {
    return {
        type: SET_SIZE,
        size: size
    }
}

export function setPingChart(data) {
    return {
        type: SET_PING_CHART,
        data: data
    }
}
