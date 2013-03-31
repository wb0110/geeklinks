var assert = require('assert'),
	mongodb = require("mongodb");
var mongo = (function(){
	var max = function(dbName, collectionName, field, callback) {
		srv = new mongodb.Server('127.0.0.1', 27017);
		if (!dbName) {
			if (!callback) throw 'mongo.max: Invalid Database Name.';
			else return callback('mongo.max: Invalid Database Name.', null);
		} 
		var connector = new mongodb.Db(dbName, srv);
		if (!collectionName) {
			if (!callback) throw 'mongo.max: Invalid Collection Name.';
			else return callback('mongo.max: Invalid Collection Name.', null);
		}
		if (!field || typeof field != 'string') {
			if (!callback) throw 'mongo.max: Invalid field.';
			else return callback('mongo.max: Invalid field.', null);
		}
		var t = {};
		t[field] = -1;
		if (!callback) return;
		connector.open(function(error, db){
			if (error) throw error;
			console.log('Connected to: ' + dbName);
			db.collection(collectionName, function(error, collection){
				assert.equal(error, null);
				var c = collection.find().sort(t).limit(1);
				c.nextObject(function(error, res){
					callback(error, res);
				});
			});
		});

	}
	var find = function(dbName, collectionName, query, callback) {
		srv = new mongodb.Server('127.0.0.1', 27017);
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
			assert.equal(error, null);
			console.log('Connected to: ' + dbName);
			db.collection(collectionName, function(error, col){
				assert.equal(error, null);
				col.find(query, {'id' : true}, function(error, cursor) {
					if (error) return callback(error, null);
					cursor.toArray(function(e, r){
						return callback(null, r);
					});
				});
			});
		});
	};
	var create = function(dbName, collectionName, docs, callback) {
		srv = new mongodb.Server('127.0.0.1', 27017);
		if (!dbName) {
			if (!callback) throw 'mongo.find: Invalid Database Name.';
			else return callback('mongo.find: Invalid Database Name.', null);
		}
		var connector = new mongodb.Db(dbName, srv);
		if (!collectionName) {
			if (!callback) throw 'mongo.find: Invalid Collection Name.';
			else return callback('mongo.find: Invalid Collection Name.', null);
		}
		if (!docs) {
			if (!callback)
				throw 'mongo.find: Invalid documents to be inserted.';
			else return callback('mongo.find: Invalid documents to be inserted.', null);
		}
		if (!callback) return;
		connector.open(function(error, db){
			assert.equal(error, null);
			console.log('Connected to: ' + dbName);
			db.collection(collectionName, function(error, col){
				assert.equal(error, null);
				db.createCollection(colName, function(err, collection){
					for (var i in docs) collection.insert(docs[i]);
					return callback();
				});
			});
		});
	}
	return {
		find: find,
		max: max, 
		create: create
	}
}());
//////	TESTS.
// mongo.max('github', 'repos_fetch_info', 'next', function(error, max){
// 	assert.equal(error, null);	
// 	console.log('Max value: ');
// 	console.log(max);
// });
// mongo.find('github', 'test', {}, function(error, results){
// 		if (error) {console.log(error)};
// 	console.log('Result: ');
// 	console.log(results);
// });
exports.mongo = mongo;