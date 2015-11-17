var socketIo = require('socket.io');
var express = require("express");
var http = require('http');


var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socketIo(server);

var numberOfUsers = 0;
var users = {};

io.on("connection",function(socket){
	console.log("Client Connected");
	numberOfUsers++;
	
	

	socket.on('message',function(message,name){
		console.log("Received message: ",message);
		socket.broadcast.emit("message",message,name);
	});

	socket.on("typing",function(name){
		console.log("Currently typing: ",name);
		socket.broadcast.emit("typing",name);
	});

	socket.on("doneTyping",function(name){
		console.log("Done typing: ",name);
		socket.broadcast.emit("doneTyping",name);

		
	});

	socket.on("error",function(err){
		console.log(err);
	});

	socket.on("disconnect",function(){
		numberOfUsers -= 1;
		for(user in users){
			console.log(user);
			if(users[user] == socket){
				delete users[user];
			}
		}
		socket.broadcast.emit("updateUsersList",Object.keys(users));
		socket.broadcast.emit("connected",numberOfUsers);
	});


	socket.on("private",function(from, to, message){
		users[to].emit("private",message,from)
	})

	socket.on("register",function(name){
		console.log("REGISTERED: ", name);
		users[name] = socket;
		socket.broadcast.emit("updateUsersList",Object.keys(users));
		socket.emit("updateUsersList",Object.keys(users));
		socket.broadcast.emit("connected",numberOfUsers);
		socket.emit("connected",numberOfUsers);
	});
});



var PORT = 3000;
server.listen(PORT, function(){
	console.log("listening to port: ",PORT);
});

