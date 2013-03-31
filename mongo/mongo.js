var assert = require('assert');
var mongo = (function(){
	var mongodb = require("mongodb"),
		srv = new mongodb.Server('127.0.0.1', 27017);

	var maxID = function(dbName, collectionName, field, callback) {
		if (!dbName) {
			if (!callback) throw 'mongo.max: Invalid Database Name.';
			else return callback('mongo.max: Invalid Database Name.', null);
		} 
		var connector = new mongodb.Db(dbName, srv);
		if (!collectionName) {
			if (!callback) throw 'mongo.max: Invalid Collection Name.';
			else return callback('mongo.max: Invalid Collection Name.', null);
		}
		if (!callback) return;
		connector.open(function(error, db){
			if (error) throw error;
			console.log('Connected to: ' + dbName);
			db.collection(collectionName, function(error, collection){
				assert.notEqual(error, null);
				var c = collection.find().sort(field).limit(1);
				// {}, function(error, result){
				// 	callback(error, result)
				// });
				c.nextObject(function(error, res){
					callback(error, res);
				});
			});
		});

	}
	var find = function(dbName, collectionName, query, callback) {
		if (!dbName) {
			if (!callback) throw 'mongo.find: Invalid Database Name.';
			else return callback('mongo.find: Invalid Database Name.', null);
		}
		var connector = new mongodb.Db(dbName, srv);
		if (!collectionName) {
			if (!callback) throw 'mongo.find: Invalid Collection Name.';
			else return callback('mongo.find: Invalid Collection Name.', null);
		}
		if (!query) {
			if (!callback)
				throw 'mongo.find: Invalid Query.';
			else return callback('mongo.find: Invalid Query.', null);
		}
		if (!callback) return;
		connector.open(function(error, db){
			assert.notEqual(error, null);
			console.log('Connected to: ' + dbName);
			db.collection(collectionName, function(error, col){
				assert.notEqual(error, null);
				col.find(query, {'id' : true}, function(error, cursor) {
					if (error) return callback(error, null);
					cursor.toArray(function(e, r){
						return callback(null, r);
					});
				});
			});
		});
	}
	return {
		find: find,
		maxID: maxID
	}
}());
//////	TESTS.
mongo.maxID('github', 'test', {'id': -1}, function(error, max){
	assert.notEqual(error, null);	
	console.log('Max value: ');
	console.log(max);
});
// mongo.find('github', 'test', {}, function(error, results){
// 		if (error) {console.log(error)};
// 	console.log('Result: ');
// 	console.log(results);
// });
exports.mongo = mongo;