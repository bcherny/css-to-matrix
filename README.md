# css-to-matrix

A little library for converting compound CSS transforms into their matrix equivalents.

## usage

```coffee

# using the default matrix
new CssToMatrix

# or using a custom 4x4 matrix (meaning some transformations are already applied)
matrix = [
	[1, 2, 3, 4]
	[5, 6, 7, 8]
	[9, 0, 1, 2]
	[3, 4, 5, 6]
]
new CssToMatrix matrix

```

## example

```coffee
cssToMatrix = new CssToMatrix

cssToMatrix

# set some transforms
.rotate '90deg'
.translate3d 50, 100, 200

# get a matrix back
.getMatrix()


#=> [
#		[9.870993963020204, 0.7, 0, 0],
#		[-0.5, 0, 0, 0],
#		[0, 0, 1, 0],
#		[443.54969815101026, 35, 200, 1]
#	]

# .. or as a CSS property
cssToMatrix.getMatrixCSS()

#=> "matrix3d(9.870993963020204, 0.7, 0, 0, -0.5, 0, 0, 0, 0, 0, 1, 0, 443.54969815101026, 35, 200, 1)"

# set a new base matrix (on the basis of which transforms are applied)
cssToMatrix.matrix [
	[3, 1, 4, 1]
	[5, 9, 2, 6]
	[5, 3, 5, 8]
	[9, 7, 9, 3]
]

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

## why not use actual matricies?

If you're performing caculations dozens of times per second (in the case of animations. 60 times per second), performance is essential. Not only do we need to be able to perform calculations for complex compound 3D transforms at 60FPS, but we need to leave head room for any precursor computations, as well as compositing and painting. Performing the calculations ourselves (instead of leaving it to the CSS engine) gives us finer control over where (CPU vs. GPU, this thread vs. a WebWorker, sync vs. async) and when (precomputed, partially applied, realtime) computation occurs.

## see also

- http://www.w3.org/TR/css3-transforms/#transform-functions
- http://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined
- http://dev.opera.com/articles/view/understanding-the-css-transforms-matrix/
- http://dev.opera.com/articles/view/understanding-3d-transforms/
- http://inside.mines.edu/~gmurray/ArbitraryAxisRotation/
- http://stackoverflow.com/a/15208858/435124
- http://desandro.github.io/3dtransforms/docs/perspective.html

## todo

- accept alternative units for scalars (%, em, pt, etc.)

## running the tests

```bash
npm i
grunt test
```

then, open test/index.html in a browser

## license

MIT