function Stage(my_config, my_canvas) {
	'use strict';

	//-- Store a reference of the object for use in event handlers
	var ref = this;
	var framerate = 2;
	var counter = 0;

	//-- Reference to canvas DOM element
	var _canvas = document.getElementById(my_canvas);

	//-- How many pixels constitutes a single frame, if none provided via my_config, default to canvas height / 12
	var _pixelsPerFrame = (my_config.pixelsPerFrame) ? my_config.pixelsPerFrame : 4;

	//-- Reference to 2d context of canvas DOM element
	var _context = _canvas.getContext('2d');

	//-- Flag that is typically set in mousedown/mouseup to determine animation status
	var _animating = false;

	//-- Start position of mousedown/touchstart
	var _startPos = 0;

	//-- Collection of Scene objects
	var _scenes = [];
	var _sceneIndex = 0;

	//-- Current frame marker
	var _currentFrame = 0;

	//-- Retain delta to properly adjust frame
	var _currentDelta = 0;

	//-- The current Scene being played
	var _currentScene;

	var _outro = false;

	this.resize = function() {
		_canvas.width = window.innerWidth;
		_canvas.height = window.innerHeight;

		if (ref.getCurrentScene())
			ref.getCurrentScene().resize(_canvas);
	};

	//-- Getters
	this.getContext = function() {
		return _context;
	};

	this.getCanvas = function() {
		return _canvas;
	};

	this.getCurrentScene = function() {
		return _scenes[_sceneIndex];
	};

	var rotation = 0, width_scaled, height_scaled;

	this.animate = function() {
		requestAnimFrame(ref.animate);

		_context.clearRect(0, 0, _canvas.width, _canvas.height);

			//-- increment prop details (x, y, etc)
			//-- if scene duration is complete, transition to next/prev scene
		if (_outro)
			ref.outro();

		if (_animating)
			ref.draw();

		//-- paint scene
		ref.drawScenes();
	};

	//-- Testing issue resolution #7

	this.draw = function() {
		console.log('draw');
		var scene = _scenes[_sceneIndex];
		
		if (_currentFrame >= scene.getDuration()) {
			_animating = false;
		} else {
			scene.drawProps(1);
			scene.playVideo(1);
			scene.drawText(1);
			_currentFrame++;
		}
	};


	this.outro = function() {
		var scene = _scenes[_sceneIndex];

		if ((_sceneIndex + 1) < _scenes.length) {

			for (var i = 0, len = _scenes.length; i < len; i++) {
				console.log('drawing scene');
				var s = _scenes[i];
				s.drawScene(true);
			}
			
			if (scene.getY() >= _canvas.height) {
				_outro = false;
				_animating = true;

				ref.nextScene();
			}
		}
	};

	this.drawScenes = function() {
		//for (var i = 0, len = _scenes.length; i < len; i++) {
			var scene = _scenes[_sceneIndex];
			var sceneX = 0;
			var sceneY = scene.getY();
			var props = scene.getProps();
			var videos = scene.getVideos();
			var texts = scene.getTexts();
			var bg = scene.getBackground();
			var video, prop, x, y, img, w, h, start, end, r, s;

			x = (0 - sceneX);
			y = (0 - sceneY);

			if (bg !== "") {
				_context.fillStyle = bg;
				_context.fillRect(x, y, _canvas.width, _canvas.height);
			}

			for (var j = 0, videoLen = videos.length; j < videoLen; j++) {
				video = videos[j];
				img = video.getImage();
				x = (video.getX() - sceneX);
				y = (video.getY() - sceneY);

				_context.drawImage(img, x, y, _canvas.width, _canvas.height);
			}

			for (var k = 0, propsLen = props.length; k < propsLen; k++) {
				prop = props[k];
				img = prop.getImage();
				x = (prop.getX() - sceneX);
				y = (prop.getY() - sceneY);
				w = prop.getWidth();
				h = prop.getHeight();
				start = prop.getStart();
				end = prop.getEnd();
				r = prop.getRotation();
				s = prop.getScale();

				_context.drawImage(img, x, y, w, h);
			}

			var text;
			for (var l = 0, textLen = texts.length; l < textLen; l++) {
				text = texts[l];
				_context.font = text.getFont();
				_context.fillStyle = text.getColor();
				_context.textBaseline = 'top';
				_context.fillText(text.getBody(), text.getX() - sceneX, text.getY() - sceneY);
			}
		//}
	};

	this.addScene = function(my_scene) {
		my_scene.setY(-(_canvas.height * _scenes.length));
		_scenes.push(my_scene);
	};

	this.nextScene = function() {
		_sceneIndex++;
		_currentFrame = 0;
	};

	this.getPrevScene = function() {
		if (_sceneIndex >= _scenes.length)
			return _scenes[0];

		if (_sceneIndex <= 0)
			return _scenes[_scenes.length-1];

		return _scenes[_sceneIndex-1];
	};

	this.prevScene = function() {
		_sceneIndex--;

		if (_sceneIndex < 0)
			_sceneIndex = (_scenes.length - 1);

		_currentScene = _scenes[_sceneIndex];
		_currentFrame = ref.getCurrentScene().getDuration();
	};

	this.currentFrameFromDelta = function(my_delta) {
		var scene = _scenes[_sceneIndex];
		var direction = (my_delta < _currentDelta);

		if (!direction && _sceneIndex > 0) {
			if (_currentFrame < 0) {
				ref.prevScene();
				_outro = true;
			}
		}

		if (direction && _sceneIndex < _scenes.length) {
			if (_currentFrame >= scene.getDuration()) {
				ref.nextScene();
				_outro = true;
			}

			if (ref.getPrevScene().getY() >= _canvas.height) {
				_outro = false;
			}
		}

		for (var i = 0, len = _scenes.length; i < len; i++) {
			var s = _scenes[i];

			if (_outro) {
				s.drawScene(direction);
			} else {
				scene.drawProps(direction);
				scene.playVideo(direction);
				scene.drawText(direction);
			}
		}

		if (!_outro) {
			console.log('no outro');
			_currentFrame = (direction) ? _currentFrame+1 : _currentFrame-1;
		}

		_currentDelta = my_delta;
	};

	this.getPos = function(my_canvas, my_event, my_touch) {
		if (my_touch) {
			var touch = my_event.touches[0];
			
			return {
				x: touch.clientX,
				y: touch.clientY
			};
		} else {
			var rect = my_canvas.getBoundingClientRect();

			return {
				x: my_event.clientX - rect.left,
				y: my_event.clientY - rect.top
			};
		}
	};

	this.move = function(my_event, my_touch) {
		var delta, endPos;

		if (_animating) {
			endPos = ref.getPos(ref.getCanvas(), my_event, my_touch);
			delta = ref.getDelta(_startPos.y, endPos.y, _pixelsPerFrame);

			if (_currentDelta != delta)
				ref.currentFrameFromDelta(delta);

			/*
			if (_currentFrame > ref.getCurrentScene().getDuration()) {
				//ref.getCurrentScene().resetProps(true);
				//ref.getCurrentScene().resetVideos(true);
				ref.nextScene();
			} else if (_currentFrame < 0) {
				ref.prevScene();
				//ref.getCurrentScene().resetProps(false);
				//ref.getCurrentScene().resetVideos(false);
			}
			*/

			//-- TODO: Remove debugging
			document.getElementById('frame').innerHTML = _currentFrame;
			
		}
	};

	this.down = function(my_event, my_touch) {
		_outro = true;
		_startPos = ref.getPos(ref.getCanvas(), my_event, my_touch);
	};

	this.up = function(my_event, my_touch) {
		//_animating = false;
		_currentDelta = 0;
	};

	this.getDelta = function(my_start, my_end, my_interval) {
		var delta = (my_end - my_start);
		console.log(delta);
		return Math.floor(delta / my_interval);
	};

	this.resize();

	//-- Window methods/event listeners
	window.addEventListener('resize', function(e) {
		ref.resize();
	});

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||

			function( /* function */ callback, /* DOMElement */ element) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	//-- Add touch/mouse event (move, down, up) listeners to canvas
	_canvas.addEventListener('mousemove', function(e) {
		e.preventDefault();
		//ref.move(e, false);
	});

	_canvas.addEventListener('mousedown', function(e) {
		e.preventDefault();
		ref.down(e, false);
	});

	_canvas.addEventListener('mouseup', function(e) {
		e.preventDefault();
		ref.up(e, false);
	});

	_canvas.addEventListener('touchmove', function(e) {
		e.preventDefault();
		//ref.move(e, true);
	});

	_canvas.addEventListener('touchstart', function(e) {
		e.preventDefault();
		ref.down(e, true);
	});

	_canvas.addEventListener('touchstop', function(e) {
		e.preventDefault();
		ref.up(e, true);
	});
}

Stage.prototype.Start = function() {
	this.animate();
};