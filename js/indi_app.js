var defaultVisMode = 'waveForm';
var currentVis = defaultVisMode;
var canvWidth, canvHeight;
var canvas, canvasCtx;
var bgColor;

var requiredAssets = 7; //HACK - subject to falability if not updated
var loadedAssets = 0;
var rodDashSvg, rodOuterSvg, rodInnerSvg,
	dashOuterSvg, dashInnerSvg,
	dotOuterSvg, dotInnerSvg; //svg assets

var RodParticle, DashParticle, DotParticle; //anon funct objects

var drawVisual;


function loadSoundFile(){ //TODO - move this into _audio.js and replace with promise
	var request = new XMLHttpRequest();
	request.open('GET',
				'https://raw.githubusercontent.com/ryanachten/IndiOfficial/master/audio/Chrysaora_Colorata.mp3'
				,true);
	request.responseType = "arraybuffer";
	request.onload = function(){
		// decode loaded data
		audioCtx.decodeAudioData(request.response, function(buf){
			buffer = buf;
			setupAudioNodes();
			setupCanvas();
			loadAssets();
		});
	};
	request.send();
}

function setupCanvas(){
	canvas = document.querySelector("#visualiser");

	if(canvas.getContext){
		canvas.width = $(window).width();
		var topNavHeight = $('header').height();
		canvas.height = $(window).height() -topNavHeight;
		canvWidth = canvas.width;
		canvHeight = canvas.height;
		canvasCtx = canvas.getContext('2d');

		bgColor = canvasCtx.createRadialGradient(canvWidth/2, canvHeight/2, 0,
													canvWidth/2, canvHeight/2, canvWidth/2);
			bgColor.addColorStop(1,"hsl(180, 20%, 90%)");
			bgColor.addColorStop(0,"hsl(150, 0.5%, 95%)");

		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);
	}
}

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

		visualise(currentVis);
	}
}

function visualise(visMode){

	console.log(visMode);
	if(visMode === 'waveForm'){
		waveForm();
	}
	else if(visMode === 'chladniPlate'){
		chladniPlate(dataArray, bufferLength);
	}
	else if(visMode === 'nodeAttraction'){
		nodeAttraction(dataArray, bufferLength);
	}
	else if(visMode === 'lissajousFigure'){
		lissajousFigure(dataArray, bufferLength);
	}
	else if(visMode === 'Off'){
		visOff();
	}
}


function removeVisualSettings(){
	var visSettings	= $('.vis-setting');
	if(visSettings.length == 0){
		return;
	}
	$(visSettings).remove();
}

$('.visMode-button').click((button)=>{
	window.cancelAnimationFrame(drawVisual);
	drawVisual = undefined;
	removeVisualSettings();
	visualise(button.target.name);
});


$(window ).resize(function() {
  setupCanvas();
});
