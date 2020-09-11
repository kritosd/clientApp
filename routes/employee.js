'use strict';

let express = require('express');
let router = new express.Router();
const https = require('http');

/* GET home page. */
router.get('/', (req, res) => {
    var username = process.env.DEMO_USERNAME;
    var password = process.env.DEMO_PASSWORD;
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

    const options = {
        hostname: process.env.REST_HOST,
        port: process.env.REST_PORT,
        path: process.env.REST_PATH + '/task',
        method: 'GET',
        headers: {
            "Authorization": auth,
            'Content-Type': 'application/json'
        }
    }
    const request = https.get(options, (res2) => {
        console.log(`statusCode: ${res2.statusCode}`)

        res2.on('data', (d) => {
            var data = JSON.parse(d);
            res.render('employee.ejs', {
                data: data
            });
        });

    })

    request.on('error', (error) => {
        console.error(error)
    })
    request.end();
});

router.post('/post_decision/:id', (req, res) => {

    const data = JSON.stringify({
        "variables": {
            "confirm": {
                "value": req.body.confirm == 'true' ? true : false
            },
            "message": {
                "value": req.body.message
            }
        }
    })

    const task_id = req.params.id;

    var username = process.env.DEMO_USERNAME;
    var password = process.env.DEMO_PASSWORD;
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

    const options = {
        hostname: process.env.REST_HOST,
        port: process.env.REST_PORT,
        path: process.env.REST_PATH + '/task/' + task_id + '/complete',
        method: 'POST',
        headers: {
            "Authorization": auth,
            'Content-Type': 'application/json'
        }
    }

    const request = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', (d) => {
            process.stdout.write(d)
        })
    })

    request.on('error', (error) => {
        console.error(error)
    })

    request.write(data)
    request.end()
    res.redirect('/employee');
});

module.exports = router;
