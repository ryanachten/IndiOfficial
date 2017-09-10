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

function chladniPlate(dataArray, bufferLength){

	//Runtime UI stuff
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'visdat-gui';
	var visSettings	= $('#vis-settings');
	visSettings.show().append(gui.domElement);

	var guiObj = {
		nodeDamping: 5,
		attractMode: 'smooth',
		attractRadius: 10,
		attractStrength: 37,
		attractRamp: 1
	};

	gui.add(guiObj, "attractMode", ['basic', 'smooth', 'twirl']);
	gui.add(guiObj, "nodeDamping").min(0).max(20);
	gui.add(guiObj, "attractRadius").min(0).max(20);
	gui.add(guiObj, "attractStrength").min(0).max(200);
	gui.add(guiObj, "attractRamp").min(0.1).max(5);

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

	var xCount = canvWidth/100; //15;
	var yCount = canvHeight/100; //15;
	var gridStepX = canvWidth/xCount;
	var gridStepY = canvHeight/yCount;

	var nodeDamping;
	var attractor, nodes;

	$(window ).resize(function() {
		init();
	});

	function init(){

		xCount = canvWidth/100; //15;
		yCount = canvHeight/100; //15;

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

		if(guiObj.attractMode === 'smooth'){
			attractor.mode = 'smooth';
		}else if(guiObj.attractMode === 'twirl'){
			attractor.mode = 'twirl';
		}else{
			attractor.mode = 'basic';
		}

		var dataArray = new Uint8Array(fftSampleSize);
		fft.getByteTimeDomainData(dataArray);

		var da = dataArray[0];

		attractor.strength = Math.random()* (da * (guiObj.attractStrength/100));
		if(Math.floor(Math.random()*2) === 1) attractor.strength *= -1;
		attractor.radius = Math.random()* (da*guiObj.attractRadius);

		attractor.ramp = Math.random()*guiObj.attractRamp;

		// nodeDamping = Math.random()*0.8;
		// 	if(Math.floor(Math.random()*2) === 1) nodeDamping *= -1;

		nodeDamping = guiObj.nodeDamping/100; //non-random


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

function nodeAttraction(dataArray, bufferLength){

	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'visdat-gui';
	var visSettings	= $('#vis-settings');
	visSettings.show().append(gui.domElement);

	var guiObj = {
		showAttactionNode: false,
		nodeDamping: 8,
		attractRadius: 420,
		attractStrength: -42,
		attractRamp: 640,
		maxVelocity: 15,
	};
	gui.add(guiObj, "showAttactionNode");
	gui.add(guiObj, "nodeDamping").min(0).max(100);
	gui.add(guiObj, "attractRadius").min(0).max(500);
	gui.add(guiObj, "attractRamp").min(0).max(1000);
	gui.add(guiObj, "maxVelocity").min(0).max(20);

	var rodPart = new RodParticle();
	var dashPart = new DashParticle();
	var dotPart = new DotParticle();

	var Attractor = (function(x, y){

		this.x = x;
		this.y = y;
		this.radius = 200; //radius of impact
		this.strength = 1; //+ for attraction, - for repulsion
		this.ramp = 0.5; // form of function

		this.attract = function(node){
			var dx = this.x - node.x;
			var dy = this.y - node.y;
			var d = Math.sqrt(
				Math.pow(dx, 2) + Math.pow(dy, 2)
			);
			if(d > 0 && d < this.radius){
				//calc force
				var s = d/this.radius;
				var f = (1 / Math.pow(s, 0.5*this.ramp) -1);

				//apply force
				node.velocity.x += dx * f;
				node.velocity.y += dy * f;
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

	var xCount = canvWidth/100;
	var yCount = canvHeight/100;
	var nodeCount = xCount * yCount;
	var nodes;
	var node_Damping = guiObj.nodeDamping/100;

	var attractor;
	var attractor_MaxRamp, attractor_Radius, attractor_Strength;

	var clientX = canvWidth/2;
	var clientY = canvHeight/2;

	$(window).mousemove(function(e){
		if (typeof e.pageX !== 'undefined' && typeof e.pageY !== 'undefined'){
			var rect = canvas.getBoundingClientRect();
			clientX = e.pageX - rect.left;
			clientY = e.pageY - rect.top;
		}
	})

	$(window).resize(function() {
		init();
	});

	function init(){

		xCount = canvWidth/75;
		yCount = canvHeight/75;

		nodes = [];
		var gridSizeX = canvWidth/xCount;
		var gridSizeY = canvHeight/yCount;

		for(var y = 0; y < yCount; y++){
			for(var x = 0; x < xCount; x++){
				var xPos = x*gridSizeX;
				var yPos = y*gridSizeY;
				var node = new Node(xPos, yPos);
				node.setBoundary(0,0, canvWidth, canvHeight);
				node.setDamping(node_Damping);
				var rand = Math.floor(Math.random()*3);
				if(rand === 0) node.type = 'rod';
				else if(rand === 1) node.type = 'dash';
				else if(rand === 2) node.type = 'dot';
				nodes.push(node);
			}
		}

		attractor = new Attractor(canvWidth/2, canvHeight/2);
		attractor.radius = guiObj.attractRadius;
		attractor.strength = guiObj.attractStrength;
		attractor.ramp = guiObj.attractRamp/100;

		startAnimating(10);
	}
	init();


	function draw(){

		var dataArray = new Uint8Array(fftSampleSize);
		fft.getByteTimeDomainData(dataArray);

		var da = dataArray[0];

		canvasCtx.clearRect(0,0, canvWidth,canvHeight);
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth,canvHeight);

		attractor_Radius = guiObj.attractRadius;
		attractor_Strength = guiObj.attractStrength;
		attractor_MaxRamp = da/guiObj.attractRamp;

		attractor.strength = attractor_Strength;
		attractor.radius = attractor_Radius;

		attractor.x = clientX;
		attractor.y = clientY;

		if(guiObj.showAttactionNode){
			canvasCtx.beginPath();
			canvasCtx.arc(attractor.x, attractor.y, 5, 0, Math.PI*2);
			canvasCtx.closePath();
			canvasCtx.fillStyle = 'black';
			canvasCtx.fill();
			canvasCtx.beginPath();
			canvasCtx.arc(attractor.x, attractor.y, attractor.radius, 0, Math.PI*2);
			canvasCtx.closePath();
			canvasCtx.strokeStyle = 'black';
			canvasCtx.stroke();
		}


		attractor.ramp = Math.random()*attractor_MaxRamp;
		if(Math.floor(Math.random()*2) === 1) attractor.ramp*=-1;


		for(var i = 0; i < nodes.length; i++){

			node_Damping = guiObj.nodeDamping/100;
			nodes[i].setDamping(node_Damping);
			attractor.attract(nodes[i]);
			nodes[i].update();

			var theta = Math.atan2(attractor.y - nodes[i].y, attractor.x -nodes[i].x)

			if(nodes[i].type === 'rod'){
				rodPart.draw(nodes[i].x, nodes[i].y, theta);
			}else if(nodes[i].type === 'dash'){
				dashPart.draw(nodes[i].x, nodes[i].y, theta);
			}else if(nodes[i].type === 'dot'){
				dotPart.draw(nodes[i].x, nodes[i].y, theta);
			}
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

function lissajousFigure(dataArray, bufferLength){

	//Runtime UI stuff
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'visdat-gui';
	var visSettings	= $('#vis-settings');
	visSettings.show().append(gui.domElement);

	var guiObj = {
		phi: 95,
		pointCount: 50,
		freqX: 40,
		freqY: 40,
		modulated: false,
		modFreqX: 40,
		modFreqY: 40
	};
	gui.add(guiObj, "pointCount").min(1).max(300).onChange(init);
	gui.add(guiObj, "phi").min(1).max(360);
	gui.add(guiObj, "freqX").min(1).max(70);
	gui.add(guiObj, "freqY").min(1).max(70);
	gui.add(guiObj, "modulated").onChange(init);
	gui.add(guiObj, "modFreqX").min(1).max(70);
	gui.add(guiObj, "modFreqY").min(1).max(70);

	var pointCount;
	var freqX, freqY;
	var phi, angle;
	var x, y;
	var margin = 50;

	var modFreqX = 2;
	var modFreqY = 4;
	var modPhi = 0;

	var w, maxDist;
	var oldX, oldY;

	var factorX = canvWidth/2 - margin;
	var factorY = canvHeight/2 - margin;

	var modulated;

	var particleArray;

	var rodPart = new RodParticle();
	var dashPart = new DashParticle();
	var dotPart = new DotParticle();

	function init(){
		canvasCtx.clearRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		if(guiObj.modulated){
			modulated = true;
		}else{
			modulated = false;
		}
		canvasCtx.strokeStyle = 'black';
		pointCount = parseInt(guiObj.pointCount);
		freqX = parseInt(guiObj.freqX);
		freqY = parseInt(guiObj.freqY);
		phi = parseInt(guiObj.phi);

		particleArray = [];
		for(var i = 0; i < pointCount; i++){
			var type;
			var rand = Math.floor(Math.random()*3);
			if(rand === 0) type = 'rod';
			else if(rand === 1) type = 'dash';
			else if(rand === 2) type = 'dot';

			var particle = {
				type: type,
				x: null,
				y: null
			}
			particleArray.push(particle);
		}

		startAnimating(15);
	}
	init();


	function draw(){

		canvasCtx.clearRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		var dataArray = new Uint8Array(fftSampleSize);
		fft.getByteTimeDomainData(dataArray);
		var da = dataArray[0];


		var logda = (Math.log(da) / Math.log(2));
		if(isFinite(logda) && logda !== 0){
			freqX = logda * parseInt(guiObj.freqX);
			freqY = logda * parseInt(guiObj.freqY);
			modFreqX = logda * parseInt(guiObj.modFreqX);
			modFreqY = logda * parseInt(guiObj.modFreqY);
			phi = parseInt(guiObj.phi) - logda;
		}


		for(var i = 0; i < particleArray.length; i++){
			angle = map_range(i, 0,pointCount, 0,Math.PI*2);

			if(modulated){
				x = Math.sin(angle*freqX + (Math.PI/180)*phi * Math.cos(angle *modFreqX));
				y = Math.sin(angle*freqY) * Math.cos(angle * modFreqY);
			}else{
				x = Math.sin(angle*freqX + (Math.PI/180)*phi); //lissajous
				y = Math.sin(angle*freqY); //lissajous
			}

			particleArray[i].x =  x * factorX + canvWidth/2;
			particleArray[i].y = y * factorY + canvHeight/2;

			var pointerPart = particleArray[i-1];

			if(i !== 0){ //HACK prevents the 'stray' from occur due to index length issue
			var theta = Math.atan2(pointerPart.y - particleArray[i].y, pointerPart.x -particleArray[i].x);
			if(particleArray[i].type === 'rod')
			rodPart.draw(particleArray[i].x, particleArray[i].y, theta);
			else if(particleArray[i].type === 'dash')
			dashPart.draw(particleArray[i].x, particleArray[i].y, theta);
			else if(particleArray[i].type === 'dot')
			dotPart.draw(particleArray[i].x, particleArray[i].y, theta);
		}
	}
}

function map_range(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
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
