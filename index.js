'use strict';



const http = require("http");
const https = require("https");
const moment = require('moment');
// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({
  origin: true,
});

var express = require('express')
var app = express()
var bodyParser = require('body-parser');



var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.set('port', port)
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

 
function unregisteTopics(data) {
  var options = {
    hostname: 'iid.googleapis.com',
    port: 443,
    path: data.t,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=AAAAOvFXwrI:APA91bGWDp8GEp5r6Zx9lFx4_O5EULRsge79tgf2D6SsH2kXSREQInwTewUzQj-jWtIrXazuBmZhHqO4eXQJ6CQKXKszLENJwHJiUIQaWwh-WAcjffjG2qEElSocOsOrI26gVB0j71uT'
    }
  };
  var req = https.request(options, function (res) {
    console.log('Status: ' + res.statusCode);
    console.log('Headers: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (body) {
      console.log('Body: ');
      console.log(body);
    });
  });
  req.on('error', function (e) {
    console.log('problem with request: ');
    console.log(e);
  });
  req.write(JSON.stringify(data));
  req.end();
}

function unregisterFromTopic(data) {
  doIt(data, 'iid.googleapis.com', 443, '/iid/v1:batchRemove');
}

function registerToTopic(data) {
  doIt(data, 'iid.googleapis.com', 443, '/iid/v1:batchAdd');
}

function doIt(data, hostname, port, path) {

  var registration = {
    "to": "/topics/" + data.z + "-" + data.c,
    "registration_tokens": [data.t],
  }

  var options = {
    hostname: hostname,
    port: port,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=AAAAOvFXwrI:APA91bGWDp8GEp5r6Zx9lFx4_O5EULRsge79tgf2D6SsH2kXSREQInwTewUzQj-jWtIrXazuBmZhHqO4eXQJ6CQKXKszLENJwHJiUIQaWwh-WAcjffjG2qEElSocOsOrI26gVB0j71uT'
    }
  };
  var req = https.request(options, function (res) {
    // console.log('Status: ' + res.statusCode);
    // console.log('Headers: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (body) {
       console.log('ok for : ' + registration.to);
    });
  });

  req.on('error', function (e) {
    console.log('problem with request for : ' + data.t );
    console.log(e);
  });

  req.write(JSON.stringify(registration));
  req.end();
}


function send(data) {
  if (data.type < 0) {
    unregisterFromTopic(data)
  } else {
    registerToTopic(data)
  }
}

app.get('/', function (request, response) {
  response.send('Ready to manage subscription')
})

 
app.post('/push', function (req, res) {
  if (req.method === 'PUT') {
    res.status(403).send('Forbidden!');
  }
  
  cors(req, res, () => {
    
    //console.log("req");
    //console.log(req);
 
    let actions = req.query.data;
    
    if (!actions) {
      actions = req.body.data;
    }
    
    // console.log("actions");
    // console.log(actions);
    var print = true
    actions.forEach(data => {
        if (print) {
          console.log('Starting registrations for : ' + data.t);
          print = false;
        }
        send(data);
    });
    console.log('Ended with' + actions.length + ' registrations done.');
    res.status(200).send("ok");
     
  });
})

app.listen(app.get('port'), function () {
  console.log("Ready to receive topics subscriptions requests :" + app.get('port'))
})



