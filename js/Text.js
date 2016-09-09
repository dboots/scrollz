function Text(my_config, my_canvas) {
	'use strict';

	var _canvas = my_canvas;

	var _x = (my_config.x) ? my_config.x : 0;
	var _y = (my_config.y) ? my_config.y : 0;
	
	var _body = (my_config.body) ? my_config.body : '';

	var _font = (my_config.font) ? my_config.font : '30px Arial';
	var _color = (my_config.color) ? my_config.color : 'black';


	var _speedX = (my_config.speedX) ? my_config.speedX : 0;
	var _speedY = (my_config.speedY) ? my_config.speedY : 0;

	this.setX = function(my_x) {
		_x = my_x;
	};

	this.setY = function(my_y) {
		_y = my_y;
	};

	this.getX = function() {
		return _x;
	};

	this.getY = function() {
		return _y;
	};

	this.getFont = function() {
		return _font;
	};

	this.getColor = function() {
		return _color;
	};

	this.getBody = function() {
		return _body;
	};

	this.draw = function(my_direction) {
		if (my_direction) {
			_y += _speedY;
			_x += _speedX;
		} else {
			_y -= _speedY;
			_x -= _speedX;
		}
	};

}