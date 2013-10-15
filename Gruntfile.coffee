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

		'regex-replace':

			min:
				src: ['tranny.min.js'],
				actions: [
					{
						name: 'remove debug checks'
						search: '####DEV(.+)####END DEV'
						replace: ''
						flags: 'gim'
					}
				]


	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-regex-replace'

	grunt.registerTask 'default', ['coffee', 'uglify', 'regex-replace']