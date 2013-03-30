var mongodb = require("mongodb"),
    srv = new mongodb.Server('127.0.0.1', 27017),
    connector = new mongodb.Db('github', srv);

connector.open(function(error, db){
	if (error) throw error;
	console.log('Connected to '+ db.databaseName +' database...');
	db.collection('test', function(error, collection){
		if (error) throw error;
		db.createCollection("test", function(err, collection){
			console.log('collection test was created successfully');
			collection.insert({'id':'2'});
			collection.insert({'id':'3'});
		});
	});
});