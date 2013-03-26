var http = require('http'),
	couchNewDocRequest = {
		hostname: '127.0.0.1',
		port: 5984, 
		method: 'PUT'
	}, nextFetchRequest = {
		hostname: '127.0.0.1',
		port: 5984, 
		method: 'PUT'
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
		var doc = data[i], id = data[i]['id'];
		couchNewDocRequest.path = '/test/' + id;
		doc = JSON.stringify(doc);
		console.log('id: ' + id);
		var req = http.request(couchNewDocRequest, function(res){
			res.setEncoding('utf8');
			res.on('data', function(chunk){});
			// data is the result of PUT request from CouchDB.
			res.on('end', function(){
				if (id == lastFetchInThisRound) {
					addNextFetch(lastFetchInThisRound, callback);
				};
				console.log('Finish adding to DB.');
			});
		});
		req.write(doc);
		req.end();
	}
};

// Adds the id of the next item to fetched.
var addNextFetch = function(next, callback) {};

exports.addNewDoc = addNewDoc;
exports.uuids = uuids;