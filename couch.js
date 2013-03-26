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
var addNewDoc = function(data, next, callback) {
	for (var i = 0; i < data.length; ++i) {
		var doc = data[i], id = data[i]['id'];
		couchNewDocRequest.path = '/test/' + id;
		doc = JSON.stringify(doc);
		// console.log(id);
		var req = http.request(couchNewDocRequest, function(res){
			res.setEncoding('utf8');
			res.on('data', function(chunk){
				console.log(chunk);
				// Go back to the requestor and call for the next 100 objects. 
			});
			res.on('end', function(){
				if (id == next) addNewTracker(next, callback);
			});
		});
		req.write(doc);
		req.end();
	}
};

exports.addNewDoc = addNewDoc;
exports.uuids = uuids;