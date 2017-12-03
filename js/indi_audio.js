var bufferLength;
var dataArray;

var audioCtx; //audio context
var buffer; //audio buffer
var fft; //fft audio node
var fftSampleSize = 256; //used to be 256 - put back?
var gainNode; //used for volume control
var audioSetup = false; //is audio setup?


// window.addEventListener('load', initSound, false); //swap out for jQ?
$(document).ready(initSound);

// init sound system
function initSound(){

	try{
		audioCtx = new AudioContext();

		loadSoundFile();
	}
	catch(e){
		alert("it seems your browser doesn't support webaudio - try another browser");
	}

	setupAudioGui();
}


function setupAudioNodes(){

	// create source node from buffer
	var source = audioCtx.createBufferSource();
	source.buffer = buffer;

	//init gain node for volume control
	gainNode = audioCtx.createGain();

	//create FFT
	fft = audioCtx.createAnalyser();

	// Add smoothing
	fft.smoothingTimeConstant = 0.5;
	fft.fftSize = fftSampleSize;


	//chain connections
	source.connect(fft);
	fft.connect(gainNode);
	gainNode.connect(audioCtx.destination); //final output node (speakers)

	source.start(0); //might want to expose this for start/pause control

	setup = true;
}

function setupAudioGui(){
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'audiodat-gui';
	var audioSettings	= $('#audio-settings');
	audioSettings.show().append(gui.domElement);

	var guiObj = {
		volume: 50
	};

	gui.add(guiObj, "volume").min(0).max(100).onChange(updateGain);

	function updateGain(){
		var gainLevel = (guiObj.volume/100).toFixed(2);
		console.log(gainLevel);
		gainNode.gain.value = gainLevel;
	}
}
