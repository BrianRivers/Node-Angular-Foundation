module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),
		emberTemplates: {
			compile: {
				options: {
					templateBasePath: /public\/js\/templates\//
				},
				files: {
					'public/js/templates.js': 'public/js/templates/**/*.hbs'
				}
			}
		},
		watch: {
			emberTemplates: {
				files: 'public/js/templates/**/*.hbs',
				tasks: ['emberTemplates']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ember-templates');

	// Default task(s)
	grunt.registerTask('default', ['emberTemplates', 'watch']);
};
