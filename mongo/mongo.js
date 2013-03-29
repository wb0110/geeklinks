
var mongo = (function(){
	var mongodb = require("mongodb"),
		srv = new mongodb.Server('127.0.0.1', 27017);

	var max = function(dbName, callback) {
		if (!dbName) {
			if (!callback) throw 'mongo.max: Invalid Database Name.';
			else callback('mongo.max: Invalid Database Name.', null);
			return;
		} 
		if (!callback) return;

	}
	var find = function(dbName, collectionName, query, callback) {
		if (!dbName) {
			if (!callback) throw 'mongo.find: Invalid Database Name.';
			else callback('mongo.find: Invalid Database Name.', null);
			return;
		}
		if (!collectionName) {
			if (!callback) throw 'mongo.find: Invalid Collection Name.';
			else callback('mongo.find: Collection Database Name.', null);
			return;
		}
		if (!query) {
			if (!callback)
				throw 'mongo.find: Invalid Query.';
			else callback('mongo.find: Invalid Query.', null);
			return;
		}
		if (!callback) return;
		connector.open(function(error, db){
			var connector = new mongodb.Db(dbName, srv);
			if (error) throw error;
			console.log('Connected to: ' + dbName);
			db.collection(collectionName, function(error, collection){
				if (error) throw error;
				collection.find(query, function(error, cursor) {
					if (error) {
						callback(error, null);
						return;
					}
					callback(null, cursor);
				});
			});
		});
	}

	return {
		find: find,
		max: max
	}
}());


exports.mongo = mongo;