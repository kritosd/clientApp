'use strict';

let express = require('express');
let router = new express.Router();
let nodeGeocoder = require('node-geocoder');
const https = require('http')

/* GET home page. */

router.get('/', (req, res) => {
    res.render('index.ejs', {
        latitude: null,
        longitude: null
    });
});

router.post('/post_address', (req, res) => {
    let response = "";
    let options = {
        provider: 'openstreetmap'
      };
       
      let geoCoder = nodeGeocoder(options);
      geoCoder.geocode(req.body.address)
        .then((res2)=> {
            let jlat = JSON.stringify(res2[0].latitude)
            let jlon = JSON.stringify(res2[0].longitude)
            res.render('index.ejs', {
                latitude: jlat,
                longitude: jlon
            });
        })
        .catch((err)=> {
            console.log(err);
        });

    
    
});

router.post('/post_order', (req, res) => {

    const data = JSON.stringify({
        "variables": {
            "requested_product": {
                "value": req.body.food,
                "type": "String"
            },
            "requested_quantity": {
                "value": req.body.quantity,
                "type": "integer"
            },
            "client_email": {
                "value": req.body.email,
                "type": "String"
            },
            "latitude": {
                "value": req.body.latitude,
                "type": "String"
            },
            "longitude": {
                "value": req.body.longitude,
                "type": "String"
            }
        },
        "businessKey": "1"
    });

    const process_key = 'Process_0xlc0am22';

    var username = process.env.DEMO_USERNAME;
    var password = process.env.DEMO_PASSWORD;
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

    console.log(process.env.REST_HOST+process.env.REST_PORT+process.env.REST_PATH + '/process-definition/key/' + process_key + '/start');

    const options = {
        hostname: process.env.REST_HOST,
        port: process.env.REST_PORT,
        path: process.env.REST_PATH + '/process-definition/key/' + process_key + '/start',
        method: 'POST',
        headers: {
            "Authorization" : auth,
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

    request.write(data);
    request.end();
    res.redirect('/');
});

module.exports = router;
