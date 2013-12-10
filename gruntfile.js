module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),
		emberTemplates: {
			compile: {
				options: {
					templateBasePath: /public\/js\/app\/templates\//
				},
				files: {
					'public/js/app/templates.js': 'public/js/app/templates/**/*.hbs'
				}
			}
		},
		watch: {
			emberTemplates: {
				files: 'public/js/app/templates/**/*.hbs',
				tasks: ['emberTemplates']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ember-templates');

	// Default task(s)
	grunt.registerTask('default', ['emberTemplates', 'watch']);
};
