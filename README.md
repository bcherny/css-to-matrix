# tranny

*Pre-alpha - not yet functional*

A little library for converting compound CSS transforms into their matrix equivalents.

## usage

```coffee

# using the default matrix
new Tranny

# or using a custom 4x4 matrix (meaning some transformation/s are already applied)
matrix = [
	[1, 2, 3, 4],
	[5, 6, 7, 8],
	[9, 0, 1, 2],
	[3, 4, 5, 6]
]
new Tranny matrix

```

## example

```coffee
tranny = new Tranny

tranny

# parse a CSS string
.parse 'skew(1.5rad) scale(0.5, 0.7)'

# set some transforms
.rotate '90deg'
.translate3d 50, 100, 200

# get a matrix back
tranny.getMatrix()

###
	[
		[9.870993963020204, 0.7, 0, 0],
		[-0.5, 0, 0, 0],
		[0, 0, 1, 0],
		[443.54969815101026, 35, 200, 1]
	]
###

# .. or as a CSS property
tranny.getMatrixCSS()

###
	"matrix3d(9.870993963020204, 0.7, 0, 0, -0.5, 0, 0, 0, 0, 0, 1, 0, 443.54969815101026, 35, 200, 1)"
###
```

## supported transforms

- perspective
- rotate
- rotateX
- rotateY
- rotateZ
- rotate3d
- scale
- scaleX
- scaleY
- scaleZ
- scale3d
- skew
- skewX
- skewY
- translate
- translateX
- translateY
- translateZ
- translate3d

## see also

- http://www.w3.org/TR/css3-transforms/#transform-functions
- http://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined
- http://dev.opera.com/articles/view/understanding-the-css-transforms-matrix/
- http://dev.opera.com/articles/view/understanding-3d-transforms/
- http://inside.mines.edu/~gmurray/ArbitraryAxisRotation/
- http://stackoverflow.com/a/15208858/435124
- http://desandro.github.io/3dtransforms/docs/perspective.html