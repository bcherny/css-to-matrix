// Generated by CoffeeScript 1.6.3
(function() {
  var Tranny, umd, _,
    __hasProp = {}.hasOwnProperty;

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
          this.setData(data);
        }
      }

      Matrix.prototype._data = {
        matrix: new util.Identity,
        transformations: {
          perspective: new util.Identity,
          rotate: new util.Identity,
          scale: new util.Identity,
          skew: new util.Identity,
          translate: new util.Identity
        }
      };

      Matrix.prototype.setData = function(data) {
        return this._data.matrix = data;
      };

      Matrix.prototype.matrix = function(data) {
        var columns, rows;
        if (data.length === void 0) {
          throw new TypeError('expected parameter `data` to be an Array, but was given a ' + typeof data);
        }
        rows = data.length;
        columns = rows[0] ? rows[0].length : 0;
        if (rows !== 4 || columns !== 4) {
          throw new Error('expected parameter `data` to be a 4x4 matrix of arrays, but was given a ' + rows + 'x' + columns + ' matrix');
        }
        return this.setData(data);
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
        matrix = new util.Identity;
        t = this._data.transformations;
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
        if (!(x < Infinity)) {
          throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
        }
        return this._data.transformations.perspective = toMatrix.perspective(x);
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
        if (!(x < Infinity)) {
          throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
        }
        if (!(y < Infinity)) {
          throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y);
        }
        if (!(z < Infinity)) {
          throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z);
        }
        a = _.rad(a);
        return this._data.transformations.rotate = toMatrix.rotate3d(x, y, z, a);
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
        if (!(x < Infinity)) {
          throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
        }
        if (!(y < Infinity)) {
          throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y);
        }
        if (!(z < Infinity)) {
          throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z);
        }
        return this._data.transformations.scale = toMatrix.scale3d(x, y, z);
      });

      Matrix.prototype.skew = _.fluent(function(x, y) {
        if (x == null) {
          x = 0;
        }
        if (y == null) {
          y = 0;
        }
        return this._data.transformations.skew = util.to3d(toMatrix.skew(_.rad(x), _.rad(y)));
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
        if (!(x < Infinity)) {
          throw new TypeError('expected parameter `x` to be a Number, but was given a ' + typeof x);
        }
        if (!(y < Infinity)) {
          throw new TypeError('expected parameter `y` to be a Number, but was given a ' + typeof y);
        }
        if (!(z < Infinity)) {
          throw new TypeError('expected parameter `z` to be a Number, but was given a ' + typeof z);
        }
        return this._data.transformations.translate = toMatrix.translate3d(x, y, z);
      });

      return Matrix;

    })();
  };

  umd = function(factory) {
    if (typeof exports === 'object') {
      return module.exports = factory(require('transform-to-matrix'), require('matrix-utilities'));
    } else if (typeof define === 'function' && define.amd) {
      return define('Tranny', ['transform-to-matrix', 'matrix-utilities'], factory);
    } else {
      return this.Tranny = factory(this['transform-to-matrix'], this['matrix-utilities']);
    }
  };

  umd(Tranny);

}).call(this);
