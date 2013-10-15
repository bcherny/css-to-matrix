setup

	Tranny = window.Tranny
	expect = chai.expect
	div = document.getElementById 'test'
	precision = 100000
	data = [
		[1,2,3,4]
		[5,6,7,8]
		[9,10,11,12]
		[13,14,15,16]
	]

setup

	mocha.setup 'bdd'

	describe 'constructor', ->

		it 'adds data that is passed when intialized to its model', ->

			tranny = new Tranny data
			actual = tranny.model.get 'matrix'

			expect(actual).to.deep.equal data

	describe 'matrix', ->

		it 'should add valid data to its instance model', ->

			tranny = new Tranny
			tranny.matrix data
			actual = tranny.model.get 'matrix'

			expect(actual).to.deep.equal data

		it 'should throw an error when intialized with an invalid array', ->

			fn = -> new Tranny 'bad'

			expect(fn).to.throw Error

run

	mocha.run()