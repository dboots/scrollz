var Video = function(my_config, my_canvas) {
	'use strict';

	//-- Source folder of video frames
	var _src = my_config.src;

	//-- Frames *should* be prefixed the same
	var _prefix = (my_config.prefix) ? my_config.prefix : 'IMG_00';

	//-- How many frames to use
	var _length = (my_config.length) ? my_config.length : 0;

	//-- How many frames are currently loaded
	var _loaded = 0;

	//-- Collection of preloaded video frames
	var _frames = [];
	var _frameIndex = 0;

	//-- The type of frame image (jpg, png, etc)
	var _type = (my_config.type) ? my_config.type : 'jpg';

	//-- Starting x/y position
	var _x = (my_config.x) ? my_config.x : 0;
	var _y = (my_config.y) ? my_config.y : 0;

	var _startFrame = (my_config.startFrame) ? my_config.startFrame : 0;
	var _endFrame = (my_config.endFrame) ? my_config.endFrame : 0;

	var _width = (my_config.width) ? my_config.width : 0;
	var _height = (my_config.height) ? my_config.height : 0;

	var _canvas = my_canvas;
	var _frameCounter = 0;
	var _fps = 6;

	//-- Frame index of video
	var _frame = 0;

	this.getX = function() {
		return _x;
	};

	this.getY = function() {
		return _y;
	};

	this.getWidth = function() {
		return _width;
	};

	this.getHeight = function() {
		return _height;
	};

	this.getLength = function() {
		return _length;
	};

	this.preload = function() {
		//-- Image name example IMG_0001.png
		for (var i = 1; i <= _length; i++) {
			if (i < 10)
				i = '0' + i;

			var filename = _src + _prefix + i + '.' + _type;
			var img = new Image();

			img.src = filename;
			img.onload = this.preloadCallback;

			_frames.push(img);
		}
	};

	this.preloadCallback = function() {
		_loaded++;
		console.log('Loading: ' + ((_loaded / _length).toFixed(0) * 100) + '%');
	};

	this.getImage = function() {
		return _frames[_frameIndex];
	};

	this.reset = function(my_direction) {
		if (my_direction) {
			_frameIndex = 1;
		} else {
			_frameIndex = (_length - 1);
		}
	};

	this.play = function(my_direction) {
		_frameCounter++;

		if (_frameCounter >= _fps) {
			if (my_direction) {
				_frameIndex++;
			} else {
				_frameIndex--;
			}

			if (_frameIndex <= 0) {
				_frameIndex = _length - 1;
			} else if (_frameIndex >= _length) {
				_frameIndex = 1;
			}

			_frameCounter = 0;
		}
	};

	this.resize = function(my_canvas) {
		var height = _height.toString();
		var width = _width.toString();

		if (my_canvas) {
			_canvas = my_canvas;
		}

		if (height.indexOf('%') > -1) {
			height = height.substr(0, height.length - 1);
			_height = (_canvas.height * height / 100);
		}

		if (width.indexOf('%') > -1) {
			width = parseInt(width.substr(0, width.length - 1), 0);
			_width = (_canvas.width * width / 100);
		}

		console.log('resized to ' + _width + ', ' + _height);
		console.log('cavnas size is ' + _canvas.width + ', ' + _canvas.height);
	};

	this.preload();
	this.resize();
};