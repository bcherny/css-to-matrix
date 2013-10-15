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


	// requestAnimationFrame (fallback to `setTimeout` anniefill)
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
(function() {
  var umd;

  umd = function(factory) {
    if (typeof exports === 'object') {
      return module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else {
      return this['matrix-utilities'] = factory;
    }
  };

  umd({
    multiply: function(one, two) {
      var j, k, l, result, row, size, sum, value, _i, _j, _len, _len1;
      if (one[0].length !== two.length) {
        throw new Error('Matrix 1\'s row count should equal matrix 2\'s column count');
      }
      size = one[0].length;
      result = [];
      for (j = _i = 0, _len = two.length; _i < _len; j = ++_i) {
        row = two[j];
        result[j] = [];
        for (k = _j = 0, _len1 = row.length; _j < _len1; k = ++_j) {
          value = row[k];
          l = size;
          sum = 0;
          while (l--) {
            sum += one[j][l] * two[l][k];
          }
          result[j][k] = sum;
        }
      }
      return result;
    },
    flip: function(matrix) {
      var j, k, result, row, value, _i, _j, _len, _len1;
      result = [];
      for (j = _i = 0, _len = matrix.length; _i < _len; j = ++_i) {
        row = matrix[j];
        for (k = _j = 0, _len1 = row.length; _j < _len1; k = ++_j) {
          value = row[k];
          (result[k] || (result[k] = []))[j] = value;
        }
      }
      return result;
    },
    to2d: function(matrix) {
      return [[matrix[0][0] || 1, matrix[0][1] || 0, matrix[0][3] || 0], [matrix[1][0] || 0, matrix[1][1] || 1, matrix[1][3] || 0]];
    },
    to3d: function(matrix) {
      return [[matrix[0][0] || 1, matrix[0][1] || 0, 0, matrix[0][2] || 0], [matrix[1][0] || 0, matrix[1][1] || 1, 0, matrix[1][2] || 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    },
    Identity: function() {
      return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    }
  });

}).call(this);

(function() {
  var fns, umd;

  umd = function(factory) {
    if (typeof exports === 'object') {
      return module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else {
      return this['transform-to-matrix'] = factory;
    }
  };

  fns = {
    perspective: function(d) {
      return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, -1 / d, 1]];
    },
    rotate: function(a) {
      return fns.rotateZ(a);
    },
    rotateX: function(a) {
      return fns.rotate3d(1, 0, 0, a);
    },
    rotateY: function(a) {
      return fns.rotate3d(0, 1, 0, a);
    },
    rotateZ: function(a) {
      var c, n;
      c = Math.cos(a);
      n = Math.sin(a);
      return [[c, -n, 0], [n, c, 0]];
    },
    rotate3d: function(x, y, z, a) {
      var c, i, n, rs, s;
      s = x * x + y * y + z * z;
      c = Math.cos(a);
      n = Math.sin(a);
      i = 1 - c;
      rs = Math.sqrt(s) * n;
      return [[(x * x + (y * y + z * z) * c) / s, (x * y * i - z * rs) / s, (x * z * i + y * rs) / s, 0], [(x * y * i + z * rs) / s, (y * y + (x * x + z * z) * c) / s, (y * z * i - x * rs) / s, 0], [(x * z * i - y * rs) / s, (y * z * i + x * rs) / s, (z * z + (x * x + y * y) * c) / s, 0], [0, 0, 0, 1]];
    },
    scale: function(x, y) {
      return [[x, 0, 0], [0, y, 0]];
    },
    scaleX: function(x) {
      return fns.scale(x, 1);
    },
    scaleY: function(y) {
      return fns.scale(1, y);
    },
    scaleZ: function(z) {
      return fns.scale3d(1, 1, z);
    },
    scale3d: function(x, y, z) {
      return [[x, 0, 0, 0], [0, y, 0, 0], [0, 0, z, 0], [0, 0, 0, 1]];
    },
    skew: function(x, y) {
      return [[1, Math.tan(x), 0], [Math.tan(y), 1, 0]];
    },
    skewX: function(x) {
      return [[1, Math.tan(x), 0], [0, 1, 0]];
    },
    skewY: function(y) {
      return [[1, 0, 0], [Math.tan(y), 1, 0]];
    },
    translate: function(x, y) {
      return [[1, 0, x], [0, 1, y]];
    },
    translateX: function(x) {
      return fns.translate(x, 0);
    },
    translateY: function(y) {
      return fns.translate(0, y);
    },
    translateZ: function(z) {
      return fns.translate3d(0, 0, z);
    },
    translate3d: function(x, y, z) {
      return [[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]];
    }
  };

  umd(fns);

}).call(this);

// Generated by CoffeeScript 1.6.3
(function() {
  var Model, umd, _,
    __hasProp = {}.hasOwnProperty;

  _ = {
    extend: function(a, b) {
      var key;
      for (key in b) {
        if (!__hasProp.call(b, key)) continue;
        a[key] = b[key];
      }
      return a;
    },
    trim: (function() {
      var head, tail;
      if (''.trim) {
        return function(string) {
          return string.trim();
        };
      } else {
        head = /^\s\s*/;
        tail = /\s\s*$/;
        return function(string) {
          return string.replace(head, '').replace(tail, '');
        };
      }
    })()
  };

  Model = (function() {
    function Model(_data, options) {
      this._data = _data != null ? _data : {};
      this.options = {
        separator: '/'
      };
      if (options) {
        _.extend(this.options, options);
      }
      this.events = {};
    }

    Model.prototype.get = function(key) {
      this.trigger('get', key);
      return this._get(this._split(key));
    };

    Model.prototype.set = function(key, value) {
      this.trigger('set', key, value);
      return this._set(this._split(key), value);
    };

    Model.prototype.setnx = function(key, value) {
      this.trigger('setnx', key, value);
      return this._set(this._split(key), value, true);
    };

    Model.prototype.on = function(eventAndProperty, fn) {
      var e, _results;
      if (fn) {
        return this._on(eventAndProperty, fn);
      } else {
        _results = [];
        for (e in eventAndProperty) {
          fn = eventAndProperty[e];
          _results.push(this._on(e, fn));
        }
        return _results;
      }
    };

    Model.prototype.trigger = function(event, path, value) {
      var e, fn, fns, _ref, _results;
      if (path == null) {
        path = '*';
      }
      path = this._normalize(path);
      if (event in this.events) {
        _ref = this.events[event];
        _results = [];
        for (e in _ref) {
          fns = _ref[e];
          if (e === '*' || (path + '/').indexOf(e + '/') === 0) {
            _results.push((function() {
              var _i, _len, _results1;
              _results1 = [];
              for (_i = 0, _len = fns.length; _i < _len; _i++) {
                fn = fns[_i];
                _results1.push(fn.call(this, path, value, this));
              }
              return _results1;
            }).call(this));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Model.prototype._get = function(key, parent, accumulator) {
      var head;
      if (parent == null) {
        parent = this._data;
      }
      if (accumulator == null) {
        accumulator = [];
      }
      head = key.shift();
      if (head) {
        if (!(head in parent)) {
          throw new Error('get: key "' + head + '" does not exist in "' + accumulator.join('/') + '"');
        }
        accumulator.push(head);
        return this._get(key, parent[head], accumulator);
      }
      return parent;
    };

    Model.prototype._set = function(key, value, nx, parent, accumulator) {
      var head;
      if (nx == null) {
        nx = false;
      }
      if (parent == null) {
        parent = this._data;
      }
      if (accumulator == null) {
        accumulator = [];
      }
      head = key.shift();
      if (key.length) {
        if (!(head in parent)) {
          parent[head] = {};
        }
        accumulator.push(head);
        return this._set(key, value, nx, parent[head], accumulator);
      }
      if (!(nx && head in parent)) {
        return parent[head] = value;
      }
    };

    Model.prototype._on = function(eventAndProperty, fn) {
      var event, events, parts, property, _i, _len, _results;
      parts = eventAndProperty.split(':');
      events = parts[0].split(' ');
      property = this._normalize(parts[1] || '*');
      _results = [];
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        event = events[_i];
        event = _.trim(event);
        if (!(event in this.events)) {
          this.events[event] = {};
        }
        if (!(property in this.events[event])) {
          this.events[event][property] = [];
        }
        _results.push(this.events[event][property].push(fn));
      }
      return _results;
    };

    Model.prototype._normalize = function(key) {
      var separator;
      separator = this.options.separator;
      key = _.trim(key);
      if (key.charAt(0) === separator) {
        key = key.slice(1);
      }
      if (key.charAt(key.length - 1) === separator) {
        key = key.slice(0, -1);
      }
      return key;
    };

    Model.prototype._split = function(key) {
      return (this._normalize(key)).split(this.options.separator);
    };

    return Model;

  })();

  umd = function(name, factory) {
    if (typeof exports === 'object') {
      return module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
      return define(name, [], function() {
        return factory;
      });
    } else {
      return this[name] = factory;
    }
  };

  umd('umodel', Model);

}).call(this);

// Generated by CoffeeScript 1.6.3
(function() {
  var Tranny, umd, umodel, _,
    __hasProp = {}.hasOwnProperty;

  umodel = require('umodel');

  _ = {
    rad: function(string) {
      var angle, isDegrees;
      if (typeof string === 'string') {
        angle = parseFloat(string, 10);
        isDegrees = string.indexOf('deg' > -1);
        if (isDegrees) {
          angle *= Math.PI / 180;
        }
        string = angle;
      }
      return string;
    },
    copy: function(array) {
      return array.slice();
    },
    extend: function(a, b) {
      var key;
      for (key in b) {
        if (!__hasProp.call(b, key)) continue;
        a[key] = b[key];
      }
      return a;
    },
    fluent: function(fn) {
      return function() {
        fn.apply(this, arguments);
        return this;
      };
    }
  };

  Tranny = function(toMatrix, util) {
    var Matrix;
    return Matrix = (function() {
      function Matrix(data) {
        if (data) {
          this.matrix(data);
        }
      }

      Matrix.prototype.model = new umodel({
        matrix: new util.Identity,
        transformations: {
          perspective: new util.Identity,
          rotate: new util.Identity,
          scale: new util.Identity,
          skew: new util.Identity,
          translate: new util.Identity
        }
      });

      Matrix.prototype.matrix = function(data) {
        var columns, rows;
        rows = data.length;
        columns = rows[0] ? rows[0].length : 0;
        if (rows !== 4 || columns !== 4) {
          throw new Error('expected parameter `data` to be a 4x4 matrix of arrays, but was given a ' + rows + 'x' + columns + ' matrix');
        }
        return this.model.set('matrix', data);
      };

      Matrix.prototype.getMatrix = function() {
        return this.apply();
      };

      Matrix.prototype.getMatrixCSS = function() {
        var css, field, matrix, row, _i, _j, _len, _len1;
        matrix = this.apply();
        css = [];
        for (_i = 0, _len = matrix.length; _i < _len; _i++) {
          row = matrix[_i];
          for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
            field = row[_j];
            css.push(field);
          }
        }
        return 'matrix3d(' + css.join(',') + ')';
      };

      Matrix.prototype.apply = function() {
        var matrix, t;
        matrix = this.model.get('matrix');
        t = this.model.get('transformations');
        matrix = util.multiply(matrix, t.perspective);
        matrix = util.multiply(matrix, t.translate);
        matrix = util.multiply(matrix, t.rotate);
        matrix = util.multiply(matrix, t.skew);
        matrix = util.multiply(matrix, t.scale);
        return util.flip(matrix);
      };

      Matrix.prototype.rotate = function(a) {
        return this.rotateZ(a);
      };

      Matrix.prototype.rotateX = function(a) {
        return this.rotate3d(1, 0, 0, a);
      };

      Matrix.prototype.rotateY = function(a) {
        return this.rotate3d(0, 1, 0, a);
      };

      Matrix.prototype.rotateZ = function(a) {
        return this.rotate3d(0, 0, 1, a);
      };

      Matrix.prototype.scale = function(x, y) {
        return this.scale3d(x, y);
      };

      Matrix.prototype.scaleX = function(x) {
        return this.scale3d(x);
      };

      Matrix.prototype.scaleY = function(y) {
        if (y == null) {
          y = 1;
        }
        return this.scale3d(null, y);
      };

      Matrix.prototype.scaleZ = function(z) {
        if (z == null) {
          z = 1;
        }
        return this.scale3d(null, null, z);
      };

      Matrix.prototype.skewX = function(x) {
        return this.skew(x);
      };

      Matrix.prototype.skewY = function(y) {
        return this.skew(null, y);
      };

      Matrix.prototype.translate = function(x, y) {
        return this.translate3d(x, y);
      };

      Matrix.prototype.translateX = function(x) {
        return this.translate3d(x);
      };

      Matrix.prototype.translateY = function(y) {
        if (y == null) {
          y = 0;
        }
        return this.translate3d(null, y);
      };

      Matrix.prototype.translateZ = function(z) {
        if (z == null) {
          z = 0;
        }
        return this.translate3d(null, null, z);
      };

      Matrix.prototype.perspective = _.fluent(function(x) {
        if (x == null) {
          x = 0;
        }
        return this.model.set('transformations/perspective', toMatrix.perspective(x));
      });

      Matrix.prototype.rotate3d = _.fluent(function(x, y, z, a) {
        if (x == null) {
          x = 0;
        }
        if (y == null) {
          y = 0;
        }
        if (z == null) {
          z = 0;
        }
        if (a == null) {
          a = 0;
        }
        return this.model.set('transformations/rotate', toMatrix.rotate3d(x, y, z, _.rad(a)));
      });

      Matrix.prototype.scale3d = _.fluent(function(x, y, z) {
        if (x == null) {
          x = 1;
        }
        if (y == null) {
          y = 1;
        }
        if (z == null) {
          z = 1;
        }
        return this.model.set('transformations/scale', toMatrix.scale3d(x, y, z));
      });

      Matrix.prototype.skew = _.fluent(function(x, y) {
        if (x == null) {
          x = 0;
        }
        if (y == null) {
          y = 0;
        }
        return this.model.set('transformations/skew', util.to3d(toMatrix.skew(_.rad(x), _.rad(y))));
      });

      Matrix.prototype.translate3d = _.fluent(function(x, y, z) {
        if (x == null) {
          x = 0;
        }
        if (y == null) {
          y = 0;
        }
        if (z == null) {
          z = 0;
        }
        return this.model.set('transformations/translate', toMatrix.translate3d(x, y, z));
      });

      return Matrix;

    })();
  };

  umd = function(name, factory) {
    if (typeof exports === 'object') {
      return module.exports = factory(require('transform-to-matrix'), require('matrix-utilities'), require('umodel'));
    } else if (typeof define === 'function' && define.amd) {
      return define(name, ['transform-to-matrix', 'matrix-utilities', 'umodel'], function(toMatrix, util, umodel) {
        return factory;
      });
    } else {
      return this[name] = factory(this['transform-to-matrix'], this['matrix-utilities'], this.umodel);
    }
  };

  umd('Tranny', Tranny);

}).call(this);
