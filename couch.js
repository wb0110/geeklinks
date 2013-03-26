var http = require('http'),
	couchNewDoc = {
		hostname: '127.0.0.1',
		port: 5984, 
		method: 'PUT'
	};

// Accepts a JSON array of 100 objects and add them the database.
var addNewDoc = function(data) {
	for (var i = 0; i < data.length; ++i) {
		var doc = data[i], id = data[i]['id'];
		couchNewDoc.path = '/test/' + id;
		doc = JSON.stringify(doc);
		// console.log(id);
		// var req = http.request(couchNewDoc, function(res){
		// 	res.setEncoding('utf8');
		// 	res.on('data', function(chunk){
		// 		console.log(chunk);
		// 		// Go back to the requestor and call for the next 100 objects. 
		// 	});
		// });
		// req.write(doc);
		// req.end();
	}
};

exports.addNewDoc = addNewDoc;