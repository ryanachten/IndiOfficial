// $( document ).ready(function() {
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
	var innerWidth = $(window).innerWidth();
	// var innerHeight = $(window).innerHeight();
	player = new YT.Player('player', {
		height: '100%',
		color: 'white',
		width: '100%',
		origin: window.location.href,
		videoId: 'F72HosSCy0g',
		playerVars: {
			'autoplay': 1,
			'controls': 0,
			'rel': 0, //should hide related videos once video stops
			'showinfo': 0, //should hide video info
			'modestbranding': 1, //prevent YT branding
			'color' : 'white'
		},
		events: {
			'onReady': onPlayerReady,
			// 'onStateChange': onPlayerStateChange
		}
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
// var done = false;
// function onPlayerStateChange(event) {
// 	if (event.data == YT.PlayerState.PLAYING && !done) {
// 		setTimeout(stopVideo, 6000);
// 		done = true;
// 	}
// }
// function stopVideo() {
// 	player.stopVideo();
// }
// });