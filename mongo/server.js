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
	path: '/users',
	headers : {'Authorization': 'Basic ' + new Buffer(u + ':' + p).toString('base64')}
}; app = {
	db: 'github',
	fechInfoCollectionName: 'users_fetch_info',
	collection:  'users'
};
var main = (function() {
	var init = function(){
		if (app.init) return;
		app.initTime = new Date().getTime();
		app.init = true;
		readNextFromDB(function(max){
			if (max) max = max.next;
			setNext(max);
			createPath();
			fetch();
		});
	};
	var readNextFromDB = function(callback) {
		mongo.db.max(app.db, app.fechInfoCollectionName, 'next', function(err, max){
			console.log(max);
			assert.equal(err, null);
			return callback(max);
		});
	};
	var setNext = function(next, callback) {
		if (next && typeof next !== 'function') {
			app.next = next;
			app.hasNext = true;
		} else if (app.init) app.hasNext = true;
		else app.hasNext = false;
		if (callback && typeof callback === 'function') return callback();
	}
	var createPath = function(callback) {
		if (!app.hasNext) return; 
		if (!app.next) httpRequest.path = '/repositories';
		else httpRequest.path = '/repositories?since=' + app.next; 
		if (callback) return callback();
	};
	var fetch = function() {
		var req = https.request(httpRequest, function(res) {
			app.init = false;
			var data = '', next = null;
			console.log('STATUS: ' + res.statusCode);
			console.log('X-RateLimit-Limit: ' + JSON.stringify(res.headers['x-ratelimit-limit']));
			remaining = res.headers['x-ratelimit-remaining'];
			console.log('X-RateLimit-Remaining: ' + remaining);
			if (res.headers['link']) 
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
				mongo.db.create(app.db, app.collection, data, function(flag){
					if (flag) {
						setTimeout(scheduleNextFetchRequest, 0);
					}
					else return;
				});
				// });
			});
		});
		req.end();
	};
	function scheduleNextFetchRequest() {
		if (app.hasNext) {
			var doc = {
				'next': parseInt(app.next),
				'benchmark': new Date().getTime() - app.initTime,
				'timestamp': new Date().getTime()
			};
			// console.log(doc);
			mongo.db.create(app.db, app.fechInfoCollectionName, [doc], function(){
				createPath();
				var time = parseInt(app.remaining) > 100 ? 0 : 4200000;
				setTimeout(function(){
					fetch();
				}, time);				
			});
		}
	};
	return {
		init: init
	}
}());

main.init();
