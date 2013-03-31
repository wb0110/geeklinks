var https = require('https'),
	assert = require('assert'),
	mongo = require('./mongo.js'),
	config = require('./config.js'),
	u = config.env.GITHUB.USERNAME,
	p = config.env.GITHUB.PASSWORD, 
	benchmark, httpRequest, app;
httpRequest = {
	hostname: 'api.github.com', 
	method: 'GET',
	path: '/repositories',
	headers : {'Authorization': 'Basic ' + new Buffer(u + ':' + p).toString('base64')}
}; app = {
	app.db: 'github',
	app.fechInfoCollectionName: 'repos_fetch_info',
	app.collection:  'repos'
};
var main = (function() {
	var init = function(){
		if (app.init) return;
		app.init = true;
		readNextFromDB(function(max){
			if (max) max = max.next;
			setNext(max, function(){
				createPath(fetch);
			});
		});
	};
	var readNextFromDB = function(callback) {
		mongo.mongo.max(app.db, app.fechInfoCollectionName, 'next', function(err, max){
			console.log(max);
			assert.equal(err, null);
			return callback(max);
		});
	};
	var setNext = function(next, callback) {
		if (next && typeof next !== 'function') {
			app.next = next;
			app.hasNext = true;
		} else if (!app.init) app.hasNext = false;
		if (callback && typeof callback === 'function') return callback();
	}
	var createPath = function(callback) {
		if (!app.hasNext) return; 
		if (!app.next) httpRequest.path = '/repositories';
		else httpRequest.path = '/repositories/since?next=' + app.next; 
		if (callback) return callback();
	};
	var fetch = function() {
		var req = https.request(httpRequest, function(res) {
			app.init = false;
			var data = '', next;
			console.log('STATUS: ' + res.statusCode);
			console.log('X-RateLimit-Limit: ' + JSON.stringify(res.headers['x-ratelimit-limit']));
			remaining = res.headers['x-ratelimit-remaining'];
			console.log('X-RateLimit-Remaining: ' + remaining);
			next = res.headers['link'].substr(43, res.headers['link'].indexOf('>') - 43);
			setNext(next);
			app.remaining = parseInt(remaining);
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				data += chunk;
			});
			res.on('end', function(){
				console.log('Response finished. Next: ' + next);
				data = JSON.parse(data);
				couch.addNewDoc(data, next, _addNext);
				mongo.create(app.db, app.collection, data, scheduleNextFetchRequest);
			});
			var scheduleNextFetchRequest = function(){
				if (app.hasNext) {
					createPath();
					var time = parseInt(app.remaining) > 100 ? 0 : 4200000;
					setTimeout(function(){
						main.fetch();
					}, time);
				}
				httpRequest.path = '/repositories';
				if (next && parseInt(next)) httpRequest.path += ('?since=' + next);
				else {
					operationFinished();
					return;
				}
				var time = parseInt(remaining) > 100 ? 0 : 4200000;
				if (time ==0) main();
				//setTimeout(function(){
					//main();
				//}, time);

			};
		}).end();

	}
	return {
		init: init
	}
}());

main.init();
