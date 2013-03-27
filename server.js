var https = require('https'),
	config = require('./config.js'),
	couch = require('./couch.js'),
	u = config.env.GITHUB.USERNAME,
	p = config.env.GITHUB.PASSWORD, 
	benchmark;

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
		next = res.headers['link'].substr(43, res.headers['link'].indexOf('>') - 43) || null;
		remaining = parseInt(remaining);
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function(){
			console.log('Response finished. Next: ' + next);
			data = JSON.parse(data);
			couch.addNewDoc(data, next, _addNext);
		});
		function _addNext(){
			httpRequest.path = '/repositories';
			if (next && parseInt(next)) httpRequest.path += ('?since=' + next);
			else {
				operationFinished();
				return;
			}
			var time = parseInt(remaining) > 100 ? 0 : 4200000;
			console.log(httpRequest.path);
			console.log(parseInt(remaining));
			console.log(time);
			if (time ==0) main();
			//setTimeout(function(){
				//main();
			//}, time);

		};
	}).end();
};
benchmark = new Date().getTime();
main();
//couch.uuids(5);
var operationFinished = function(){
	var now = new Date().getTime();
	console.log('Operation is now finished. It took %s secods. Thanks! :)', (now - benchmark) / 1000);
};