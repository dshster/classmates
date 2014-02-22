/* global module */
module.exports = function (grunt) {
	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		meta: {
			banner: "/*!\n build: <%= grunt.template.today(\"dd-mm-yyyy\") %>, Dmitry Shvalyov, dmitry@shvalyov.ru */\n"
		},

		jshint: {
			options: {
				"smarttabs": true
			},
			all: ["Gruntfile.js", "design/frontpage-design.js"],
		},

		cssmin: {
			product: {
				files: {
					"design/frontpage-design.min.css": "design/frontpage-design.css"
				},
				options: {
					banner: "<%= meta.banner %>",
					report: "gzip"
				}
			}
		},

		uglify: {
			product: {
				files: {
					"design/frontpage-design.min.js": "design/frontpage-design.js"
				},
				options: {
					banner: "<%= meta.banner %>",
					report: "gzip"
				}
			}
		},
	});

	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	var defaultTask = "jshint cssmin uglify";
	grunt.registerTask("default", defaultTask.split(" "));
};
