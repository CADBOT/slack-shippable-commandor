var express = require('express')
var https = require('https')
var querystring = require('querystring');
var app = express()

function command_shippable(command) {
  var str = ''
//curl -H "Authorization: apiToken $apiToken" https://apibeta.shippable.com/accounts/54e2e00591426fd6a78cf0df/projects | jq -r '.[] | select(.name == "kicke").
  var project = '54e80f5d91426fd6a78f6281'
  var options = {
    hostname: 'apibeta.shippable.com',
    path: "/projects/" + project + "/recentBuilds",
    method: 'GET',
    headers: {'Authorization': 'apiToken 69e97a32-723d-4dd8-b84f-bf75d6a838e0'}
  }
  var callback = function(response) {
    var str = ''
    response.on('data', function(chunk) {
      str += chunk
    })

    response.on('end', function () {
      console.log(str)
      var options = {
        hostname: 'hooks.slack.com',
        path: '/services/T03QGDMRG/B03RENCT1/5XIFxu0dsJzsHfKwOb7Ix4Zv',
        method: 'GET',
        headers: { 
          //'Content-Type': 'application/json',
          'payload': {'text': 'hello from slack'} 
        }
      }
      https.request(options, function(res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);


        res.on('data', function(d) {
          process.stdout.write(d);
        });
      }).end()
    })
  }
  https.request(options, callback).end()

}

app.get('/slack', function(req, res) {
  res.send(req.body)
  //console.log(req.body)
  console.log('hello from slack')
  //console.log(req.headers)
  //console.log(req.body)
  //console.log(req.query)
  console.log(req.query.text)
  if (req.query.token == 'ML6frujgk0ekVKkNfM77qwlm') {
    var command =req.query.text
    command_shippable(command)
  }
})

app.listen(80)
