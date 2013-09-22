(function (root, factory) {
	if (typeof exports === 'object') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else {
		root.annie = factory();
	}
}(this,function(){

	'use strict';

	var doc = document,
		nav = navigator,
		win = window,
		annie = {};


	// internet explorer version (or `undefined` if not ie)
	annie.ie = nav.appVersion.search('MSIE') > -1
		? parseInt(nav.appVersion.slice(22,26), 10)
		: false;


	// window.performance support for more accurate animation timing
	annie.performance = !!(win.performance && win.performance.now);


	// browser vendor (for css/js property prefixing)
	annie.vendor = (function(){

		if (annie.ie && annie.ie < 9) {
			return 'ms';
		}

		var prefixes = ' O ms Moz Webkit'.split(' '),
			style = doc.body.style,
			n,
			prefix,
			property;

		for (n = prefixes.length; n--;) {

			prefix = prefixes[n];
			property = prefix !== '' ? prefix + 'Transform' : 'transform';

			if (style[property] !== void 0) {
				return prefix;
			}
		}

	})();


	// requestAnimationFrame (fallback to `setTimeout` polyfill)
	annie.requestAnimationFrame = bind(
			win.requestAnimationFrame
			|| win[annie.vendor + 'RequestAnimationFrame']
			|| (function(){
				var lastTime = 0;
				return function (callback) {
					var currTime = +new Date();
					var timeToCall = Math.max(0, 16 - (currTime - lastTime));
					var id = setTimeout(function(){ callback(currTime+timeToCall) }, timeToCall);
					lastTime = currTime + timeToCall;
					return id;
				}
			})()
		, win);


	// cancelAnimationFrame
	annie.cancelAnimationFrame = bind(
			win.cancelAnimationFrame
			|| win.cancelRequestAnimationFrame
			|| win[annie.vendor + 'CancelAnimationFrame']
			|| win[annie.vendor + 'CancelRequestAnimationFrame']
			|| clearTimeout
		, win);


	// CSS3 transform
	annie.transform = (function() {
		
		var property = annie.vendor + 'Transform';

		if (doc.body.style[property] !== void 0) {
			return property;
		}

	})();


	// 3d animation support flag
	// based on stackoverflow.com/questions/5661671/detecting-transform-translate3d-support/12621264#12621264
	annie['3d'] = (function(){

		var transform = annie.transform;

		if (!transform) {
			return false;
		}

		var body = doc.body,
			element = doc.createElement('p');

		element.style[transform] = 'translate3d(1px,1px,1px)';
		body.appendChild(element);
		var has3d = getCompStyle(element, transform);
		body.removeChild(element);

		return has3d !== void 0 && has3d !== 'none' && has3d.length > 0;

	})();



	// export
	return annie;



	// helpers
	function bind (fn, context) {
		return function() {
			fn.apply(context, [].slice.call(arguments));
		}
	}
	function getCompStyle (element, property) {
		return (element.currentStyle || getComputedStyle(element))[property];
	}



}));