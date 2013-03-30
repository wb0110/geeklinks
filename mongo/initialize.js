var mongodb = require("mongodb"),
    srv = new mongodb.Server('127.0.0.1', 27017),
    connector = new mongodb.Db('github', srv);

var init = (function(){
	var create = function(colName, objects){
		connector.open(function(error, db){
			if (error) throw error;
			console.log('Connected to '+ db.databaseName +' database...');
			db.collection(colName, function(error, collection){
				if (error) throw error;
				db.createCollection(colName, function(err, collection){
					console.log('collection test was created successfully');
					for (var i in objects) collection.insert(objects[i]);
				});
			});
		});
	};
	var drop = function(colName){
		connector.open(function(error, db){
			if (error) throw error;
			db.dropCollection(colName, function(error, result){
				console.log(result);
			});
		});
	};
	return {
		create: create,
		drop: drop
	}
}());
//init.drop('test');
// init.create('test', [{'id':'1'}, {'id':'2'}, {'id':'3'}]);