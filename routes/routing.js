import express from 'express';
import colors from 'colors';

const fs = require('fs');
const child_process = require('child_process');

let router = express.Router();

let ping_data = {
    throughput: [],
    latency: []
}

let ping;

router.post('/ping', (req, res) => {
    console.log('got a ping post request', req.body.ip)
    ping = child_process.spawn('ping', [req.body.ip], {encoding: 'utf8'});

    ping.stdout.on('data', (data) => {
        let start = data.toString().indexOf('time') + 5;
        let end = data.toString().indexOf('ms') - 1;

        if(ping_data.latency.length >= 20) {
            ping_data.latency.shift();
        }
        ping_data.latency.push(data.toString().substring(start, end));
    })

    res.json({ data: 1 })
})

router.get('/ping', (req, res) => {
    console.log('got a ping get request!!!!!!!!!!!');
    res.json({ ping_data: ping_data})
})

module.exports = router
