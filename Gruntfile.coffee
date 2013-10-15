module.exports = (grunt) ->

	grunt.config.init

		coffee:

			compile:
				files:
					'tranny.js': 'tranny.coffee'

		uglify:

			options:
				mangle:
					toplevel: true
				compress:
					dead_code: true
					unused: true
					join_vars: true
				comments: false

			standard:
				files:
					'tranny.min.js': [
						'tranny.js'
					]

			standalone:
				files:
					'tranny.standalone.min.js': [
						'tranny.standalone.js'
					]

		concat:

			standalone:
				src: [
					'node_modules/annie/annie.js'
					'node_modules/matrix-utilities/matrix-utilities.js'
					'node_modules/transform-to-matrix/transform-to-matrix.js'
					'node_modules/umodel/umodel.js'
					'tranny.js'
				]
				dest: 'tranny.standalone.js'

		'regex-replace':

			min:
				src: ['tranny.min.js', 'tranny.standalone.min.js'],
				actions: [
					{
						name: 'remove debug checks'
						search: '####DEV(.+)####END DEV'
						replace: ''
						flags: 'gim'
					}
				]


	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-regex-replace'

	grunt.registerTask 'default', ['coffee', 'concat', 'uglify', 'regex-replace']