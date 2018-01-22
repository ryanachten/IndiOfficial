$(document).ready(
	function(){
		$('.video-container').vide(
			{
	  		mp4: 'video/indi',
				poster: 'img/Indi_AlbumCover'
			},{
			  volume: 0.1,
			  playbackRate: 1,
			  muted: true,
			  loop: true,
			  autoplay: true,
			  position: '50% 50%',
			  posterType: 'detect',
			  resizing: true,
			  bgColor: 'transparent',
			  className: 'music-video--blurred'
			}
		);
	}
);

$(window).resize(function(){
	var vide = $('.video-container').data('vide');
	vide.resize();
});

$('#music-infoclose').click(function(){
	var video = $('.music-video--blurred');
	$(video).addClass('music-video--unblurred');
	$(video).removeClass('music-video--blurred');

	$('#music-infocontainer').fadeOut(); $('.video-container').data('vide').getVideoObject().muted = false;

	$('#music-infoopen').fadeIn();
});


$('#music-infoopen').click(function(){
	var video = $('.music-video--unblurred');
	$(video).addClass('music-video--blurred');
	$(video).removeClass('music-video--unblurred');

	$('#music-infocontainer').fadeOut(); $('.video-container').data('vide').getVideoObject().muted = true;

	$('#music-infocontainer').fadeIn();
	$('#music-infoopen').fadeOut();
});
