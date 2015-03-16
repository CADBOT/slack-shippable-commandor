var express = require('express')
var https = require('https')
var querystring = require('querystring');
var request = require('request')
var app = express()

var commands = {
  build: build
}

function build(project) {
  var postData = {
    projectId: project
  }

  var options = {
    headers: {'Authorization': 'apiToken ' + process.env.apiToken},
    url: 'https://api.shippable.com/workflow/triggerBuild',
    json: true,
    body: postData
  }
  request.post(options, function(err, res, body) {
    var buildId = res.body.buildId
    write_result_to_slack(buildId)
  })
}

function command_processor(command_str) {
  var command_arr = command_str.split(' ')
  var command = command_arr[0]
  var parameter = command_arr[1]
  commands[command](parameter)
}

function write_result_to_slack(output) {
  payload = {
    text: output
  }

  request.post('https://hooks.slack.com/services/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').form(JSON.stringify(payload))
}

app.get('/slack', function(req, res) {
  res.send(req.body)
  if (req.query.token == process.env.SlackToken) {
    var command_str =req.query.text
    command_processor(command_str)
  }
})

app.listen(80)
