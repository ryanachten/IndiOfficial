$(document).ready(
	function functionName() {
		$('.video-container').vide(
			{
	  		mp4: 'video/indi',
				poster: 'img/Indi_AlbumCover'
			},{
			  volume: 1,
			  playbackRate: 1,
			  muted: false,
			  loop: true,
			  autoplay: true,
			  position: '50% 50%',
			  posterType: 'detect',
			  resizing: true,
			  bgColor: 'transparent',
			  className: ''
			}
		);
	}
);
