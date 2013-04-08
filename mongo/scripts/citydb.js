/*
***********************************************
**************	Created by Amir Moravej 
**************	Copyrights (c) 2013 Amir Moravej
**************	All rights reserved
**************	Contact: amir@doob.io 
***********************************************
*/ 
var fs = require('fs'),
	assert = require('assert'),
	fpath = __dirname + '/' + 'cities.txt',
	// Currently (April 2013) stability of ReadLine is: 2 -unstable.
	readline = require('readline'), 
	mongo = require('/Apps/geeklinks/mongo/mongo.js'),
	line, foundCanada = false, carryOn = true, count = 0;
console.log(__dirname)
fs.stat(fpath, function(err, stats){
	assert.equal(err, null);
	console.log(stats);
});

line = readline.createInterface({
	input: fs.createReadStream(fpath),
	output: process.stdout,
	terminal: false
});

line.on('line', function(l){
	++count;
	console.log(l);
	var country = l.substr(0, 2);
	if (!foundCanada && country == 'ca') foundCanada = true;
	if (foundCanada && country != 'ca') carryOn = false; 

	// assert.equal(carryOn, true);
	// assert.notEqual(count++, 3);
	if (!carryOn) line.close();
});