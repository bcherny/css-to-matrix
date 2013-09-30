
# UMD (play nice with AMD, CommonJS, globals)
umd = (factory) ->
	if typeof exports is 'object'
		module.exports = factory require('transform-to-matrix'), require('matrix-utilities')
	else if typeof define is 'function' and define.amd
		define ['transform-to-matrix', 'matrix-utilities'], factory
	else
		@Tranny = factory @['transform-to-matrix'], @['matrix-utilities']

# helpers
rad = (a) ->
	if not (a < Infinity)

		_a = parseFloat a, 10

		# convert deg -> rad?
		if a.indexOf 'deg' > -1
			_a *= Math.PI / 180

		a = _a
	a

copy = (array) ->
	array.slice()

extend = (a, b) ->
	for key of b
		a[key] = b[key]
	a

fluent = (fn) ->
	->
		fn.apply @, arguments
		@

# matrix
umd (toMatrix, util) ->

	Matrix = (data) ->
		
		if data then @setData data

	# methods
	extend Matrix.prototype,

		_data:
			matrix: [
				[1, 0, 0, 0],
				[0, 1, 0, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1]
			]
			transformations:
				perspective: new util.Identity
				rotate: new util.Identity
				scale: new util.Identity
				skew: new util.Identity
				translate: new util.Identity

		setData: (data) ->

			@_data.matrix = data

		matrix: (data) ->

			#DEV
			if data.length is undefined
				throw new TypeError 'expected parameter `data` to be an Array, but was given a ' + typeof data

			rows = data.length
			columns = if rows[0] then rows[0].length else 0

			if rows isnt 4 or columns isnt 4
				throw new Error 'expected parameter `data` to be a 4x4 matrix of arrays, but was given a ' + rows + 'x' + columns + ' matrix'
			#END DEV

			@setData data

		getMatrix: ->

			@apply()

		getMatrixCSS: ->

			matrix = @apply()
			css = []

			for row in matrix
				for field in row
					css.push field

			# return
			'matrix3d(' + css.join(',') + ')'

		apply: ->

			matrix = new util.Identity
			t = @_data.transformations

			console.log t

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

		perspective: fluent (x = 0) ->

			#DEV
			if not (x < Infinity)
				throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
			#END DEV

			@_data.transformations.perspective = toMatrix.perspective x

		rotate3d: fluent (x = 0, y = 0, z = 0, a = 0) ->

			#DEV
			if not (x < Infinity)
				throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
			if not (y < Infinity)
				throw new TypeError 'expected parameter `y` to be a Number, but was given a ' + typeof y
			if not (z < Infinity)
				throw new TypeError 'expected parameter `z` to be a Number, but was given a ' + typeof z
			#END DEV

			# if angle was passed as a string, convert it to a float first
			a = rad a

			@_data.transformations.rotate = toMatrix.rotate3d x, y, z, a

		scale3d: fluent (x = 1, y = 1, z = 1) ->

			#DEV
			if not (x < Infinity)
				throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
			if not (y < Infinity)
				throw new TypeError 'expected parameter `y` to be a Number, but was given a ' + typeof y
			if not (z < Infinity)
				throw new TypeError 'expected parameter `z` to be a Number, but was given a ' + typeof z
			#END DEV

			@_data.transformations.scale = toMatrix.scale3d x, y, z

		skew: fluent (x, y) ->

			@_data.transformations.skew = util.to3d toMatrix.skew(rad x, rad y)

		translate3d: fluent (x = 0, y = 0, z = 0) ->

			#DEV
			if not (x < Infinity)
				throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
			if not (y < Infinity)
				throw new TypeError 'expected parameter `y` to be a Number, but was given a ' + typeof y
			if not (z < Infinity)
				throw new TypeError 'expected parameter `z` to be a Number, but was given a ' + typeof z
			#END DEV

			@_data.transformations.translate = toMatrix.translate3d x, y, z

	# return
	Matrix