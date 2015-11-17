$(document).ready(function(){
	var socket = io();
    var input = $('input#message-box');
    var messages = $('#messages');
    var privateBox = $("#private");
    var name = prompt('Enter Name: ');
    var users = $(".users");

    socket.emit("register",name);

	var addMessage = function(message,name){
		messages.prepend("<div class = 'message'>"+name+ ": "+message+"</div>");
	};

	var isTyping = function(name){
		if(!$("div#"+name).length){
			messages.prepend("<div id ="+name+">" +name+ " is typing</div>");
		};
	};

	var connected = function(curUsers){
		console.log(curUsers);
		$("div.numUsers").text(String(curUsers));
	}

	var doneTyping = function(name){
		console.log("inside done typing");
		$('div#'+name).remove();
	}

	var receivedPrivate  = function(message,from){
		messages.prepend("<div class = 'message'>"+"PRIVATE MESSAGE FROM " +from+ ": "+message+"</div>");
	};

	var updateUsersList = function( usersList ){
		console.log("inside updateUsersList");
		console.log(usersList);
		users.children().remove();
		for( user in usersList ){
			console.log("loop: ", user);
			var newUser = $(".user").clone().text(usersList[user]);
			newUser.show();
			users.append(newUser);
		};
	};

	input.on('keydown',function(event){
		if(event.keyCode != 13){
			socket.emit("typing",name);
			
			return;
		};
		socket.emit("doneTyping",name);
		var message = input.val();
		addMessage(message,name);
		if(privateBox.val()){
			var receiver = privateBox.val();
			privateBox.val("");
			socket.emit("private",name,receiver,message);
			return;

		}
		socket.emit('message', message,name);
		input.val('');
	});

	$(document).on("mousedown",".user", function(){
		$("#private").val($(this).text());
	});

	socket.on("message",addMessage);
	socket.on('typing',isTyping);
	socket.on('doneTyping',doneTyping);
	socket.on('connected',connected);
	socket.on("private",receivedPrivate);
	socket.on("updateUsersList",updateUsersList);
	
});


