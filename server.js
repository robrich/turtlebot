/*jshint es5:true */
/*global node:true, require:false, process:false, console:false, __dirname:false */

var turtlebotIp = "ws://172.17.0.151:9090/";

var express = require("express"),
	sio = require("socket.io"),
	cio = require("websocket"),
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


var rombridgeSocket = new cio.client();

rombridgeSocket.on('connectFailed', function(error) {
	console.log('Connect to turtlebot failed: ' + error.toString());
});

rombridgeSocket.on('connect', function(rombridgeConnection) {
	console.log('turtlebot client connected');

	io.sockets.on('connection', function (browserSocket) {

		browserSocket.on('movebot', function (data) {
			// forward browser message to turtlebot
			console.log("to turtlebot: "+JSON.stringify(data));
			rombridgeConnection.sendUTF(JSON.stringify({movebot: data}));
			// TEMPORARY: send back to browser too
			browserSocket.emit('imagereceived', data);
		});

		browserSocket.on('disconnect', function () {
			// TODO: anything?
		});
	});

	rombridgeConnection.on('error', function(error) {
		console.log("turtlebot socket Error: " + error.toString());
	});
	rombridgeConnection.on('close', function() {
		console.log("turtlebot closed socket");
		// TODO: anything?
	});
	rombridgeConnection.on('message', function(message) {
		// forward turtlebot message to all browsers
		console.log('from turtlebot: ' + JSON.stringify(data));
		io.sockets.emit('imagereceived', data);
	});
});

rombridgeSocket.connect(turtlebotIp);

var port = process.env.PORT || 3000;
server.listen(port, function () {
	console.log("Listening on "+port);
});
