var data = require("../data.json");

exports.addSong= function(req, res) {    
	// Your code goes here
	var newSong = {
		name: req.query.name,
		link: req.query.link
	};

	console.log(newSong);

	data["songs"].push(newSong);

	res.redirect('/');
 }

exports.addPlayers= function(req, res) {    
	// Your code goes here
	var newPlayers = {
		player1: req.query.player1,
		player2: req.query.player2
	};

	console.log(newPlayers);

	data["players"].push(newPlayers);

	res.redirect('/');
 }

exports.addImg= function(req, res) {    
	// Your code goes here
	var newImg = {
		link: req.query.img
	};

	console.log(newImg);

	data["backgrounds"].push(newImg);

	res.redirect('/');
 }