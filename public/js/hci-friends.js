'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	$(window).load(function() {
		initializePage();
	});
});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$('#main_container').delay( 600 ).fadeIn(1000);

	$('.song_link').click(function(e) {
		console.log('link clicked');

		var src = $(this).attr("href");
		if (src.search("soundcloud") != -1) {
			console.log('displaying soundcloud');

			e.preventDefault();
			embedSoundCloud(src);
		}
		else if (src.search("youtu") != -1) {
			console.log('displaying youtube');

			e.preventDefault();
			embedYoutube( parseYoutubeId(src) );
		}
	});


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