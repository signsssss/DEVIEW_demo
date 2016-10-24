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

let test_data = {
    linux: [],
    packetngin: []
}

let packet_size;
let packetngin_config = {
    ip: '',
    port: ''
};
let linux_config = {
    ip: '',
    port: ''
}



let linux_throughput;
let packetngin_throughput;
let linux_latency;
let packetngin_latency;

router.get('/parse', (req, res) => {
    test_data.linux.push(fs.readFileSync('linux_64.dat', { encoding: 'utf8' }).split('\n'));
    test_data.linux.push(fs.readFileSync('linux_128.dat', { encoding: 'utf8' }).split('\n'));
    test_data.linux.push(fs.readFileSync('linux_256.dat', { encoding: 'utf8' }).split('\n'));
    test_data.linux.push(fs.readFileSync('linux_512.dat', { encoding: 'utf8' }).split('\n'));
    test_data.linux.push(fs.readFileSync('linux_1024.dat', { encoding: 'utf8' }).split('\n'));
    test_data.linux.push(fs.readFileSync('linux_1500.dat', { encoding: 'utf8' }).split('\n'));

    test_data.packetngin.push(fs.readFileSync('packetngin_64.dat', { encoding: 'utf8' }).split('\n'));
    test_data.packetngin.push(fs.readFileSync('packetngin_128.dat', { encoding: 'utf8' }).split('\n'));
    test_data.packetngin.push(fs.readFileSync('packetngin_256.dat', { encoding: 'utf8' }).split('\n'));
    test_data.packetngin.push(fs.readFileSync('packetngin_512.dat', { encoding: 'utf8' }).split('\n'));
    test_data.packetngin.push(fs.readFileSync('packetngin_1024.dat', { encoding: 'utf8' }).split('\n'));
    test_data.packetngin.push(fs.readFileSync('packetngin_1500.dat', { encoding: 'utf8' }).split('\n'));

    for(let i = 0; i < 6; i++) {
        test_data.linux[i].pop();
        test_data.packetngin[i].pop();
    }

    res.json({ data: 1 });
})

router.post('/throughput', (req, res) => {
    // throughput_data.count = 0;
    // throughput_data.packetngin = [];
    // throughput_data.linux = [];
    packet_size = req.body.packet_size;
    packetngin_config.ip = req.body.packetngin_config.ip;
    packetngin_config.port = req.body.packetngin_config.port;
    linux_config.ip = req.body.linux_config.ip;
    linux_config.port = req.body.linux_config.port;

    if(packetngin_throughput || linux_throughput) {
        console.log('newly connected or packet size changed');
        packetngin_throughput.kill('SIGHUP');
        linux_throughput.kill('SIGHUP');
    }

    packetngin_throughput = child_process.spawn('java', ['-jar', 'udpecho.jar', packet_size, packetngin_config.ip, packetngin_config.port]);
    linux_throughput = child_process.spawn('java', ['-jar', 'udpecho.jar', packet_size, linux_config.ip, linux_config.port]);

    packetngin_throughput.stdout.on('data', (data) => {
        let temp = data.toString().match(/\S+/g) || [];

        if(temp.length == 1) {
            if(throughput_data.packetngin.length >= 60) {
                throughput_data.packetngin.shift();
            }

            throughput_data.packetngin.push(temp[0] * packet_size / (1024*1024));
        }
    })

    linux_throughput.stdout.on('data', (data) => {
        let temp = data.toString().match(/\S+/g) || [];

        if(temp.length == 1) {
            if(throughput_data.linux.length >= 60) {
                throughput_data.linux.shift();
            }

            throughput_data.linux.push(temp[0] * packet_size / (1024*1024));
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

    console.log(throughput_data.packetngin[throughput_data.packetngin.length - 1], throughput_data.linux[throughput_data.linux.length - 1]);
    res.json({ data: throughput_data })


    /**** codes below are for the test ****/
    // console.log('packet size:', packet_size);
    // let index;
    // switch(packet_size) {
    //     case 64:
    //         index = 0;
    //         break;
    //     case 128:
    //         index = 1;
    //         break;
    //     case 256:
    //         index = 2;
    //         break;
    //     case 512:
    //         index = 3;
    //         break;
    //     case 1024:
    //         index = 4;
    //         break;
    //     case 1500:
    //         index = 5;
    //         break;
    //     default:
    //         index = 0;
    // }
    //
    // if(test_data.linux.length != 0 && test_data.packetngin.length !=0) {
    //     let linux_rand_data = test_data.linux[index][Math.floor(Math.random() * test_data.linux[index].length)];
    //     let packetngin_rand_data = test_data.packetngin[index][Math.floor(Math.random() * test_data.packetngin[index].length)];
    //
    //     throughput_data.count++;
    //     if(throughput_data.count >= 21) {
    //         throughput_data.linux.shift();
    //         throughput_data.packetngin.shift();
    //     }
    //
    //     throughput_data.linux.push(linux_rand_data * packet_size / (8* 1024 * 1024));
    //     throughput_data.packetngin.push(packetngin_rand_data * packet_size / (8 * 1024 * 1024));
    //
    //     res.json({ data: throughput_data })
    // } else {
    //     res.json({ data: 'failed' })
    // }
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

        if(latency_data.packetngin.length >= 60) {
            latency_data.packetngin.shift();
        }

        latency_data.packetngin.push(data.toString().substring(start, end));
    })

    linux_latency.stdout.on('data', (data) => {
        let start = data.toString().indexOf('time') + 5;
        let end = data.toString().indexOf('ms') - 1;

        if(latency_data.linux.length >= 60) {
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
