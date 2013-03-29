var mongodb = require("mongodb"),
    srv = new mongodb.Server('127.0.0.1', 27017),
    connector = new mongodb.Db('github', srv);

db_connector.open(function(error, db){
	if (error) throw error;
	console.log('Connected to '+db+' database...');
});