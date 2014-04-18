'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	$(window).load(function() {
		initializePage();
		SC.initialize({
		  client_id: '554b59147b860fbd58a7d2c34ed84515'
		});
	});
});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$('#main_container').delay( 600 ).fadeIn(1000);

	$('.song_link').click(function(e) {
		var src = $(this).attr("href");

		if (src.search("soundcloud") != -1) {
			e.preventDefault();
			$('html,body').animate({ scrollTop: 0 }, 'slow', function () {
				embedSoundCloud(src);
			});
		}
		else if (src.search("youtu") != -1) {
			e.preventDefault();
			$('html,body').animate({ scrollTop: 0 }, 'slow', function () {
				embedYoutube( parseYoutubeId(src) );
			});
		}
	});

	$('#song-add-btn').click(addSong);
	$('#player-add-btn').click(addPlayers);

	console.log("Javascript connected!");
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

function embedYoutube(id) {
	var src = '//www.youtube.com/embed/' + id;
	$('#player').html('<iframe width="560" height="315" src="' + src + '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
	$('#player').append('<span id="player_remove" class="glyphicon glyphicon-remove"></span>');
	$('#player_remove').click(hidePlayer);
	displayPlayer();
}

/*
// create youtube player
function embedYoutube(id) {
	$('#player').html("").append(
	    $('<iframe>')
	    .attr('id', "player_iframe")
	);
    var player = new YT.Player('player_iframe', {
      height: '315',
      width: '560',
      videoId: id,
      events: {
        'onReady': youtube_onPlayerReady,
        'onStateChange': youtube_onPlayerStateChange
      }
    });
    $('#player').append('<span id="player_remove" class="glyphicon glyphicon-remove"></span>');
	$('#player_remove').click(hidePlayer);
	displayPlayer();
}

// autoplay video
function youtube_onPlayerReady(event) {
    event.target.playVideo();
}

// when video ends
function youtube_onPlayerStateChange(event) {        
    if(event.data === 0) {          
        alert('done');
    }
}
*/


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

/*
function embedSoundCloud(src) {
	var iframe = "player_iframe";

	$('#player').html("").append(
	    $('<iframe>')
	    .attr('id', iframe)
	);

	// permalink to a track
	var track_url = src;

	SC.get('/resolve', { url: track_url }, function(track) {
		var embedUrl = 'http://api.soundcloud.com/tracks/' + track.id;
		var widget	= SC.Widget(iframe);
	    widget.bind(SC.Widget.Events.READY, function() {
	      	// load new widget
	      	widget.bind(SC.Widget.Events.FINISH, function() {
				widget.load(embedUrl, {
					auto_play: true
				});
	      	});
   	 	});
	});
	$('#player').append('<span id="player_remove" class="glyphicon glyphicon-remove"></span>');
	$('#player_remove').click(hidePlayer);
    displayPlayer();
}
*/

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
	// Structure the data
	var data = { 
		name: name, 
		link: link
	};
	// Perform post
    $.post('/addSong', data, function(res) {
    	// Append new row
    	var row = createTableRow(name, urlToSongLink(link).wrap('<p/>').parent().html());
    	row.appendTo($('#song-table'));
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
	// Structure the data
	var data = { 
		player1: player1, 
		player2: player2
	};
	// Perform post
    $.post('/addPlayers', data, function(res) {
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
		console.log('argument ' + i + " :" + arguments[i]);
		var column = $('<td>' + arguments[i] +'</td>').appendTo(row);
		console.log(column);
  	}
  	console.log(row);
  	return row
}

function urlToSongLink(url) {
	var a = $('<a>', {
		class: 'song_link',
		href: url,
		target: '_blank'
	}).html(url);
	return a;
}