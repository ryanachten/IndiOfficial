$(document).ready(
	function functionName() {
		$('.video-container').vide('video/indi', {
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
		});
	}
);
