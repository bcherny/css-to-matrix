# Tranny

## dependencies

	umodel = require 'umodel'

## helpers

	_ =

### rad
convert strings like "55deg" or ".75rad" to floats (in radians)

		rad: (string) ->

			if typeof string is 'string'

				angle = parseFloat string, 10
				isDegrees = string.indexOf 'deg' > -1

				# convert deg -> rad?
				angle *= Math.PI / 180 if isDegrees

				string = angle
			
			string

### copy
copies arrays

		copy: (array) ->
			array.slice()

### extend
shallow object extend

		extend: (a, b) ->
			for own key of b
				a[key] = b[key]
			a

### fluent
make functions return `this`, for easy chaining

		fluent: (fn) ->
			->
				fn.apply @, arguments
				@
## tranny

	Tranny = (toMatrix, util) ->

		class Matrix

			constructor: (data) ->

set data?
			
				if data
					@matrix data

default options

			model: new umodel
				matrix: new util.Identity
				transformations:
					perspective: new util.Identity
					rotate: new util.Identity
					scale: new util.Identity
					skew: new util.Identity
					translate: new util.Identity

### matrix
set matrix in model

			matrix: (data) ->

####DEV
				if data.length is undefined
					throw new TypeError 'expected parameter `data` to be an Array, but was given a ' + typeof data

				rows = data.length
				columns = if rows[0] then rows[0].length else 0

				if rows isnt 4 or columns isnt 4
					throw new Error 'expected parameter `data` to be a 4x4 matrix of arrays, but was given a ' + rows + 'x' + columns + ' matrix'
####END DEV

				@model.set 'matrix', data

### getMatrix
get calculated matrix

			getMatrix: ->

				@apply()

### getMatrixCSS
get matrix formatted as a string that can be plugged right into CSS's `transform` function

			getMatrixCSS: ->

				matrix = @apply()
				css = []

				for row in matrix
					for field in row
						css.push field

				# return
				'matrix3d(' + css.join(',') + ')'

			apply: ->

				matrix = @model.get 'matrix'
				t = @model.get 'transformations'

				# perspective
				matrix = util.multiply matrix, t.perspective

				# translate
				matrix = util.multiply matrix, t.translate

				# rotate
				matrix = util.multiply matrix, t.rotate

				# skew
				matrix = util.multiply matrix, t.skew

				# scale
				matrix = util.multiply matrix, t.scale

				# return
				util.flip matrix

			rotate: (a) -> @rotateZ a
			rotateX: (a) -> @rotate3d 1, 0, 0, a
			rotateY: (a) -> @rotate3d 0, 1, 0, a
			rotateZ: (a) -> @rotate3d 0, 0, 1, a
			scale: (x, y) -> @scale3d x, y
			scaleX: (x) -> @scale3d x
			scaleY: (y = 1) -> @scale3d null, y
			scaleZ: (z = 1) -> @scale3d null, null, z
			skewX: (x) -> @skew x
			skewY: (y) -> @skew null, y
			translate: (x, y) -> @translate3d x, y
			translateX: (x) -> @translate3d x
			translateY: (y = 0) -> @translate3d null, y
			translateZ: (z = 0) -> @translate3d null, null, z

			perspective: _.fluent (x = 0) ->

####DEV
				if not (x < Infinity)
					throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
####END DEV

				@model.set 'transformations/perspective', toMatrix.perspective x

			rotate3d: _.fluent (x = 0, y = 0, z = 0, a = 0) ->

####DEV
				if not (x < Infinity)
					throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
				if not (y < Infinity)
					throw new TypeError 'expected parameter `y` to be a Number, but was given a ' + typeof y
				if not (z < Infinity)
					throw new TypeError 'expected parameter `z` to be a Number, but was given a ' + typeof z
####END DEV

if angle was passed as a string, convert it to a float first

				@model.set 'transformations/rotate', toMatrix.rotate3d x, y, z, _.rad(a)

			scale3d: _.fluent (x = 1, y = 1, z = 1) ->

				#DEV
				if not (x < Infinity)
					throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
				if not (y < Infinity)
					throw new TypeError 'expected parameter `y` to be a Number, but was given a ' + typeof y
				if not (z < Infinity)
					throw new TypeError 'expected parameter `z` to be a Number, but was given a ' + typeof z
				#END DEV

				@model.set 'transformations/scale', toMatrix.scale3d x, y, z

			skew: _.fluent (x = 0, y = 0) ->

				@model.set 'transformations/skew', util.to3d toMatrix.skew(_.rad(x), _.rad(y))

			translate3d: _.fluent (x = 0, y = 0, z = 0) ->

				#DEV
				if not (x < Infinity)
					throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
				if not (y < Infinity)
					throw new TypeError 'expected parameter `y` to be a Number, but was given a ' + typeof y
				if not (z < Infinity)
					throw new TypeError 'expected parameter `z` to be a Number, but was given a ' + typeof z
				#END DEV

				@model.set 'transformations/translate', toMatrix.translate3d x, y, z

	# UMD (play nice with AMD, CommonJS, globals)
	umd = (factory) ->

		if typeof exports is 'object'
			module.exports = factory require('transform-to-matrix'), require('matrix-utilities'), require('umodel')
		else if typeof define is 'function' and define.amd
			define 'Tranny', ['transform-to-matrix', 'matrix-utilities', 'umodel'], (toMatrix, util, umodel) -> factory
		else
			@Tranny = factory @['transform-to-matrix'], @['matrix-utilities'], @umodel

	umd Tranny