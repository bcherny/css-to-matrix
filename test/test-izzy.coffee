

izzy = require '../izzy'

subjects =
	array: [],
	boolean: false
	defined: NaN
	function: ->
	null: null
	number: 42
	object: {}
	string: 'bar'

for type, subject of subjects

	exports[type] = (test) ->

		for innertype, innersubject of subjects
			test.strictEqual izzy[type](innersubject), type is innertype
			test.strictEqual izzy(type, innersubject), type is innertype

		test.done()