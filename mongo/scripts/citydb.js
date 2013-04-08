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
	readline = require('readline'), rd, flag = true, count = 0;

fs.stat(fpath, function(err, stats){
	assert.equal(err, null);
	console.log(stats);
});

rd = readline.createInterface({
	input: fs.createReadStream(fpath),
	output: process.stdout,
	terminal: false
});

rd.on('line', function(l){
	console.log(l);
	console.log(++count);
	assert.notEqual(count, 10);
});