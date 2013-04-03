/*****************************************************************
**************	Created by Amir Moravej					***************
**************	Copyrights (c) 2013 Amir Moravej.	***************
**************	All rights reserved.						***************
**************	Contact: amir@doob.in					***************
******************************************************************/

var assert = require('assert'), 
	mongodb = require("mongodb"),
   srv = new mongodb.Server('127.0.0.1', 27017),
   connector = new mongodb.Db('github', srv);

var init = (function(){
	var create = function(colName, objects){
		if (!colName) return;
		connector.open(function(error, db){
			assert.equal(error, null);
			console.log('Connected to '+ db.databaseName +' database...');
			db.collection(colName, function(error, collection){
				if (error) throw error;
				db.createCollection(colName, function(err, collection){
					console.log('collection '+colName+' was created successfully');
					for (var i in objects) collection.insert(objects[i]);
				});
			});
		});
	};
	var drop = function(colName){
		connector.open(function(error, db){
			assert.equal(error, null);
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
// init.create('repos_fetch_info');
//init.drop('test');
// init.create('test', [{'id':'1'}, {'id':'2'}, {'id':'3'}]);