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
	if (!config.env.GITHUB.next) config.env.GITHUB.next = 4;
	console.log(config.env);

}());
var main = (function() {
	var init = function(){
		if (app.init) return;
		// Read Next
		app.init = true;
		readNextFromDB(function(max){
			max = max.next || null; 
				setNext(max, function(){
					buildPath()
				});
		});
	};
	var readNextFromDB = function(callback) {
		mongo.max('github', 'repos_fetch_info', 'next', function(err, max){
			assert.equal(err, null);
			return callback(max.next);
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

var buildPath = function(callback) {

	mongo.maxID('github', 'repo', {'id':-1}, function(err, result){
		if (err) throw err;
		if (result){

		}
	});
};
