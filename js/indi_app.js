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

var audioCtx, analyser;

var defaultVisMode = 'chladniPlate';
var canvWidth, canvHeight;
var canvasCtx;
var bgColor;

var requiredAssets = 7; //not the best approach
								//	- subject to falability if not updated
var loadedAssets = 0;
var rodDashSvg, rodOuterSvg, rodInnerSvg, 
	dashOuterSvg, dashInnerSvg,
	dotOuterSvg, dotInnerSvg; //svg assets

var RodParticle, DashParticle, DotParticle; //anon funct objects

var canvas;

function init(){

	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	analyser = audioCtx.createAnalyser();
	
	canvas = document.querySelector("#visualiser");
		
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

				// visualise(defaultVisMode);
				loadAssets();
			  },

			function(err) {
				console.log('The following gUM error occured: ' + err);
			}
		);
	}
}
init();


function loadAssets(){			

	rodDashSvg = new Image();
	rodDashSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Long_Dash.svg';
	rodDashSvg.onload = function(){
		loadedAssets++;
		initParts();			
	};

	rodOuterSvg = new Image();
	rodOuterSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Long_Outer.svg';
	rodOuterSvg.onload = function(){
		loadedAssets++;
		initParts();			
	};

	rodInnerSvg = new Image();
	rodInnerSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Long_Inner.svg';
	rodInnerSvg.onload = function(){
		loadedAssets++;
		initParts();
	};

	dashOuterSvg = new Image();
	dashOuterSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Short_Outer.svg';
	dashOuterSvg.onload = function(){
		loadedAssets++;
		initParts();			
	};

	dashInnerSvg = new Image();
	dashInnerSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Short_Inner.svg';
	dashInnerSvg.onload = function(){
		loadedAssets++;
		initParts();
	};

	dotOuterSvg = new Image();
	dotOuterSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Dot_Outer.svg';
	dotOuterSvg.onload = function(){
		loadedAssets++;
		initParts();			
	};

	dotInnerSvg = new Image();
	dotInnerSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Dot_Inner.svg';
	dotInnerSvg.onload = function(){
		loadedAssets++;
		initParts();
	};
}


function initParts(){

	if(loadedAssets === requiredAssets){

		RodParticle = (function(){
			this.width = 60;
			this.height = 15;
			this.draw = function(xPos, yPos, radians){
				canvasCtx.save();
				canvasCtx.translate(xPos, yPos);
				canvasCtx.rotate(radians);
				canvasCtx.drawImage(rodDashSvg, 0, 0);	
				canvasCtx.drawImage(rodOuterSvg, 0, 0);
				canvasCtx.drawImage(rodInnerSvg, 0, 4);
				canvasCtx.restore();
			};
		});

		DashParticle = (function(){
			this.width = 27;
			this.height = 15;
			this.draw = function(xPos, yPos, radians){
				canvasCtx.save();
				canvasCtx.translate(xPos, yPos);
				canvasCtx.rotate(radians);	
				canvasCtx.drawImage(dashOuterSvg, 0, 0);
				canvasCtx.drawImage(dashInnerSvg, 0, 0.5);
				canvasCtx.restore();
			};
		});

		DotParticle = (function(){
			this.width = 15;
			this.height = 15;
			this.draw = function(xPos, yPos, radians){
				canvasCtx.save();
				canvasCtx.translate(xPos, yPos);
				canvasCtx.rotate(radians);	
				canvasCtx.drawImage(dotOuterSvg, 0, 0);
				canvasCtx.drawImage(dotInnerSvg, 0, 0.5);
				canvasCtx.restore();
			};
		});

		visualise(defaultVisMode);
	}
}


function visualise(visMode){

	var dataBuffer = getBuffer(256);
	var bufferLength = dataBuffer.buffer;
	var dataArray = dataBuffer.data;

	console.log(visMode);
	if(visMode === 'BarGraph'){
		barGraph(dataArray, bufferLength); 
	}
	else if(visMode === 'indiTest01'){
		indiTest01(dataArray, bufferLength);
	}
	else if(visMode === 'WaveForm'){
		waveForm(dataArray, bufferLength);
	}
	else if(visMode === 'chladniPlate'){
		chladniPlate(dataArray, bufferLength);
	}
	else if(visMode === 'Off'){
		visOff();
	}
}


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

$(window).resize(function(){
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	canvWidth = canvas.width;
	canvHeight = canvas.height;
});