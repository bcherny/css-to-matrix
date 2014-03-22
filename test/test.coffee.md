setup

	Puppy = window.Puppy
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

			puppy = new Puppy data
			actual = puppy.model.get 'matrix'

			expect(actual).to.deep.equal data

	describe 'matrix', ->

		it 'should add valid data to its instance model', ->

			puppy = new Puppy
			puppy.matrix data
			actual = puppy.model.get 'matrix'

			expect(actual).to.deep.equal data

		it 'should throw an error when intialized with an invalid array', ->

			fn = -> new Puppy 'bad'

			expect(fn).to.throw Error

	describe 'getMatrix', ->

		it 'should properly apply transformations', ->

			puppy = new Puppy
			puppy.translate3d 10, 20, 30

			actual = puppy.getMatrix()
			expected = [
				[1, 0, 0, 0]
				[0, 1, 0, 0]
				[0, 0, 1, 0]
				[10, 20, 30, 1]
			]

			expect(actual).to.deep.equal expected

	describe 'getMatrixCSS', ->

		it 'should convert matricies to CSS strings', ->

			puppy = new Puppy data
			css = puppy.getMatrixCSS()

			expect(css).to.equal 'matrix3d(1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16)'

run

	mocha.run()
