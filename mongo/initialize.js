var mongodb = require("mongodb"),
    srv = new mongodb.Server('127.0.0.1', 27017),
    connector = new mongodb.Db('github', srv);

connector.open(function(error, db){
	if (error) throw error;
	console.log('Connected to '+ db.databaseName +' database...');
	db.collectionNames(function(error, collections){
		console.log(collections)
		if (error) throw error;
		var collection = null;
		for (var i in collections)
			if (collections[i]['name'] == 'github.test') collection = collections[i];
		if (!collection)
			db.createCollection("test", function(err, collection){
				console.log('collection test was created successfully');
				collection.insert({'id':'1'}, {'id':'2'}, {'id':'3'});
			});
	});
});