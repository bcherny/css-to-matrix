# tranny

*Pre-alpha - not yet functional*

A little library for converting compound CSS transforms into their matrix equivalents.

## usage

```js
tranny = new Tranny();

tranny

// parse a CSS string
.parse('skew(1.5rad) scale(0.5, 0.7)')

// set some transforms
.rotate('90deg')
.translate3d(50, 100, 200);

// get a matrix back
tranny.getMatrix()

/*
	[
		[9.870993963020204, 0.7, 0, 0],
		[-0.5, 0, 0, 0],
		[0, 0, 1, 0],
		[443.54969815101026, 35, 200, 1]
	]
*/

// .. or as a CSS property
tranny.getMatrixCSS()

/*
	"matrix3d(9.870993963020204, 0.7, 0, 0, -0.5, 0, 0, 0, 0, 0, 1, 0, 443.54969815101026, 35, 200, 1)"
*/
```