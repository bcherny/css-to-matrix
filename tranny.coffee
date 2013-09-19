
# UMD (play nice with AMD, CommonJS, globals)
umd = (factory) ->
	if typeof exports is 'object'
		module.exports = factory
	else if typeof define is 'function' and define.amd
		define([], factory)
	else
		@izzy = factory

# helper
extend = (a, b) ->
	for key of b
		a[key] = b[key]
	a

# matrix
Matrix = (data) ->
	@setData data

# methods
extend Matrix.prototype,

	_data: []
	_transformations:

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

	setData: (@_data) ->

	apply: ->

		data = @_data
		transformations = @_transformations

		# translate
		tx = transformations.translate.x
		ty = transformations.translate.y

		data[3][0] = tx
		data[3][1] = ty
		data[3][2] = transformations.translate.z

		# rotate (see http://inside.mines.edu/~gmurray/ArbitraryAxisRotation/)
		u = transformations.rotate.x
		v = transformations.rotate.y
		w = transformations.rotate.z
		a = transformations.rotate.a
		s = u*u + v*v + w*w
		c = Math.cos a
		i = 1 - c
		rs = Math.sqrt(s)*Math.sin(a)

		data[0][0] *= (u*u + (v*v + w*w)*c)/s
		data[1][0] *= (u*v*i - w*rs)/s
		data[2][0] *= (u*w*i + v*rs)/s
		data[0][1] *= (u*v*i + w*rs)/s
		data[1][1] *= (v*v + (u*u + w*w)*c)/s
		data[2][1] *= (v*w*i - u*rs)/s
		data[0][2] *= (u*w*i - v*rs)/s
		data[1][2] *= (v*w*i + u*rs)/s
		data[2][2] *= (w*w + (u*u + v*v)*c)/s

		# skew
		sx = Math.tan transformations.skew.x
		sy = Math.tan transformations.skew.y

		data[0][1] *= sy
		data[3][0] += ty*sx
		data[3][1] += tx*sy

		# scale



	rotate: (a) -> @rotateZ a
	rotateX: (a) -> @rotate3d 1, 0, 0, a
	rotateY: (a) -> @rotate3d 0, 1, 0, a
	rotateZ: (a) -> @rotate3d 0, 0, 1, a
	scale: (x, y) -> @scale3d x, y
	scaleX: (x) -> @scale3d x
	scaleY: (y) -> @scale3d 1, y
	scaleZ: (z) -> @scale3d 1, 1, z
	skewX: (x) -> @skew x
	skewY: (y) -> @skew 0, y

	rotate3d: (x = 0, y = 0, z = 0, a = 0) ->

		@_transformations.rotate =
			x: x
			y: y
			z: z
			a: a

	scale3d: (x = 1, y = 1, z = 1) ->

		@_transformations.scale =
			x: x
			y: y
			z: z

	skew: (x = 0, y = 0) ->

		@_transformations.skew =
			x: x
			y: y

# export!
umd Matrix