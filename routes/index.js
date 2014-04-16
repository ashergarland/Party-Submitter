// Get all of our friend data
var data = require('../data.json');

exports.view = function(req, res){

	res.render('index', {
		'background': randomBackground(),
		'songs': data["songs"],
		'players': data["players"]
	});
};

function randomBackground() {
	var backgrounds = data["backgrounds"];
	var num = Math.floor(Math.random()*backgrounds.length);

	return backgrounds[num].link;
}