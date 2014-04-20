'use strict';

var library;
// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	$(window).load(function() {
		library = instantiateLibrary();
		initializePage();
	});
});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	// Fade in the content after the page background picture is fully loaded -- looks hella cool
	$('#main_container').delay( 600 ).fadeIn(1000);

	// Add music link click handler
	$('.song_link').click(onVideoLinkClick);

	// Add add button click handler
	$('#song-add-btn').click(addSong);
	$('#player-add-btn').click(addPlayers);

	console.log("Javascript connected!");
}

function instantiateLibrary() {
	var library = {};

	library.songs = {};
	var links = $('#song-table').find('a');
	links.each(function(index, Element) {
		library.songs[$(this).attr('href')] = index;
	});

	library.current = -1;

	library.size = links.length;

	library.loop = true;

	library.autoplay = true;

	library.add = function (url) {
		if (this.songs[url] != undefined) { 
			return false;
		}
		this.songs[url] = this.size;
		this.size = this.size + 1;
		return true;
	}

	library.remove = function(url) {
		if (this.songs[url] == undefined) {
			return false;
		}
		delete this.songs[url];
		this.size = this.size - 1;
	}

	library.setCurrent = function (url) {
		if (this.songs[url] == undefined) {
			return false;
		}
		this.current = this.songs[url];
	}

	library.getNext = function () {
		if (this.autoplay == false) {
			return false;
		}
		
		// If at end then return the first
		if (this.current == this.size - 1) {
			if (this.loop == true) {
				for (var track in this.songs) {
					return track;
				}
			}
			return false;
		}

		// Find next track
		var flag = false;
		for (var track in this.songs) {
			// If flag is set then return this track
			if (flag == true) {
				return track;
			}
			// If track is the current, then set the flag to return the next track
			if (this.songs[track] == this.current) {
				flag = true;
			}
		}

		return false;
	}

	return library;
}

function onVideoLinkClick(e) {
	var src = $(this).attr("href");

	if (src.search("soundcloud") != -1) {
		e.preventDefault();
		library.setCurrent(src);
		makeRowCurrent($(this).parents('tr'));
		$('html,body').animate({ scrollTop: 0 }, 'slow', function () {
			embedSoundCloud(src);
		});
	}
else if (src.search("youtu") != -1) {
		e.preventDefault();
		library.setCurrent(src);
		makeRowCurrent($(this).parents('tr'));
		$('html,body').animate({ scrollTop: 0 }, 'slow', function () {
			embedYoutube( parseYoutubeId(src) );
		});
	}
	else {
		library.current = -1;
	}
}

function parseYoutubeId(url){
    if(url.indexOf('?') != -1 ) {
        var query = decodeURI(url).split('?')[1];
        var params = query.split('&');
        for(var i=0,l = params.length;i<l;i++)
            if(params[i].indexOf('v=') === 0)
                return params[i].replace('v=','');
    } else if (url.indexOf('youtu.be') != -1) {
        return decodeURI(url).split('youtu.be/')[1];
    }
    return null;
}

/*
// Old way to do youtube video -- doesn't allow to check if song has finished
function embedYoutube(id) {
	var src = '//www.youtube.com/embed/' + id;
	$('#player').html('<iframe width="560" height="315" src="' + src + '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
	$('#player').append('<span id="player_remove" class="glyphicon glyphicon-remove"></span>');
	$('#player_remove').click(hidePlayer);
	displayPlayer();
}
*/

function embedYoutube(id) {
	// Instantiate the youtube player
	onYouTubeIframeAPIReady(id);
	// Append the player remove button
    $('#player').append('<span id="player_remove" class="glyphicon glyphicon-remove"></span>');
	$('#player_remove').click(hidePlayer);
	// Display the player
	displayPlayer();
}

function onYouTubeIframeAPIReady(video_id) {
	var iframe_id = 'player_iframe';

	var iframe = $('#player').html("").append(
	    $('<div>')
	    .attr('id', iframe_id)
	);

	var player = new YT.Player(iframe_id, {
		height: '315',
		width: '560',
		videoId: video_id,
		events: {
			'onReady': youtube_onPlayerReady,
			'onStateChange': youtube_onPlayerStateChange
		}
	});
}

// autoplay video
function youtube_onPlayerReady(event) {
    event.target.playVideo();
}

// when video ends
function youtube_onPlayerStateChange(event) {        
    if(event.data === 0) {          
        playNext();
    }
}

