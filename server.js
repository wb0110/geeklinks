var https = require('https'),
	config = require('./config.js'),
	couch = require('./couch.js'),
	u = config.env.GITHUB.USERNAME,
	p = config.env.GITHUB.PASSWORD;

var options = {
	hostname: 'api.github.com', 
	method: 'GET',
	path: '/repositories', 
	// '/legacy/users/search/location?canada', 
	//'/users/doobio/repos?type=owner',
	// path: '/legacy/repos/search/canada',
	headers : {
		'Authorization': 'Basic ' + new Buffer(u + ':' + p).toString('base64')
	}
};

var req = https.request(options, function(res) {
	var data = '';
	console.log('STATUS: ' + res.statusCode);
	console.log('X-RateLimit-Limit: ' + JSON.stringify(res.headers['x-ratelimit-limit']));
	console.log('X-RateLimit-Remaining: ' + JSON.stringify(res.headers['x-ratelimit-remaining']));
	console.log('HEADERS: ');
	next = findNext(res.headers['link']);
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		data += chunk;
	});
	res.on('end', function(){
		console.log('Response finished.');
		data = JSON.parse(data);
		couch.addNewDoc(data, addNext);
	});
}).end();
