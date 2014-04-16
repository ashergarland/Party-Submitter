var data = require("../data.json");

exports.addSong= function(req, res) {    
	// Your code goes here
	var newSong = {
		name: req.query.name,
		link: req.query.link
	};

	data["songs"].push(newSong);

	console.log(data);

	res.redirect('/');
 }

exports.addPlayers= function(req, res) {    
	// Your code goes here
	var newPlayers = {
		player1: req.query.player1,
		player2: req.query.player2
	};

	data["players"].push(newPlayers);

	console.log(data);

	res.redirect('/');
 }

exports.addImg= function(req, res) {    
	// Your code goes here
	var newImg = {
		link: req.query.img
	};

	data["backgrounds"].push(newImg);

	console.log(data);

	res.redirect('/');
 }