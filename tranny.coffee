
# UMD (play nice with AMD, CommonJS, globals)
umd = (factory) ->
	if typeof exports is 'object'
		module.exports = factory
	else if typeof define is 'function' and define.amd
		define([], factory)
	else
		@Tranny = factory

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
			perspective: 0
			rotate:
				x: 0
				y: 0
				z: 0
				a: 0
			scale:
				x: 1
				y: 1
				z: 1
			skew:
				x: 0
				y: 0
			translate:
				x: 0
				y: 0
				z: 0

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

		data = @_data
		matrix = data.matrix
		transformations = data.transformations

		# perspective
		perspective = transformations.perspective
		matrix[2][3] = if perspective then -1/perspective else 0

		# translate
		translate = transformations.translate
		matrix[3][0] = translate.x
		matrix[3][1] = translate.y
		matrix[3][2] = translate.z

		# rotate (see http://inside.mines.edu/~gmurray/ArbitraryAxisRotation/, section 5.1)
		rotate = transformations.rotate
		u = rotate.x
		v = rotate.y
		w = rotate.z
		a = rotate.a

		if u or v or w or a
			s = u*u + v*v + w*w
			c = Math.cos a
			n = Math.sin(a)
			i = 1 - c
			rs = Math.sqrt(s)*n
			matrix[0][0] = (u*u + (v*v + w*w)*c)/s
			matrix[1][0] = (u*v*i - w*rs)/s
			matrix[2][0] = (u*w*i + v*rs)/s
			matrix[0][1] = (u*v*i + w*rs)/s
			matrix[1][1] = (v*v + (u*u + w*w)*c)/s
			matrix[2][1] = (v*w*i - u*rs)/s
			matrix[0][2] = (u*w*i - v*rs)/s
			matrix[1][2] = (v*w*i + u*rs)/s
			matrix[2][2] = (w*w + (u*u + v*v)*c)/s

			# dot with transform
			matrix[3][0] *= c - n
			matrix[3][1] *= c + n

		# skew
		skew = transformations.skew

		if skew.x
			sx = Math.tan skew.x
			matrix[3][0] += translate.y*sx

		if skew.y
			sy = Math.tan skew.y
			matrix[0][1] *= sy
			matrix[3][1] += translate.x*sy

		# scale
		scale = transformations.scale
		matrix[0][0] *= scale.x
		matrix[1][1] *= scale.y
		matrix[2][2] *= scale.z

		# return
		matrix

	rotate: (a) -> @rotateZ a
	rotateX: (a) -> @rotate3d 1, 0, 0, a
	rotateY: (a) -> @rotate3d 0, 1, 0, a
	rotateZ: (a) -> @rotate3d 0, 0, 1, a
	scale: (x, y) -> @scale3d x, y
	scaleX: (x) -> @scale3d x
	scaleY: fluent (y = 1) -> @_data.transformations.scale.y = y
	scaleZ: fluent (z = 1) -> @_data.transformations.scale.z = z
	skewX: (x) -> @skew x
	skewY: fluent (y = 0) -> @_data.transformations.skew.y = y
	translate: (x, y) -> @translate3d x, y
	translateX: (x) -> @translate3d x
	translateY: fluent (y = 0) -> @_data.transformations.translate.y = y
	translateZ: fluent (z = 0) -> @_data.transformations.translate.z = z

	perspective: fluent (x = 0) ->

		#DEV
		if not (x < Infinity)
			throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
		#END DEV

		@_data.transformations.perspective = x

	rotate3d: fluent (x = 0, y = 0, z = 0, a = 0) ->

		#DEV
		if not (x < Infinity)
			throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
		if not (y < Infinity)
			throw new TypeError 'expected parameter `y` to be a Number, but was given a ' + typeof y
		if not (z < Infinity)
			throw new TypeError 'expected parameter `z` to be a Number, but was given a ' + typeof z
		#END DEV

		console.log a, rad a

		# if angle was passed as a string, convert it to a float first
		a = rad a

		@_data.transformations.rotate =
			x: x
			y: y
			z: z
			a: a

	scale3d: fluent (x = 1, y = 1, z = 1) ->

		#DEV
		if not (x < Infinity)
			throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
		if not (y < Infinity)
			throw new TypeError 'expected parameter `y` to be a Number, but was given a ' + typeof y
		if not (z < Infinity)
			throw new TypeError 'expected parameter `z` to be a Number, but was given a ' + typeof z
		#END DEV

		@_data.transformations.scale =
			x: x
			y: y
			z: z

	skew: fluent (x = 0, y = 0) ->

		x = rad x
		y = rad y

		@_data.transformations.skew =
			x: x
			y: y

	translate3d: fluent (x = 0, y = 0, z = 0) ->

		#DEV
		if not (x < Infinity)
			throw new TypeError 'expected parameter `x` to be a Number, but was given a ' + typeof x
		if not (y < Infinity)
			throw new TypeError 'expected parameter `y` to be a Number, but was given a ' + typeof y
		if not (z < Infinity)
			throw new TypeError 'expected parameter `z` to be a Number, but was given a ' + typeof z
		#END DEV

		@_data.transformations.translate =
			x: x
			y: y
			z: z

# export!
umd Matrix