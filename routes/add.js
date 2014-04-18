var data = require("../data.json");

exports.addSong= function(req, res) {    
	// Your code goes here
	var newSong = {
		name: req.body.name,
		link: req.body.link
	};

	data["songs"].push(newSong);

	console.log(data);
	res.send();
 }

exports.addPlayers= function(req, res) {    
	// Your code goes here
	var newPlayers = {
		player1: req.body.player1,
		player2: req.body.player2
	};

	data["players"].push(newPlayers);

	console.log(data);
	res.send();
 }

exports.addImg= function(req, res) {    
	// Your code goes here
	var newImg = {
		link: req.query.img
	};

	data["backgrounds"].push(newImg);

	console.log(data);
	res.send();
 }