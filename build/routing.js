'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var child_process = require('child_process');

var router = _express2.default.Router();

var ping_data = {
    throughput: [],
    latency: []
};

var ping = void 0;

router.post('/ping', function (req, res) {
    console.log('got a ping post request', req.body.ip);
    ping = child_process.spawn('ping', [req.body.ip], { encoding: 'utf8' });

    ping.stdout.on('data', function (data) {
        var start = data.toString().indexOf('time') + 5;
        var end = data.toString().indexOf('ms') - 1;

        if (ping_data.latency.length >= 20) {
            ping_data.latency.shift();
        }
        ping_data.latency.push(data.toString().substring(start, end));
    });

    res.json({ data: 1 });
});

router.get('/ping', function (req, res) {
    console.log('got a ping get request!!!!!!!!!!!');
    res.json({ ping_data: ping_data });
});

module.exports = router;