function waveForm(dataArray, bufferLength){

	//analyser.fftSize = 1024; //defines Fast Fourier Transform rate 

	canvasCtx.clearRect(0,0,canvWidth,canvHeight); //reset canvas for new vis

	function draw(){
		drawVisual = requestAnimationFrame(draw); //this keeps looping the drawing function once it has started
		analyser.getByteTimeDomainData(dataArray); //retrieve the data and copy it into our array
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		//line width and color
		canvasCtx.lineWidth = 2;
			canvasCtx.beginPath();

		//width of ea. segment = canv.w / arraylength
		var sliceWidth = canvWidth * 1.0 / bufferLength;
			var x = 0; //position to move to to draw ea. line segment

		for(var i=0; i <bufferLength; i++){
			var v = dataArray[i] / 128.0; //128.0 height based on the data point value form the array
			canvasCtx.strokeStyle = 'hsl('+ dataArray[i]*5 +',80%,70%)';
			var y = v * canvHeight/2;

			if(i===0){
				canvasCtx.moveTo(x,y); // moving the line across to the place where the next wave segment should be drawn
			}else{
				canvasCtx.lineTo(x,y);
			}
			x += sliceWidth;
		}

		canvasCtx.lineTo(canvWidth, canvWidth/2);
			canvasCtx.stroke();
	}
		draw();
}

function indiTest01(dataArray, bufferLength){

		var requiredAssets = 5; //not the best approach
								//	- subject to falability if not updated
		var loadedAssets = 0;

		var rodDashSvg = new Image();
		rodDashSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Long_Dash.svg';
		rodDashSvg.onload = function(){
			loadedAssets++;
			initImages();			
		};

		var rodOuterSvg = new Image();
		rodOuterSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Long_Outer.svg';
		rodOuterSvg.onload = function(){
			loadedAssets++;
			initImages();			
		};

		var rodInnerSvg = new Image();
		rodInnerSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Long_Inner.svg';
		rodInnerSvg.onload = function(){
			loadedAssets++;
			initImages();
		};

		var dashOuterSvg = new Image();
		dashOuterSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Short_Outer.svg';
		dashOuterSvg.onload = function(){
			loadedAssets++;
			initImages();			
		};

		var dashInnerSvg = new Image();
		dashInnerSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Short_Inner.svg';
		dashInnerSvg.onload = function(){
			loadedAssets++;
			initImages();
		};

		var dotOuterSvg = new Image();
		dotOuterSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Dot_Outer.svg';
		dotOuterSvg.onload = function(){
			loadedAssets++;
			initImages();			
		};

		var dotInnerSvg = new Image();
		dotInnerSvg.src = 'img/Indi_Web_SVG_Optimised/Indi_WebSvg_Dot_Inner.svg';
		dotInnerSvg.onload = function(){
			loadedAssets++;
			initImages();
		};


		var RodParticle = (function(){
			this.width = 60;
			this.height = 15;
			this.draw = function(xPos, yPos, degrees){
				canvasCtx.save();
				canvasCtx.translate(xPos, yPos);
				canvasCtx.rotate(degrees * Math.PI/180);
				canvasCtx.drawImage(rodDashSvg, 0, 0);	
				canvasCtx.drawImage(rodOuterSvg, 0, 0);
				canvasCtx.drawImage(rodInnerSvg, 0, 4);
				canvasCtx.restore();
			};
		});

		var DashParticle = (function(){
			this.width = 27;
			this.height = 15;
			this.draw = function(xPos, yPos, degrees){
				canvasCtx.save();
				canvasCtx.translate(xPos, yPos);
				canvasCtx.rotate(degrees * Math.PI/180);	
				canvasCtx.drawImage(dashOuterSvg, 0, 0);
				canvasCtx.drawImage(dashInnerSvg, 0, 0.5);
				canvasCtx.restore();
			};
		});

		var DotParticle = (function(){
			this.width = 15;
			this.height = 15;
			this.draw = function(xPos, yPos, degrees){
				canvasCtx.save();
				canvasCtx.translate(xPos, yPos);
				canvasCtx.rotate(degrees * Math.PI/180);	
				canvasCtx.drawImage(dotOuterSvg, 0, 0);
				canvasCtx.drawImage(dotInnerSvg, 0, 0.5);
				canvasCtx.restore();
			};
		});

		var rodPart; 
		var dashPart;
		var dotPart;


		function init(){

			var grd = canvasCtx.createRadialGradient(canvWidth/2, canvHeight/2, 0,
													canvWidth/2, canvHeight/2, canvWidth/2);
			grd.addColorStop(1,"hsl(180, 20%, 90%)");
			grd.addColorStop(0,"hsl(150, 0.5%, 95%)");

			canvasCtx.fillStyle = grd;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);
		}
		init();


		function initImages(){

			if(loadedAssets === requiredAssets){
				rodPart = new RodParticle();
				dashPart = new DashParticle();
				dotPart = new DotParticle();

				draw();
			}
		}


		function draw(){
			rodPart.draw(canvWidth/2, canvHeight/2, 0);
			rodPart.draw(canvWidth/2, canvHeight/2 + rodPart.height, 0);
			dashPart.draw(canvWidth/4, canvHeight/4, 0);
			dashPart.draw(canvWidth/4, canvHeight/4 + dashPart.height, 0);
			dotPart.draw(canvWidth*0.75, canvHeight*0.75, 0);
			dotPart.draw(canvWidth*0.75 + dotPart.width, canvHeight*0.75, 0);
		}		

	}
	indiTest01();