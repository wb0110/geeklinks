var https = require('https'),
	config = require('./config.js'),
	couch = require('./couch.js'),
	u = config.env.GITHUB.USERNAME,
	p = config.env.GITHUB.PASSWORD;

var httpRequest = {
	hostname: 'api.github.com', 
	method: 'GET',
	path: '/repositories', //since=800
	// '/legacy/users/search/location?canada', 
	//'/users/doobio/repos?type=owner',
	// path: '/legacy/repos/search/canada',
	headers : {
		'Authorization': 'Basic ' + new Buffer(u + ':' + p).toString('base64')
	}
};

var main = function(){
	var req = https.request(httpRequest, function(res) {
		var data = '', remaining, next;
		console.log('STATUS: ' + res.statusCode);
		console.log('X-RateLimit-Limit: ' + JSON.stringify(res.headers['x-ratelimit-limit']));
		remaining = res.headers['x-ratelimit-remaining'];
		console.log('X-RateLimit-Remaining: ' + remaining);
		next = res.headers['link'].substr(43, res.headers['link'].indexOf('>') - 43);
		console.log(next);
		remaining = parseInt(remaining);
		console.log('HEADERS: ');
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function(){
			console.log('Response finished.');
			data = JSON.parse(data);
			couch.addNewDoc(data, next, _addNext);
		});
		function _addNext(){
			// User TRACKER...
			httpRequest.path = '/repositories?since=' + next;
			if (parseInt(remaining) > 100) main();
			else setTimeout(, 4200000);
		};
	}).end();
};
main();