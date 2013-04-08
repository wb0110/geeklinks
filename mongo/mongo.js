/*
***********************************************
**************	Created by Amir Moravej 
**************	Copyrights (c) 2013 Amir Moravej
**************	All rights reserved
**************	Contact: amir@doob.io 
***********************************************
*/
var assert = require('assert'),
	mongodb = require('mongodb');
exports.db = (function(){
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
		connector.open(function(error, db){
			if (error) throw error;
			console.log('Max: Connected to: ' + dbName);
			db.collection(collectionName, function(error, collection){
				assert.equal(error, null);
				var c = collection.find().sort(t).limit(1);
				c.nextObject(function(error, res){
					if (callback && typeof callback === 'function') return callback(error, res);
					return res;
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
		if (!query) query = {};
		else if (typeof query === 'function') {
			callback = query;
			query = {};
		}
		connector.open(function(error, db){
			assert.equal(error, null);
			console.log('Find: Connected to: ' + dbName);
			db.collection(collectionName, function(error, col){
				assert.equal(error, null);
				col.find(query, function(error, cursor) {
					if (error) return callback(error, null);
					cursor.toArray(function(e, r){
						if (callback && typeof callback === 'function') return callback(null, r);
						return r;
					});
				});
			});
		});
	};
	// var srv = ;
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
		var connector = new mongodb.Db(dbName, new mongodb.Server('127.0.0.1', 27017), 
			{safe:false, w: -1});	
		connector.open(function(error, db){
			assert.equal(error, null);
			console.log('Create: Connected to: ' + dbName);
			db.collection(collectionName, function(error, col){
				assert.equal(error, null);
				col.insert(doc);
				connector.close();
				if (callback && typeof callback === 'function') return callback(true);
				return;
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
	var drop = function(dbName, callback) {
		assert.notEqual(dbName, null);
		var connector = new mongodb.Db(dbName, new mongodb.Server('127.0.0.1', 27017));
		connector.open(function(err, db){
			if (err) { throw err; }
			db.dropDatabase(function(err) {
				if (err) { throw err; }
				console.log("database %s has been dropped!", dbName);
				if (callback && typeof callback === 'function') callback(err);
				return;
			});
		});
		connector.close();
	};
	return {
		find: find,
		max: max, 
		create: create,
		drop: drop,
		removeAll: removeAll
	}
}()); 
