
# UMD (play nice with AMD, CommonJS, globals)
umd = (factory) ->
	if typeof exports is 'object'
		module.exports = factory
	else if typeof define is 'function' and define.amd
		define([], factory)
	else
		@izzy = factory

# helpers
copy = (array) ->
	array.slice()

extend = (a, b) ->
	for key of b
		a[key] = b[key]
	a

# default, untransformed matrix
defaultMatrix = [
	[1, 0, 0, 0],
	[0, 1, 0, 0],
	[0, 0, 1, 0],
	[0, 0, 0, 1]
]

# matrix
Matrix = (data) ->
	@setData data

# methods
extend Matrix.prototype,

	_data:
		matrix: copy defaultMatrix
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

	setData: (@_data) ->

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

		# rotate (see http://inside.mines.edu/~gmurray/ArbitraryAxisRotation/)
		rotate = transformations.rotate
		u = rotate.x
		v = rotate.y
		w = rotate.z
		a = rotate.a
		s = u*u + v*v + w*w
		c = Math.cos a
		i = 1 - c
		rs = Math.sqrt(s)*Math.sin(a)
		matrix[0][0] *= (u*u + (v*v + w*w)*c)/s
		matrix[1][0] *= (u*v*i - w*rs)/s
		matrix[2][0] *= (u*w*i + v*rs)/s
		matrix[0][1] *= (u*v*i + w*rs)/s
		matrix[1][1] *= (v*v + (u*u + w*w)*c)/s
		matrix[2][1] *= (v*w*i - u*rs)/s
		matrix[0][2] *= (u*w*i - v*rs)/s
		matrix[1][2] *= (v*w*i + u*rs)/s
		matrix[2][2] *= (w*w + (u*u + v*v)*c)/s

		# skew
		skew = transformations.skew
		sx = Math.tan skew.x
		sy = Math.tan skew.y
		matrix[0][1] *= sy
		matrix[3][0] += translate.y*sx
		matrix[3][1] += translate.x*sy

		# scale
		scale = transformations.scale
		matrix[0][0] *= scale.x
		matrix[1][1] *= scale.y
		matrix[2][2] *= scale.z

	rotate: (a) -> @rotateZ a
	rotateX: (a) -> @rotate3d 1, 0, 0, a
	rotateY: (a) -> @rotate3d 0, 1, 0, a
	rotateZ: (a) -> @rotate3d 0, 0, 1, a
	scale: (x, y) -> @scale3d x, y
	scaleX: (x) -> @scale3d x
	scaleY: (y = 1) -> @_data.transformations.scale.y = y
	scaleZ: (z = 1) -> @_data.transformations.scale.z = z
	skewX: (x) -> @skew x
	skewY: (y = 0) -> @_data.transformations.skew.y = y
	translate: (x, y) -> @translate3d x, y
	translateX: (x) -> @translate3d x
	translateY: (y = 0) -> @_data.transformations.translate.y = y
	translateZ: (z = 0) -> @_data.transformations.translate.z = z

	perspective: (x = 0) ->

		@_data.transformations.perspective = x

	rotate3d: (x = 0, y = 0, z = 0, a = 0) ->

		@_data.transformations.rotate =
			x: x
			y: y
			z: z
			a: a

	scale3d: (x = 1, y = 1, z = 1) ->

		@_data.transformations.scale =
			x: x
			y: y
			z: z

	skew: (x = 0, y = 0) ->

		@_data.transformations.skew =
			x: x
			y: y

	translate3d: (x = 0, y = 0, z = 0) ->

		@_data.transformations.translate =
			x: x
			y: y
			z: z

# export!
umd Matrix