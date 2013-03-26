var http = require('http'),
	couchNewDoc = {
		hostname: '127.0.0.1',
		port: 5984 
		method: 'put',
		path: '/test'
	};

// Accepts a JSON array of 100 objects and add them the database.
var addNewDoc = function(data, couchNewDoc) {
	for (var i = 0; i < data.length; ++i) {
		var doc = data[i], id = doc['id'];
		couchNewDoc.path += '/' + id;
		doc = JSON.stringify(doc);
		var req = http.request();
		req.write(doc);
		req.end();
	}
};