/*
function embedSoundCloud(src) {
	$.getJSON('http://soundcloud.com/oembed?callback=?',
    {format: 'js', url: src, iframe: true, maxheight: 305, maxwidth: 560, auto_play: true},
	    function(data) {
	        // Stick the html content returned in the object into the page
	        $('#player').html(data['html']);
	        $('#player').append('<span id="player_remove" class="glyphicon glyphicon-remove"></span>');
			$('#player_remove').click(hidePlayer);
	        displayPlayer();
	    }
	)
}
*/

function embedSoundCloud(src) {
	$.getJSON('http://soundcloud.com/oembed?callback=?',
    {format: 'js', url: src, iframe: true, maxheight: 305, maxwidth: 560, auto_play: true},
	    function(data) {
	        // Stick the html content returned in the object into the page
	        var player = $('#player').html(data['html']);
	        // Define the soundcloud widget
	        player.children('iframe').attr('id', 'player_iframe');
	        var widget = SC.Widget('player_iframe');
	        // Bind the on finish event to play the next song
	        widget.bind(SC.Widget.Events.FINISH, function() {
				playNext();
			});
			// Append the remove player button
	        $('#player').append('<span id="player_remove" class="glyphicon glyphicon-remove"></span>');
			$('#player_remove').click(hidePlayer);
			// Display the player
	        displayPlayer();
	    }
	)
}

function displayPlayer() {
	if ($('#player').is(":visible")){
		return;
	}
	$('#player').slideDown('fast');
}

function hidePlayer() {
	if (!($('#player').is(":visible"))){
		return;
	}
	$('#player').slideUp('fast', function() {
		$('#player').html('');
	});
}

function addSong(e) {
	e.preventDefault();
	// Retrieve input text
	var name = $('#name-input').val();
	var link = $('#link-input').val();
	// Clear input
	$('#name-input').val('');
	$('#link-input').val('');
	// Set the button state to loading
	$('song-add-btn').button('loading');
	// Structure the data
	var data = { 
		name: name, 
		link: link
	};
	// check if duplicate
	if (library.add(link) == false) {
		alert("Duplicate");
		return;
	}
	// Perform post
    $.post('/addSong', data, function(res) {
    	// Reset button state
    	$('song-add-btn').button('reset');
    	// Append new row
    	var row = createTableRow(name, urlToSongLink(link).wrap('<p/>').parent().html());
    	row.appendTo($('#song-table'));
    	// Add video link on click handler
    	row.find('a').click(onVideoLinkClick);
    	// Scroll to new row
    	$('html, body').animate({
	        scrollTop: row.offset().top
	    }, 'slow');
    });
}

function addPlayers(e) {
	e.preventDefault();
	// Retrieve input text
	var player1 = $('#player1-input').val();
	var player2 = $('#player2-input').val();
	// Clear input 
	$('#player1-input').val('');
	$('#player2-input').val('');
	// Set the button state to loading
	$('player-add-btn').button('loading');
	// Structure the data
	var data = { 
		player1: player1, 
		player2: player2
	};
	// check if duplicate
	if (library.add(link) == false) {
		alert("Duplicate");
		return;
	}
	// Perform post
    $.post('/addPlayers', data, function(res) {
    	// Reset button state
    	$('player-add-btn').button('reset');
    	// Append the new row
    	var row = createTableRow(player1, player2);
    	row.appendTo($('#player-table'));
    	// Scroll page to the new row
    	$('html, body').animate({
	        scrollTop: row.offset().top
	    }, 'slow');
    });
}

function createTableRow() {
	var row = $('<tr></tr>');
	for (var i = 0; i < arguments.length; i++) {
		var column = $('<td>' + arguments[i] +'</td>').appendTo(row);
  	}
  	return row
}

function urlToSongLink(url) {
	// Create the link jquery element
	var a = $('<a>', {
		class: 'song_link',
		href: url,
		target: '_blank'
	}).html(url);

	return a;
}

function makeRowCurrent(row) {
	if (row == null || row == undefined) {
		$('.current').removeClass('current');
		return;
	}
	$('.current').removeClass('current');
	row.addClass('current');
}

function playNext() {
	var next_src = library.getNext();
	if (next_src == false) {
		makeRowCurrent(null);
		return;
	}

	if (next_src.search("soundcloud") != -1) {
		library.setCurrent(next_src);
		var row = $('#song-table').find('tr').get(library.current);
		console.log($(row));
		makeRowCurrent($(row));
		embedSoundCloud(next_src);
	}
	else if (next_src.search("youtu") != -1) {
		library.setCurrent(next_src);
		var row = $('#song-table').find('tr').get(library.current);
		console.log($(row));
		makeRowCurrent($(row));
		embedYoutube( parseYoutubeId(next_src) );
	}
	else {
		library.current = -1;
		makeRowCurrent(null);
	}
}
