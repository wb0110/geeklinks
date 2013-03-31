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
	headers : {
		'Authorization': 'Basic ' + new Buffer(u + ':' + p).toString('base64')
	}
};
app = {};



(function(){
	console.log(config.env);
}());
var main = (function() {
	var init = function(){
		if (app.init) return;
		app.init = true;
		readNextFromDB(function(max){
			if (max) max = max.next;
				setNext(max, function(){
					buildPath();
				});
		});
	};
	var readNextFromDB = function(callback) {
		mongo.mongo.max('github', 'repos_fetch_info', 'next', function(err, max){
			console.log(max);
			assert.equal(err, null);
			return callback(max);
		});
	};
	var setNext = function(next, callback) {
		if (next && typeof next !== 'function') {
			app.next = next;
			app.hasNext = true;
		} else app.hasNext = false;
		if (callback && typeof callback === 'function') return callback();
	}
	var buildPath = function() {
		console.log(app);
	};
	return {
		init: init
	}
}());

main.init();
