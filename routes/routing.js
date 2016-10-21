import express from 'express';
import colors from 'colors';

const fs = require('fs');
const child_process = require('child_process');

let router = express.Router();

let latency_data = {
    linux: [],
    packetngin: [],
    count: 0
}
let throughput_data = {
    linux: [],
    packetngin: [],
    count: 0
}

let linux_throughput;
let packetngin_throughput;
let linux_latency;
let packetngin_latency;

router.post('/throughput', (req, res) => {
    throughput_data.count = 0;
    throughput_data.packetngin = [];
    throughput_data.linux = [];
    let packet_size = req.body.packet_size;

    packetngin_throughput = child_process.spawn('java', ['-jar', 'udpecho.jar', req.body.packet_size, req.body.packetngin_config.ip, req.body.packetngin_config.port]);
    linux_throughput = child_process.spawn('java', ['-jar', 'udpecho.jar', packet_size, req.body.linux_config.ip, req.body.linux_config.port]);

    packetngin_throughput.stdout.on('data', (data) => {
        let temp = data.toString().match(/\S+/g) || [];

        if(temp.length == 4) {
            if(throughput_data.packetngin.length >= 20) {
                throughput_data.packetngin.shift();
            }

            throughput_data.packetngin.push(temp[1] * packet_size);
        } else {    // fail safe for stdout parsing bug
            if(throughput_data.packetngin.length == 0) {
                throughput_data.packetngin.push(0)  // any other good idea?
            } else {
                if(throughput_data.packetngin.length >= 20) {
                    throughput_data.packetngin.shift();
                }

                throughput_data.packetngin.push(throughput_data.packetngin[throughput_data.packetngin.length - 1])
            }

        }
    })

    linux_throughput.stdout.on('data', (data) => {
        let temp = data.toString().match(/\S+/g) || [];

        if(temp.length == 4) {
            if(throughput_data.linux.length >= 20) {
                throughput_data.linux.shift();
            }

            console.log(temp[1]);
            throughput_data.linux.push(temp[1] * packet_size);
        } else {
            if(throughput_data.linux.length == 0) {
                throughput_data.linux.push(0);
            } else {
                if(throughput_data.linux.length >= 20) {
                    throughput_data.linux.shift();
                }

                throughput_data.linux.push(throughput_data.linux[throughput_data.linux.length - 1])
            }
        }
    })

    res.json({ data: 1 });
})

router.get('/throughput', (req, res) => {
    if(throughput_data.linux.length !== throughput_data.packetngin.length) {
        if(throughput_data.packetngin.length > throughput_data.linux.length) {
            let diff = throughput_data.packetngin.length - throughput_data.linux.length;

            for(let i = 0; i < diff; i++) {
                throughput_data.packetngin.shift()
            }
        } else {
            let diff = throughput_data.linux.length - throughput_data.packetngin.length;

            for(let i = 0; i < diff; i++) {
                throughput_data.linux.shift();
            }
        }

        throughput_data.count = throughput_data.packetngin.length;
    } else {
        throughput_data.count++;
    }

    res.json({ data: throughput_data })
})

router.post('/latency', (req, res) => {
    latency_data.count = 0;
    latency_data.packetngin = [];
    latency_data.linux = [];

    packetngin_latency = child_process.spawn('ping', [req.body.packetngin_config.ip]);
    linux_latency = child_process.spawn('ping', [req.body.linux_config.ip]);

    packetngin_latency.stdout.on('data', (data) => {
        let start = data.toString().indexOf('time') + 5;
        let end = data.toString().indexOf('ms') - 1;

        if(latency_data.packetngin.length >= 20) {
            latency_data.packetngin.shift();
        }

        latency_data.packetngin.push(data.toString().substring(start, end));
    })

    linux_latency.stdout.on('data', (data) => {
        let start = data.toString().indexOf('time') + 5;
        let end = data.toString().indexOf('ms') - 1;

        if(latency_data.linux.length >= 20) {
            latency_data.linux.shift();
        }

        latency_data.linux.push(data.toString().substring(start, end));
    })

    res.json({ data: 1 });
})

router.get('/latency', (req, res) => {
    latency_data.count++;
    res.json({ data: latency_data })
})

module.exports = router
