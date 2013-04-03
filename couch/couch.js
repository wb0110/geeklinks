/*****************************************************************
**************	Created by Amir Moravej	***************************
**************	Copyrights (c) 2013 Amir Moravej.	***************
**************	All rights reserved.	******************************
**************	Contact: amir@doob.io *****************************
******************************************************************/

var http = require('http'),
	couchPUT = {
		hostname: 'http://127.0.0.1',
		port: 5984, 
		method: 'PUT'
	}, couchPOST = {
		hostname: 'http://127.0.0.1',
		port: 5984, 
		method: 'POST'
	};

var uuids = function(count, callback) {
	var path = 'http://127.0.0.1:5984/_uuids';
	if (count && count > 1) path += '?count=' + count;
	http.get(path, function(res){
		var data = '';
		res.on('data', function(chunk){
			data += chunk;
		});
		res.on('end', function(){
			data = JSON.parse(data);
			if (callback && typeof callback === 'function') callback(data);
		});
	});
};

// Accepts a JSON array of 100 objects and add them the database.
var addNewDoc = function(data, lastFetchInThisRound, callback) {
	console.log('Begining to creates '+data.length+' documents...');
	for (var i = 0; i < data.length; ++i) {
		var couchResonse, doc = data[i], id = data[i]['id'];
		couchPUT.path = '/github_repos/' + id;
		doc = JSON.stringify(doc);
		var req = http.request(couchPUT, function(res){
			res.setEncoding('utf8');
			res.on('data', function(chunk){
				couchResonse = chunk;				
			});
			// data is the result of PUT request from CouchDB.
			res.on('end', function(){
				couchResonse = JSON.parse(couchResonse);
				if (parseInt(couchResonse['id']) == lastFetchInThisRound) {
					addNextFetch(lastFetchInThisRound, callback);
				};
			});
		});
		req.write(doc);
		req.end();
	}
};

// Adds the id of the next item to fetched.
var addNextFetch = (function() {
	console.log('Adding the id of next item to be fetch to the fetch_next_repo database.');
	var count = 1;
	return function(next, callback){
		couchPUT.path = '/fetch_next_repo/' + next;
		var doc = {count: count++};
		doc = JSON.stringify(doc);
		var req = http.request(couchPUT, function(res){
			res.on ('data', function(){});
			res.on('end', function(){
				callback();
			});
		});
		req.write(doc);
		req.end();
	}
}());

// Create views for the provided db(s). arguments format: [{db: 'db', views: [views]}]
var createView = function(views){
	for (var i = 0; i < views.length; ++i) {
		couchPUT.path = '/' + views[i]['db'] + '/_design';
	}
};

exports.addNewDoc = addNewDoc;
exports.uuids = uuids;