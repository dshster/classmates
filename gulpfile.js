/* global require, process, console */
'use strict';

var gulp = require('gulp'),
    path = require('path'),
    prefs = require('./preferences.json'),
    $ = require('gulp-load-plugins')();

gulp.task('template', function() {
	return gulp.src(prefs.template + '/index.jade')
		.pipe($.data(function(file) {
			return require(prefs.data + '/' + path.basename(file.path, '.jade') + '.json');
		}))
		.pipe($.jade())
		.on('error', function(error) {
			console.log(error);
			this.end();
		})
		.pipe(gulp.dest(prefs.app));
});

gulp.task('styles', function() {
	return gulp.src(prefs.styles + '/index.less')
		.pipe($.less({
			cleancss: true
		}))
		.on('error', function(error) {
			console.log(error);
			this.end();
		})
		.pipe($.autoprefixer(['last 3 versions', 'ie 9', 'ie 10', 'opera 12']))
		.pipe($.rename('index.css'))
		.pipe(gulp.dest(prefs.compile));
});

gulp.task('server', function(next) {
	var connect = require('connect'),
	    servestatic = require('serve-static'),
	    server = connect();

	server.use(require('connect-livereload')({
		port: 35729
	}));
	server.use(servestatic(prefs.app));
	server.listen(process.env.PORT || 3000, next);
});

gulp.task('watch', ['server'], function() {
	var livereload = require('gulp-livereload');

	gulp.watch([prefs.template + '/*.jade', prefs.template + '/**'], ['template'], function(event) {
		console.log('Template ' + event.path + ' was ' + event.type);
	});

	gulp.watch([prefs.data + '/*.json'], ['template'], function(event) {
		console.log('Template ' + event.path + ' was ' + event.type);
	});

	gulp.watch([prefs.styles + '/*', prefs.styles + '/**'], ['styles'], function(event) {
		console.log('Style ' + event.path + ' was ' + event.type);
	});

	gulp.watch([prefs.app + '/**', prefs.compile + '/*']).on('change', function(file) {
		livereload.changed(file.path);
	});
});

gulp.task('default', ['template', 'styles']);
