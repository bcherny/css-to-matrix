(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define('matrix-utilities', [], factory);
    }
    else {
        root['matrix-utilities'] = factory();
    }
}(this, function() {
var matrixutilities;

matrixutilities = (function() {
  var util;
  return util = {
    add: function(one, two) {
      var i, j, result, row, value, _i, _j, _len, _len1;
      if (one.length !== two.length) {
        throw new Error('Matrix y dimensions do not match');
      }
      result = [];
      for (i = _i = 0, _len = one.length; _i < _len; i = ++_i) {
        row = one[i];
        if (row.length !== two[i].length) {
          throw new Error("Matrix x dimensions do not match on row " + (i + 1));
        }
        result[i] = [];
        for (j = _j = 0, _len1 = row.length; _j < _len1; j = ++_j) {
          value = row[j];
          result[i][j] = value + two[i][j];
        }
      }
      return result;
    },
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
  };
})();

    return matrixutilities;
}));
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

(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define('umodel', [], factory);
    }
    else {
        root.umodel = factory();
    }
}(this, function() {
var umodel, _,
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

umodel = (function() {
  function umodel(_data, options) {
    this._data = _data != null ? _data : {};
    this.options = {
      separator: '/'
    };
    if (options) {
      _.extend(this.options, options);
    }
    this.events = {};
  }

  umodel.prototype.get = function(key) {
    this.trigger('get', key);
    return this._get(this._split(key), this._data);
  };

  umodel.prototype.set = function(key, value) {
    var old;
    old = this._get(this._split(key), this._data);
    this._set(this._split(key), value, false, this._data);
    return this.trigger('set', key, value, old);
  };

  umodel.prototype.setnx = function(key, value) {
    var old;
    old = this._get(this._split(key), this._data);
    this._set(this._split(key), value, true, this._data);
    return this.trigger('setnx', key, value, old);
  };

  umodel.prototype.on = function(eventAndProperty, fn) {
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

  umodel.prototype.trigger = function(event, path, value, oldValue) {
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
              if (oldValue != null) {
                _results1.push(fn.call(this, path, value, oldValue));
              } else {
                _results1.push(fn.call(this, path, value));
              }
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

  umodel.prototype._get = function(key, parent, accumulator) {
    var head;
    if (accumulator == null) {
      accumulator = [];
    }
    head = key.shift();
    if (head) {
      if (!(head in parent)) {
        return void 0;
      }
      accumulator.push(head);
      return this._get(key, parent[head], accumulator);
    }
    return parent;
  };

  umodel.prototype._set = function(key, value, nx, parent, accumulator) {
    var head;
    if (nx == null) {
      nx = false;
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

  umodel.prototype._on = function(eventAndProperty, fn) {
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

  umodel.prototype._normalize = function(key) {
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

  umodel.prototype._split = function(key) {
    return (this._normalize(key)).split(this.options.separator);
  };

  return umodel;

})();

    return umodel;
}));

var _ = {

  // convert strings like "55deg" or ".75rad" to floats (in radians)
  rad: function (string) {

    if (typeof string === 'string') {

      var angle = parseFloat(string, 10),
          isDegrees = string.indexOf('deg') > -1

      // convert deg -> rad?
      if (isDegrees) angle *= Math.PI / 180 

      return angle

    }
    
    return string

  },

  // shallow object extend
  extend: function (a, b) {

    for (var key in b) {
      a[key] = b[key]
    }
    
    return a

  },

  // make functions return `this`, for easy chaining
  fluent: function (fn) {

    return function() {
      fn.apply(this, arguments)
      return this
    }

  },

  isNumber: function (a) {
    return typeof a === 'number'
  }

};

function CssToMatrix (data) {

  // default options
  this.model = new umodel({
    matrix: new matrixUtilities.Identity(),
    transformations: {
      perspective: new matrixUtilities.Identity(),
      rotate: new matrixUtilities.Identity(),
      scale: new matrixUtilities.Identity(),
      skew: new matrixUtilities.Identity(),
      translate: new matrixUtilities.Identity()
    }
  })

  // set data?
  if (data) {
    this.matrix(data)
  }

}

_.extend(CssToMatrix.prototype, {

  // set matrix in model
  matrix: function (data) {

////DEV
    if (data.length == null)
      throw new TypeError('expected parameter `data` to be an Array, but was given a ' + typeof data)

    var rows = data.length,
        columns = rows > 0 ? rows : 0

    if (rows !== 4 || columns !== 4)
      throw new Error('expected parameter `data` to be a 4x4 matrix of arrays, but was given a ' + rows + 'x' + columns + ' matrix')
////END DEV

    this.model.set('matrix', data)

  },

  // apply transformations as defined in the model, and get back get calculated matrix
  getMatrix: function() {

    var matrix = this.model.get('matrix'),
        t = this.model.get('transformations')

    // perspective
    matrix = matrixUtilities.multiply(matrix, t.perspective)

    // translate
    matrix = matrixUtilities.multiply(matrix, t.translate)

    // rotate
    matrix = matrixUtilities.multiply(matrix, t.rotate)

    // skew
    matrix = matrixUtilities.multiply(matrix, t.skew)

    // scale
    matrix = matrixUtilities.multiply(matrix, t.scale)

    return matrixUtilities.flip(matrix)

  },

  // get matrix formatted as a string that can be plugged right into CSS's `transform` function 
  getMatrixCSS: function() {

    return 'matrix3d('
      + this
        .getMatrix()
        .reduce(function (flat, row) {
          flat.push.apply(flat, row)
          return flat
        }, [])
        .join(',')
      + ')'

  },

  // transform functions
  // 1-to-1 with their CSS equivalents
  rotate: function (a) { return this.rotateZ(a) },
  rotateX: function (a) { return this.rotate3d(1, 0, 0, a) },
  rotateY: function (a) { return this.rotate3d(0, 1, 0, a) },
  rotateZ: function (a) { return this.rotate3d(0, 0, 1, a) },
  scale: function (x, y) { return this.scale3d(x, y) },
  scaleX: function (x) { return this.scale3d(x) },
  scaleY: function (y) { return this.scale3d(null, y) },
  scaleZ: function (z) { return this.scale3d(null, null, z) },
  skewX: function (x) { return this.skew(x) },
  skewY: function (y) { return this.skew(null, y) },
  translate: function (x, y) { return this.translate3d(x, y) },
  translateX: function (x) { return this.translate3d(x) },
  translateY: function (y) { return this.translate3d(null, y) },
  translateZ: function (z) { return this.translate3d(null, null, z) },

  perspective: _.fluent(function (x) {

    if (x == null) { x = 0 }

////DEV
    if (!_.isNumber(x))
      throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x)
////END DEV

    this.model.set('transformations/perspective', transformToMatrix.perspective(x))

  }),

  rotate3d: _.fluent(function (x, y, z, a) {

    if (x == null) { x = 0 }
    if (y == null) { y = 0 }
    if (z == null) { z = 0 }
    if (a == null) { a = 0 }

////DEV
    if (!_.isNumber(x))
      throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x)
    if (!_.isNumber(y))
      throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y)
    if (!_.isNumber(z))
      throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z)
////END DEV

    // if angle was passed as a string, convert it to a float first
    this.model.set('transformations/rotate', transformToMatrix.rotate3d(x, y, z, _.rad(a)))

  }),

  scale3d: _.fluent(function (x, y, z) {

    if (x == null) { x = 1 }
    if (y == null) { y = 1 }
    if (z == null) { z = 1 }

////DEV
    if (!_.isNumber(x))
      throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x)
    if (!_.isNumber(y))
      throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y)
    if (!_.isNumber(z))
      throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z)
////END DEV

    this.model.set('transformations/scale', transformToMatrix.scale3d(x, y, z))

  }),

  skew: _.fluent(function (x, y) {

    if (x == null) { x = 0 }
    if (y == null) { y = 0 }

    this.model.set('transformations/skew', matrixUtilities.to3d(transformToMatrix.skew(_.rad(x), _.rad(y))))

  }),

  translate3d: _.fluent(function(x, y, z) {

    if (x == null) { x = 0 }
    if (y == null) { y = 0 }
    if (z == null) { z = 0 }

////DEV
    if (!_.isNumber(x))
      throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x)
    if (!_.isNumber(y))
      throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y)
    if (!_.isNumber(z))
      throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z)
////END DEV

    this.model.set('transformations/translate', transformToMatrix.translate3d(x, y, z))

  })

})