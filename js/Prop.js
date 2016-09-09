var Prop = function(my_config, my_canvas) {
	'use strict';

	var _canvas = my_canvas;

	var _x = (my_config.x) ? my_config.x : 0;
	var _y = (my_config.y) ? my_config.y : 0;

	var _w = (my_config.w) ? my_config.w : -1;
	var _h = (my_config.h) ? my_config.h : -1;

	var _startX = _x;
	var _startY = _y;
	var _endX = (my_config.endX) ? my_config.endX : -1;
	var _endY = (my_config.endY) ? my_config.endY : -1;

	var _speedX = (my_config.speedX) ? my_config.speedX : 0;
	var _speedY = (my_config.speedY) ? my_config.speedY : 0;

	var _start = (my_config.start) ? my_config.start : 0;
	var _end = (my_config.end) ? my_config.end : -1;

	var _intro = my_config.intro;
	var _active = true;

	var _rotation = 0;
	var _rotationInterval = (my_config.end && my_config.rotate) ? my_config.rotate / my_config.end : 0;
	var _rotate = (my_config.rotate) ? my_config.rotate : -1;
	var _scale = 1;

	var _image = new Image();

	this.getImage = function() {
		return _image;
	};

	this.getX = function() {
		return _x;
	};

	this.getY = function() {
		return _y;
	};

	this.getStart = function() {
		return _start;
	};

	this.getEnd = function() {
		return _end;
	};

	this.getActive = function() {
		return _active;
	};

	this.getRotate = function() {
		return _rotate;
	};

	this.getWidth = function() {
		if (_w < 0)
			return _canvas.width;
		else
			return _w;
	};

	this.getHeight = function() {
		if (_h < 0)
			return _canvas.height;
		else
			return _h;
	};

	this.getRotation = function() {
		return _rotation;
	};

	this.getScale = function() {
		return _scale;
	};

	this.setActive = function(my_active) {
		_active = my_active;
	};

	this.setX = function(my_x) {
		_x = my_x;
	};

	this.setY = function(my_y) {
		_y = my_y;
	};


	this.reset = function(my_direction, my_duration) {

		if (my_direction) {
			_x = _startX;
			_y = _startY;
		} else {
			_x = (_speedX > 0) ? (my_duration * _speedX) : _startX;
			_y = (_speedY > 0) ? (my_duration * _speedY) : _startY;
		}
	};

	this.draw = function(my_direction, my_active) {

		//-- intros = 360-in, fade-in, scale-up
		//-- outros = 360-out, fade-out, scale-down
		//-- x = 0

		if (my_direction) {
			_y += _speedY;
			_x += _speedX;
		} else {
			_y -= _speedY;
			_x -= _speedX;
		}

		/*
		if (_active) {
			if (my_direction) {
				_x += _speedX;
				_y += _speedY;
				_rotation += _rotationInterval;
				_scale += 0.1;
			} else {
				_x -= _speedX;
				_y -= _speedY;
				_rotation -= _rotationInterval;
				_scale -= 0.1;
			}
		}

		
		if (_x > my_canvas.width) {
			_x = 0;
		} else if (_x < 0) {
			_x = my_canvas.width;
		}

		if (_y > my_canvas.height) {
			_y = 0;
		} else if (_y < 0) {
			_y = my_canvas.height;
		}
		*/
	};

	_image.src = my_config.src;
};