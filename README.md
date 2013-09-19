# izzy

A micro library for naive type checking

## usage

```js
> izzy.string ('foo')
// > true

// or, equivalently:
> izzy ('string', 42)
// > false
```

## supported checks

array, boolean, defined, function, null, number, object, string

## size

|						|				|
|-----------------------|---------------|
| Raw					| 1283 bytes	|
| Uglified				| 681 bytes		|
| Uglified + gzipped	| 313 bytes		|

## environment support

Any browser (as `window.izzy`), AMD, CommonJS, NodeJS