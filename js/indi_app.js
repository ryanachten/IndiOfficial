var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();


// var fftInput = document.getElementById("fft-input");
// fftInput.onchange = function(){
// 	window.cancelAnimationFrame(drawVisual);
// 	visualise(visualisationMode.value);
// }

// var minDb = document.getElementById("min-db-input");
// minDb.onchange = function(){
// 	analyser.minDecibels = minDb.value;
// }
// var maxDb = document.getElementById("max-db-input");
// maxDb.onchange = function(){
// 	analyser.maxDecibels = maxDb.value;
// }

// var smoothingRange = document.getElementById("smoothing-input");
// smoothingRange.onchange = function(){
// 	// console.log("val: " + smoothingRange.value);
// 	analyser.smoothingTimeConstant = smoothingRange.value/100;
// }


$(window).resize(function(){
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	canvWidth = canvas.width;
	canvHeight = canvas.height;
});


var defaultVisMode = 'indiTest01';
var canvWidth, canvHeight;
var canvasCtx;
var bgColor;


function init(){

	//Canvas Setup
	
	var canvas = document.querySelector("#visualiser");
		
	if(canvas.getContext){
		canvas.width = $(window).width();
		canvas.height = $(window).height();
		canvWidth = canvas.width;
		canvHeight = canvas.height;
		canvasCtx = canvas.getContext('2d');

		bgColor = canvasCtx.createRadialGradient(canvWidth/2, canvHeight/2, 0,
													canvWidth/2, canvHeight/2, canvWidth/2);
			bgColor.addColorStop(1,"hsl(180, 20%, 90%)");
			bgColor.addColorStop(0,"hsl(150, 0.5%, 95%)");

		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		
		var drawVisual;

		//Microphone access
		navigator.getUserMedia (
			{
				audio: true
			},
			function(stream) {
				source = audioCtx.createMediaStreamSource(stream);
				source.connect(analyser);

				visualise(defaultVisMode);
			  },

			function(err) {
				console.log('The following gUM error occured: ' + err);
			}
		);
	}
}
init();


function getBuffer(fftSize){
	analyser.fftSize = 256; //1024
	var bufferLength = analyser.frequencyBinCount;
	console.log(bufferLength);
	var dataArray = new Uint8Array(bufferLength);
	var dataBuffer = {
		"buffer" : bufferLength,
		"data" : dataArray
	}
	return dataBuffer;
}


function changeVisualMode(visualMode){
	window.cancelAnimationFrame(drawVisual);
	drawVisual = undefined;
	
	removeVisualSettings();
	document.getElementById('vis-settings').style.display = 'none';
	
	visualise(visualMode);
}


function visualise(visMode){

	var dataBuffer = getBuffer(256);
	var bufferLength = dataBuffer.buffer;
	var dataArray = dataBuffer.data;

	console.log(visMode);
	if(visMode === 'BarGraph'){
		barGraph(dataArray, bufferLength); 
	}
	else if(visMode === 'WaveForm'){
		waveForm(dataArray, bufferLength);
	}
	else if(visMode === 'WaveForm'){
		indiTest01(dataArray, bufferLength);
	}
	else if(visMode === 'Off'){
		visOff();
	}
}

function visOff(){
	canvasCtx.clearRect(0,0,canvWidth, canvHeight);
	canvasCtx.fillStyle = bgColor;
	canvasCtx.fillRect(0,0,canvWidth, canvHeight);
}


function removeVisualSettings(){
	var visSettings	= document.getElementsByClassName('vis-setting');
	if(visSettings.length == 0){
		return;
	}
	$('.vis-setting').remove();
}