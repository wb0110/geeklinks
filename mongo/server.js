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
		readNextFromDB(function(){
			setNext(function(){
				buildPath()
			})
		});
	};
	var readNextFromDB = function(callback) {
		mongo.max('github', 'repos_fetch_info', 'next', function(err, max){
			assert.equal(err, null);
			if (max && max.next) return callback(max.next);
			return callback();
		});
	};
	var setNext = function(next) {
		if (next) {
			app.next = next;
			app.hasNext = true;
		}
		if (arguments.length >= 2) {
			if (arguments[1] && arguments[1].next) {
				ap.next = arguments[1].next;
				app.hasNext = true;
			} else app.hasNext = false;
		}

	}
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
