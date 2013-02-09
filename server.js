/*jshint es5:true */
/*global node:true, require:false, process:false, console:false, __dirname:false */

//
// The server
//

var express = require("express"),
	sio = require("socket.io"),
	http = require("http");

var app = express(),
	server = http.createServer(app),
	io = sio.listen(server);

app.use(express.static(__dirname+'/www'));

io.configure(function () {
	/*
	https://github.com/learnboost/socket.io/wiki/Configuring-Socket.IO
	0 - error
	1 - warn
	2 - info
	3 - debug
	*/
	io.set('log level', 1);
});

var port = process.env.PORT || 3000;
server.listen(port, function () {
	console.log("Listening on "+port);
});

io.sockets.on('connection', function (socket) {
	
	socket.on('movebot', function (data) {
		socket.emit('imagereceived', data);
	});

	socket.on('disconnect', function () {
		// TODO: anything?
	});
});
