function waveForm(dataArray, bufferLength){

	//analyser.fftSize = 1024; //defines Fast Fourier Transform rate 

	canvasCtx.clearRect(0,0,canvWidth,canvHeight); //reset canvas for new vis

	function draw(){
		drawVisual = requestAnimationFrame(draw); //this keeps looping the drawing function once it has started
		
		var dataArray = new Uint8Array(fftSampleSize); 
    	fft.getByteTimeDomainData(dataArray);

		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		//line width and color
		canvasCtx.lineWidth = 2;
			canvasCtx.beginPath();

		//width of ea. segment = canv.w / arraylength
		var sliceWidth = canvWidth * 1.0 / dataArray.length; //bufferLength;
			var x = 0; //position to move to to draw ea. line segment

		for(var i=0; i <dataArray.length; i++){
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

		function draw(){
			var rodPart = new RodParticle();
			var dashPart = new DashParticle();
			var dotPart = new DotParticle();
			rodPart.draw(canvWidth/2, canvHeight/2, 0);
			rodPart.draw(canvWidth/2, canvHeight/2 + rodPart.height, 0);
			dashPart.draw(canvWidth/4, canvHeight/4, 0);
			dashPart.draw(canvWidth/4, canvHeight/4 + dashPart.height, 0);
			dotPart.draw(canvWidth*0.75, canvHeight*0.75, 0);
			dotPart.draw(canvWidth*0.75 + dotPart.width, canvHeight*0.75, 0);
		}		
		draw();
	}


function chladniPlate(dataArray, bufferLength){

	var rodPart = new RodParticle();
	var dashPart = new DashParticle();
	var dotPart = new DotParticle();

	var Attractor = (function(x, y){

		this.x = x;
		this.y = y;
		this.radius = 200; //radius of impact
		this.strength = 1; //+ for attraction, - for repulsion
		this.ramp = 0.5; // form of function
		this.mode = 'basic';

		this.attract = function(node){
			var dx = this.x - node.x;
			var dy = this.y - node.y;
			var d = Math.sqrt(
					Math.pow(dx, 2) + Math.pow(dy, 2)
				);
			var f = 0;

			switch(this.mode){
				case 'basic':
					if(d > 0 && d < this.radius){
						//calc force
						var s = d/this.radius;
						f = (1 / Math.pow(s, 0.5*this.ramp) -1);
						f = this.strength * f / this.radius;
					}
					break;
				case 'smooth': // Fallthrough
				case 'twirl':
					if(d > 0 && d < this.radius){
						var s = Math.pow(d/this.radius, 1/this.ramp);
						f = s * 9 * this.strength * (1 / (s + 1) + ((s-3) /4)) /d;
					}
					break;
				default:
					f = null;
			}
			
			//apply force
			if(this.mode !== 'twirl'){
				node.velocity.x += dx * f;
				node.velocity.y += dy * f;
			}
			else{
				node.velocity.x += dx * f;
				node.velocity.y -= dy * f;
			}
		};
	});

	var Node = (function(x, y){

		this.type = null;
		this.minX = 5;
		this.minY = 5;
		this.maxX = canvWidth-5;
		this.maxY = canvHeight-5;
		this.damping = 0.1;
		this.x = x;
		this.y = y;
		this.velocity = {
			x: null,
			y: null
		};

		this.update = function(){

			this.x += this.velocity.x;
			this.y += this.velocity.y;

			if(this.x < this.minX){
				this.x = this.minX - (this.x - this.minX);
				this.velocity.x *= -1;
			}

			if(this.x > this.maxX){
				this.x = this.maxX - (this.x - this.maxX);
				this.velocity.x *= -1;
			}

			if(this.y < this.minY){
				this.y = this.minY - (this.y - this.minY);
				this.velocity.y *= -1;
			}

			if(this.y > this.maxY){
				this.y = this.maxY - (this.y - this.maxY);
				this.velocity.y *= -1;
			}

			this.velocity.x *= (1-this.damping);
			this.velocity.y *= (1-this.damping);
		};

		this.setBoundary = function(minX, minY, maxX, maxY){
			this.minX = minX;
			this.minY = minY;
			this.maxX = maxX;
			this.maxY = maxY;
		};

		this.setDamping = function(newDamping){
			this.damping = newDamping;
		};
	});

	//Runtime UI stuff		
	var visSettings	= document.getElementById('vis-settings');
		visSettings.style.display = 'block';
	
	var nodeDampingInput = document.createElement('input');
		nodeDampingInput.type = 'range';
		nodeDampingInput.id = 'nodeDampingInput';
		nodeDampingInput.className = 'vis-setting';
		nodeDampingInput.min = 0;
		nodeDampingInput.max = 100;
		nodeDampingInput.value = 5; //need to be /100 for 0.8
		var nodeDampingLabel = document.createElement('label');
			nodeDampingLabel.htmlFor = 'nodeDampingInput';
			nodeDampingLabel.innerHTML = 'Node Damping';
			nodeDampingLabel.className = 'vis-setting';

	var basicDiv = document.createElement('div');
		basicDiv.className = 'vis-setting switch';
		var basicModeInput = document.createElement('input');
			basicModeInput.id = 'basicModeInput';
			basicModeInput.type = 'radio';
			basicModeInput.name = 'attractMode';
			basicModeInput.className = 'vis-setting switch-input';
		var basicModeLabel = document.createElement('label');
			basicModeLabel.htmlFor = 'basicModeInput';
			basicModeLabel.innerHTML = 'Basic Mode';
			basicModeLabel.className = 'vis-setting';
		var basicModePaddel = document.createElement('label');
			basicModePaddel.className = 'vis-setting switch-paddle';
			basicModePaddel.htmlFor = 'basicModeInput';
	
	var smoothDiv = document.createElement('div');
		smoothDiv.className = 'vis-setting switch';
		var smoothModeInput = document.createElement('input');
			smoothModeInput.id = 'smoothModeInput';
			smoothModeInput.type = 'radio';
			smoothModeInput.name = 'attractMode';
			smoothModeInput.className = 'vis-setting switch-input';
			smoothModeInput.checked = true;
		var smoothModeLabel = document.createElement('label');
			smoothModeLabel.htmlFor = 'smoothModeInput';
			smoothModeLabel.innerHTML = 'Smooth Mode';
		var smoothModePaddel = document.createElement('label');
			smoothModePaddel.className = 'vis-setting switch-paddle';
			smoothModePaddel.htmlFor = 'smoothModeInput';

	var twistDiv = document.createElement('div');
		twistDiv.className = 'vis-setting switch';
		var twistModeInput = document.createElement('input');
			twistModeInput.id = 'twistModeInput';
			twistModeInput.type = 'radio';
			twistModeInput.name = 'attractMode';
			twistModeInput.className = 'vis-setting switch-input';
			// twistModeInput.checked = true;
		var twistModeLabel = document.createElement('label');
			twistModeLabel.htmlFor = 'twistModeInput';
			twistModeLabel.innerHTML = 'Twist Mode';
		var twistModePaddel = document.createElement('label');
			twistModePaddel.className = 'vis-setting switch-paddle';
			twistModePaddel.htmlFor = 'twistModeInput';	

	var lineDiv = document.createElement('div');
		lineDiv.className = 'vis-setting switch';
		var lineModeInput = document.createElement('input');
			lineModeInput.id = 'lineModeInput';
			lineModeInput.type = 'radio';
			lineModeInput.name = 'drawMode';
			lineModeInput.className = 'vis-setting switch-input';
			lineModeInput.checked = true;
		var lineModeLabel = document.createElement('label');
			lineModeLabel.htmlFor = 'lineModeInput';
			lineModeLabel.innerHTML = 'Draw Lines';
			lineModeLabel.className = 'vis-setting';
		var lineModePaddel = document.createElement('label');
			lineModePaddel.className = 'vis-setting switch-paddle';
			lineModePaddel.htmlFor = 'lineModeInput';
	
	var circleDiv = document.createElement('div');
		circleDiv.className = 'vis-setting switch';
		var circleModeInput = document.createElement('input');
			circleModeInput.id = 'circleModeInput';
			circleModeInput.type = 'radio';
			circleModeInput.name = 'drawMode';
			circleModeInput.className = 'vis-setting switch-input';
		var circleModeLabel = document.createElement('label');
			circleModeLabel.htmlFor = 'circleModeInput';
			circleModeLabel.innerHTML = 'Draw Circles';
			circleModeLabel.className = 'vis-setting';
		var circleModePaddel = document.createElement('label');
			circleModePaddel.className = 'vis-setting switch-paddle';
			circleModePaddel.htmlFor = 'circleModeInput';
				
	var attractRadiusInput = document.createElement('input');
		attractRadiusInput.type = 'range';
		attractRadiusInput.id = 'attractRadiusInput';
		attractRadiusInput.className = 'vis-setting';
		attractRadiusInput.min = 0;
		attractRadiusInput.max = 20;
		attractRadiusInput.value = attractRadiusInput.max/2;
		var attractRadiusLabel = document.createElement('label');
			attractRadiusLabel.htmlFor = 'attractRadiusInput';
			attractRadiusLabel.innerHTML = 'Attraction Radius';
			attractRadiusLabel.className = 'vis-setting';

	var attractStrengthInput = document.createElement('input');
		attractStrengthInput.type = 'range';
		attractStrengthInput.id = 'attractStrengthInput';
		attractStrengthInput.className = 'vis-setting';
		attractStrengthInput.min = 0;
		attractStrengthInput.max = 200;
		attractStrengthInput.value = 37;
		var attractStrengthLabel = document.createElement('label');
			attractStrengthLabel.htmlFor = 'attractStrengthInput';
			attractStrengthLabel.innerHTML = 'Attraction Strength';
			attractStrengthLabel.className = 'vis-setting';

	var attractRampInput = document.createElement('input');
		attractRampInput.type = 'range';
		attractRampInput.id = 'attractRampInput';
		attractRampInput.className = 'vis-setting';
		attractRampInput.min = 0.1;
		attractRampInput.max = 5;
		attractRampInput.value = 1; //need to be /100 for 0.2
		var attractRampLabel = document.createElement('label');
			attractRampLabel.htmlFor = 'attractRampInput';
			attractRampLabel.innerHTML = 'Attraction Ramp';
			attractRampLabel.className = 'vis-setting';

		basicDiv.appendChild(basicModeLabel);
		basicDiv.appendChild(basicModeInput);
		basicDiv.appendChild(basicModePaddel);
		smoothDiv.appendChild(smoothModeLabel);
		smoothDiv.appendChild(smoothModeInput);
		smoothDiv.appendChild(smoothModePaddel);
		twistDiv.appendChild(twistModeLabel);
		twistDiv.appendChild(twistModeInput);
		twistDiv.appendChild(twistModePaddel);
	visSettings.appendChild(basicDiv);
	visSettings.appendChild(smoothDiv);
	visSettings.appendChild(twistDiv);
	visSettings.appendChild(nodeDampingLabel);
	visSettings.appendChild(nodeDampingInput);
	visSettings.appendChild(attractRadiusLabel);
	visSettings.appendChild(attractRadiusInput);
	visSettings.appendChild(attractStrengthLabel);
	visSettings.appendChild(attractStrengthInput);
	visSettings.appendChild(attractRampLabel);
	visSettings.appendChild(attractRampInput);

	var xCount = 15;
	var yCount = 15;
	var gridStepX = canvWidth/xCount;
	var gridStepY = canvHeight/yCount;

	var nodeDamping;
	var attractor, nodes;

	function init(){

		attractor = new Attractor(canvWidth/2, canvHeight/2);
		nodes = [];

		canvasCtx.lineWidth = 1;
		canvasCtx.strokeStyle = 'black';

		initGrid();
		startAnimating(30);

	}
	init();

	function initGrid(){

		var xPos, yPos;
		
			for(var x = 0; x < xCount; x++){
				for(var y = 0; y < yCount; y++){
				xPos = gridStepX *x;
				yPos = gridStepY *y;

				var node = new Node(xPos, yPos);
					node.velocity.x = 0; //??
					node.velocity.y = 0; //??
					node.damping = nodeDamping;
				var rand = Math.floor(Math.random()*3);
					if(rand === 0) node.type = 'rod';
					else if(rand === 1) node.type = 'dash';
					else if(rand === 2) node.type = 'dot';

				nodes.push(node);
			}
		}
	}

	function draw(){

		canvasCtx.clearRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		if(smoothModeInput.checked){
			attractor.mode = 'smooth';
		}else if(twistModeInput.checked){
			attractor.mode = 'twirl';
		}else{
			attractor.mode = 'basic';
		}
		
		var dataArray = new Uint8Array(fftSampleSize); 
    	fft.getByteTimeDomainData(dataArray);

		var da = dataArray[0];

		attractor.strength = Math.random()* (da * (attractStrengthInput.value/100));
			if(Math.floor(Math.random()*2) === 1) attractor.strength *= -1;
		attractor.radius = Math.random()* (da*attractRadiusInput.value);

		attractor.ramp = Math.random()*attractRampInput.value;

		// nodeDamping = Math.random()*0.8;
		// 	if(Math.floor(Math.random()*2) === 1) nodeDamping *= -1;

		nodeDamping = nodeDampingInput.value/100; //non-random


		for (var i = 0; i < nodes.length; i++) {
			nodes[i].setDamping(nodeDamping);
			attractor.attract(nodes[i]);
			nodes[i].update();
		}

		var i = 0;
		for(var y = 0; y < yCount; y++){
			canvasCtx.beginPath()
			for(var x = 0; x < xCount; x++){
				var theta = Math.atan2(canvHeight/2 - nodes[i].y, canvWidth/2 -nodes[i].x)
				if(nodes[i].type === 'rod'){
					rodPart.draw(nodes[i].x, nodes[i].y, theta);
				}else if(nodes[i].type === 'dash'){
					dashPart.draw(nodes[i].x, nodes[i].y, theta);
				}else if(nodes[i].type === 'dot'){
					dotPart.draw(nodes[i].x, nodes[i].y, theta);
				}

				// canvasCtx.moveTo(nodes[i].x, nodes[i].y);

				// var theta = Math.atan2(canvHeight/2 - nodes[i].y, canvWidth/2 -nodes[i].x); //point towards centre
				// var theta = Math.atan2(nodes[i+1].y - nodes[i].y, nodes[i+1].x -nodes[i].x); //point towards neighbour
				// canvasCtx.lineTo((Math.cos(theta)*5) + nodes[i].x, (Math.sin(theta)*5) +nodes[i].y);
				
				if(i+2 < nodes.length-1) i++;
			}
			canvasCtx.closePath();
			canvasCtx.stroke();
		}
	}

	var stop = false;
	var frameCount = 0;
	var fps, fpsInterval, startTime, now, then, elapsed;

	function startAnimating(fps){
		fpsInterval = 1000/fps;
		then = Date.now();
		startTime = then;
		animate();
	}

	function animate(){

		if(stop){
			return;
		}
		drawVisual = requestAnimationFrame(animate);

		now = Date.now();
		elapsed = now - then;

		if(elapsed > fpsInterval){
			then = now - (elapsed % fpsInterval);

			draw();
		}
	}
}