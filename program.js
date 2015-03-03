var express = require('express')
var https = require('https')
var querystring = require('querystring');
var app = express()

var commands = {
  build: build
}

function build(project) {
  var options = {
    hostname: 'apibeta.shippable.com',
    path: "/projects/" + project + "/builds/new",
    method: 'POST',
    headers: {'Authorization': 'apiToken ' + process.env.apiToken}
  }
  var callback = function(response) {
    var output = ''
    response.on('data', function(chunk) {
      output += chunk
    })

    response.on('end', function () {
      write_result_to_slack(output)
    })
  }
  https.request(options, callback).end()
}

function command_processor(command_str) {
  var command_arr = command_str.split(' ')
  var command = command_arr[0]
  var parameter = command_arr[1]
  commands[command](parameter)
}

function write_result_to_slack(output) {
  var options = {
    hostname: 'hooks.slack.com',
    path: '/services/T03QGDMRG/B03RENCT1/5XIFxu0dsJzsHfKwOb7Ix4Zv',
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    }
  }

  var body_data = JSON.stringify({
    "text": output
  })

  var req = https.request(options, function(res) {
  })
  req.write(body_data)
  req.end()
}

app.get('/slack', function(req, res) {
  res.send(req.body)
  if (req.query.token == 'ML6frujgk0ekVKkNfM77qwlm') {
    var command_str =req.query.text
    command_processor(command_str)
  }
})

app.listen(80)
