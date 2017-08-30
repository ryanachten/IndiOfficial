var bufferLength;
var dataArray;

var audioCtx; //audio context
var buffer; //audio buffer
var fft; //fft audio node
var fftSampleSize = 256; //used to be 256 - put back?
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
}


function setupAudioNodes(){

	// create source node from buffer
	var source = audioCtx.createBufferSource();
	source.buffer = buffer;

	//create FFT
	fft = audioCtx.createAnalyser();
	fft.fftSize = fftSampleSize;

	//chain connections
	source.connect(fft);
	fft.connect(audioCtx.destination); //final output node (speakers)

	source.start(0); //might want to expose this for start/pause control

	setup = true;
}
