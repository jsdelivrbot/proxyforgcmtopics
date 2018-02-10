var express = require('express')
var app = express()

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.set('port', port)
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello test World!')
})

app.listen(app.get('port'), function() {
  console.log("Hey Node app is running at localhost:" + app.get('port'))
})



