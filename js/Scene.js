function Scene(my_config, my_canvas) {
	'use strict';

	var _duration = (my_config.duration) ? my_config.duration : 0;
	var _x = 0;
	var _y = 0;
	var _speedY = 128;
	var _speedX = 0;
	var _props = [];
	var _videos = [];
	var _texts = [];
	var _canvas = my_canvas;
	var _fixed = (my_config.fixed) ? my_config.fixed : false;
	var _outro = false;
	var _active = false;
	var _background = (my_config.background) ? my_config.background : "";

	this.addProps = function(my_props, my_canvas) {
		if (typeof my_props !== 'undefined') {
			for (var i = 0, len = my_props.length; i < len; i++) {
				var p = new Prop(my_props[i], _canvas);
				_props.push(p);
			}
		}
	};

	this.addText = function(my_text, my_canvas) {
		if (typeof my_text !== 'undefined') {
			for (var i = 0, len = my_text.length; i < len; i++) {
				var t = new Text(my_text[i], _canvas);
				_texts.push(t);
			}
		}
	};

	this.addVideos = function(my_videos, my_canvas) {
		if (typeof my_videos !== 'undefined') {
			for (var i = 0, len = my_videos.length; i < len; i++) {
				var p = new Video(my_videos[i], _canvas);
				_videos.push(p);
			}
		}
	};

	this.setActive = function(my_active) {
		_active = my_active;
	};

	this.getActive = function() {
		return _active;
	};

	this.setOutro = function(my_outro) {
		_outro = my_outro;
	};

	this.getOutro = function() {
		return _outro;
	};

	this.getY = function() {
		return _y;
	};

	this.setY = function(my_y) {
		_y = my_y;
	};

	this.getFixed = function() {
		return _fixed;
	};

	this.getProps = function() {
		return _props;
	};

	this.getBackground = function() {
		return _background;
	};

	this.getVideos = function() {
		return _videos;
	};

	this.getTexts = function() {
		return _texts;
	};

	this.setFixed = function(my_fixed) {
		_fixed = my_fixed;
	};

	this.setDuration = function() {

		/*
		for (var i = 0, propsLen = _props.length; i < propsLen; i++) {
			if (_props[i].getEnd() > _duration)
				_duration = _props[i].getEnd();
		}

		for (var j = 0, videosLen = _videos.length; j < videosLen; j++) {
			if (_videos[j].getLength() > _duration)
				_duration = _videos[j].getLength();
		}*/
	};

	this.resize = function(my_canvas) {
		/*
		for (var i = 0, propsLen = _props.length; i < propsLen; i++) {
			if (_props[i].getEnd() > _duration)
				_duration = _props[i].getEnd();
		}
		*/

		for (var j = 0, videosLen = _videos.length; j < videosLen; j++) {
			_videos[j].resize(my_canvas);
		}
	};

	this.isLoaded = function() {
		return (_y === 0);
	};

	this.getDuration = function() {
		return _duration;
	};

	this.drawScene = function(my_direction) {
		if (my_direction) {
			_y += _speedY;
			_x += _speedX;
		} else {
			_y -= _speedY;
			_x -= _speedX;
		}
	};

	this.drawText = function(my_direction) {
		for (var i = 0, len = _texts.length; i < len; i++) {
			_texts[i].draw(my_direction);
		}
	};

	this.drawProps = function(my_direction) {
		for (var i = 0, len = _props.length; i < len; i++) {
			_props[i].draw(my_direction);
		}
	};

	this.playVideo = function(my_direction) {
		for (var i = 0, len = _videos.length; i < len; i++) {
			_videos[i].play(my_direction);
		}
	};

	this.resetProps = function(my_direction) {
		for (var i = 0, len = _props.length; i < len; i++) {
			_props[i].reset(my_direction, _duration);
		}
	};

	this.resetVideos = function(my_direction) {
		for (var i = 0, len = _videos.length; i < len; i++) {
			_videos[i].reset(my_direction);
		}
	};

	this.addProps(my_config.props);
	this.addVideos(my_config.videos);
	this.addText(my_config.text);
	this.setDuration();
}