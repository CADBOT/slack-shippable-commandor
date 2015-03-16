var express = require('express')
var https = require('https')
var querystring = require('querystring')
var request = require('request')
var app = express()

var commands = {
  build: build,
  isCompleted: isCompleted
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
    console.log(body)
    write_result_to_slack(buildId)
  })
}

function isCompleted(build) {
  var options = {
    headers: {'Authorization': 'apiToken ' + process.env.apiToken},
    url: 'https://api.shippable.com/builds/' + build,
  }
  request.get(options, function(err, res, body) {
    var result = JSON.parse(body).isCompleted
    // Otherwise slack will write the result as 0 or 1
    result = result.toString()
    write_result_to_slack(result)
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
