var https = require('https'),
	config = require('./config.js'),
	u = config.env.GITHUB.USERNAME,
	p = config.env.GITHUB.PASSWORD;

var options = {
	hostname: 'api.github.com', 
	method: 'GET',
	// path: '/legacy/repos/search/canada',
	path: '/repositories',
	headers : {
		'Authorization': 'Basic ' + new Buffer(u + ':' + p).toString('base64')
	}
};

var req = https.request(options, function(res) {
	var data = '';
	console.log('STATUS: ' + res.statusCode);
	console.log('X-RateLimit-Limit: ' + JSON.stringify(res.headers['x-ratelimit-limit']));
	console.log('X-RateLimit-Remaining: ' + JSON.stringify(res.headers['x-ratelimit-remaining']));
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		data += chunk;
	});
	res.on('end', function(){
		console.log('Response finished.');
		var j = 0, javascript = 0, index = [];
		data = JSON.parse(data);
		for (var i in data) {
			index.push(i);
			++j;
			if (data[i]['language'] == 'javascript') ++javascript;
		}
		console.log('Repository Count: %s', j);
// console.log(data[99]);
console.log('Javascript repositories: %s', javascript);
});
}).end();