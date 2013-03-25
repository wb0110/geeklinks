var http = require('http');
var GitHubApi = require("github");
var config = require('./config.js');
var github = new GitHubApi({
    version: "3.0.0",
});
github.authenticate({
    type: "basic",
    username: config.env.GITHUB.USERNAME,
    password: config.env.GITHUB.PASSWORD
});
github.search.users({
    keyword: "Canada"
}, function(err, res) {
    console.log(JSON.stringify(res));
});



// var options = {
//   hostname: 'https://api.github.com', 
//   port: 80,
//   path: '/users/defunkt',
//   method: 'GET'
// };
// var client_id = process.env.GITHUB_CLIENT_ID;
// var client_secret = process.env.GITHUB_CLIENT_SECRET;
// var server = http.createServer(function(req, res){
// 	console.log(req.headers);
// 	res.end('Thanks!');
// }).listen(function(){
// 	console.log('start listening on 1081')
// },8080);

// var req = http.request(options, function(res) {
//   console.log('STATUS: ' + res.statusCode);
//   console.log('HEADERS: ' + JSON.stringify(res.headers));
//   res.setEncoding('utf8');
//   res.on('data', function (chunk) {
//     console.log('BODY: ' + chunk);
//   });
// });