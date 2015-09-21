'use strict';

var gulp = require('gulp'),
	uglifyJs = require('gulp-uglify'),
	uglifyCss = require('gulp-uglifycss'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	concatCss = require('gulp-concat-css'),
	order = require('gulp-order');

gulp.task('styles', function () {
	gulp.src('src/css/**/*.css')
	.pipe(plumber())
	.pipe(order([
		'bootstrap.css',
		'material.css',
		'*.css'
	]))
	.pipe(autoprefixer({
			browsers: ['> 1%', 'last 3 versions']
	}))
	.pipe(concatCss('vk-audio-downloader.bundle.css'))
	.pipe(uglifyCss())
	.pipe(gulp.dest('build/css/'));
});

gulp.task('chromeExtensionApp', function () {

	// copy styles
	gulp.src('build/css/*.css')
		.pipe(gulp.dest('chrome-extension/app/build/css/'));

	// copy fonts
	gulp.src('build/fonts/*.*')
		.pipe(gulp.dest('chrome-extension/app/build/fonts/'));

	// copy js
	gulp.src('build/js/*.js')
		.pipe(uglifyJs())
		.pipe(gulp.dest('chrome-extension/app/build/js/'));

	// copy html
	gulp.src('index.html')
		.pipe(gulp.dest('chrome-extension/app/'));

});

gulp.task('watch', function () {
	gulp.watch('src/css/**/*.css', ['styles']);
});

gulp.task('watchBundles', function () {
	gulp.watch('build/**/*', ['chromeExtensionApp']);
	gulp.watch('index.html', ['chromeExtensionApp']);
});

gulp.task('default', ['styles', 'watch', 'watchBundles']);