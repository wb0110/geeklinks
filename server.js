var https = require('https');
var config = require('./config.js');

var options = {
  hostname: 'api.github.com', 
  path: '/users/doobio',
  method: 'GET',
  username: config.env.GITHUB.USERNAME,
  password: config.env.GITHUB.PASSWORD
};

var req = https.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  // console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
}).end();