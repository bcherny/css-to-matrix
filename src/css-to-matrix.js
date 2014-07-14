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