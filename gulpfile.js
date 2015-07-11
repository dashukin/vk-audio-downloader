var gulp = require('gulp'),
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
			browsers: ['> 0%', 'last 3 versions']
	}))
	.pipe(concatCss('bundle.css'))
	.pipe(uglifyCss())
	.pipe(gulp.dest('build/css/'));
});

gulp.task('watch', function () {
	gulp.watch('src/css/**/*.css', ['styles']);
});

gulp.task('default', ['styles', 'watch']);