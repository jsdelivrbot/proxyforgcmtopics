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



function unregisteTopics1(data) {
  var url = 'https://iid.googleapis.com/iid/info/' + data.t + '?details=true'
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    // console.log(xhr);
  }
  xhr.open("GET", url, false);
  xhr.setRequestHeader('Content-Type', "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.status === 200) {
      console.log("xxxxxxxxxxx")
      console.log(xhr.response)
    } else {
      console.log("Error occured while sending notification");
      alert(JSON.stringify(xhr))
      console.log(xhr);
    }
  };
  xhr.setRequestHeader('Authorization', 'key=AAAAOvFXwrI:APA91bGWDp8GEp5r6Zx9lFx4_O5EULRsge79tgf2D6SsH2kXSREQInwTewUzQj-jWtIrXazuBmZhHqO4eXQJ6CQKXKszLENJwHJiUIQaWwh-WAcjffjG2qEElSocOsOrI26gVB0j71uT');
  xhr.send();

}
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

 

function doIt1(data, url) {
  var data = {
    "to": "/topics/" + data.z + "_" + data.c,
    "registration_tokens": [data.t]
  }

  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    // console.log(xhr);
  }
  xhr.open("POST", url, false);
  // xhr.setRequestHeader('Content-Type', "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.status === 200) {
      // console.log(xhr);
      // alert("regsitration of " + zone.name + " done ")
    } else {
      console.log("Error occured while sending notification");
      alert(JSON.stringify(xhr))
      console.log(xhr);
    }
  };
  xhr.setRequestHeader('Authorization', 'key=AAAAOvFXwrI:APA91bGWDp8GEp5r6Zx9lFx4_O5EULRsge79tgf2D6SsH2kXSREQInwTewUzQj-jWtIrXazuBmZhHqO4eXQJ6CQKXKszLENJwHJiUIQaWwh-WAcjffjG2qEElSocOsOrI26gVB0j71uT');
  xhr.send(JSON.stringify(data));
}

function doIt(data, hostname, port, path) {
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

  var body = {
    "to": "/topics/" + data.z + "-" + data.c,
    "registration_tokens": [data.t],
  }
  req.write(JSON.stringify(body));
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
 
  response.send('Test')
})

app.get('/test', function (req, res) {
  console.log("req");
  const url =
    "https://maps.googleapis.com/maps/api/geocode/json?address=Florence";

  https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      console.log(
        `City: ${body.results[0].formatted_address} -`,
        `Latitude: ${body.results[0].geometry.location.lat} -`,
        `Longitude: ${body.results[0].geometry.location.lng}`
      );
    });
  });
});

app.post('/push', function (req, res) {
  if (req.method === 'PUT') {
    res.status(403).send('Forbidden!');
  }
  // [END sendError]

  // [START usingMiddleware]
  // Enable CORS using the `cors` express middleware.
  cors(req, res, () => {
    // [END usingMiddleware]
    console.log("req");
    console.log(req);
    // [START readQueryParam]
    let actions = req.query.data;
    // [END readQueryParam]
    // Reading date format from request body query parameter
    if (!actions) {
      // [START readBodyParam]
      actions = req.body.data;
      // [END readBodyParam]
    }
    // [START sendResponse]
    console.log("actions");
    console.log(actions);
    send(actions[0]);
    //  actions.forEach(data => {
    //    send(data);
    //  });
    res.status(200).send("ok");
    // [END sendResponse]
  });
})

app.listen(app.get('port'), function () {
  console.log("new 1 localhost:" + app.get('port'))
})



