var assert = require('assert'),
	mongodb = require("mongodb");
var db = (function(){
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
			console.log('Max: Connected to: ' + dbName);
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
			console.log('Find: Connected to: ' + dbName);
			db.collection(collectionName, function(error, col){
				assert.equal(error, null);
				col.find(query, function(error, cursor) {
					if (error) return callback(error, null);
					cursor.toArray(function(e, r){
						return callback(null, r);
					});
				});
			});
		});
	};
	var create = function(dbName, collectionName, doc, callback) {
		if (!dbName) {
			if (!callback) throw 'mongo.find: Invalid Database Name.';
			else return callback('mongo.find: Invalid Database Name.', null);
		}
		if (!collectionName) {
			if (!callback) throw 'mongo.find: Invalid Collection Name.';
			else return callback('mongo.find: Invalid Collection Name.', null);
		}
		if (!doc) {
			if (!callback)
				throw 'mongo.find: Invalid documents to be inserted.';
			else return callback('mongo.find: Invalid documents to be inserted.', null);
		}
		if (!callback) return;

		srv = new mongodb.Server('127.0.0.1', 27017);
		var connector = new mongodb.Db(dbName, srv, {safe:false});	
		connector.open(function(error, db){
			assert.equal(error, null);
			console.log('Create: Connected to: ' + dbName);
			db.collection(collectionName, function(error, col){
				assert.equal(error, null);
				col.insert(doc);
				return callback(true);
			});
		});
	}
	var removeAll = function(dbName, collectionName) {
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
		connector.open(function(error, db){
			assert.equal(error, null);
			console.log('RemoveAll: Connected to: ' + dbName);
			db.collection(collectionName, function(error, col){
				assert.equal(error, null);
				col.remove();
			});
		});	
	};
	return {
		find: find,
		max: max, 
		create: create,
		removeAll: removeAll
	}
}());
//////	TESTS.


// db.max('github', 'repos_fetch_info', 'next', function(error, max){
// 	assert.equal(error, null);	
// 	console.log('Max value: ');
// 	console.log(max);
// });


// db.removeAll('github', 'repos_fetch_info');
// db.removeAll('github', 'repos');


// db.find('github', 'repos', {}, function(error, results){
// 		if (error) {console.log(error)};
// 	console.log('Result: ');
// 	console.log(results);
// });







exports.db = db;