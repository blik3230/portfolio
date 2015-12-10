'use strict';

var gulp = require('gulp'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	//lifereload = require('gulp-livereload'),
	rename = require("gulp-rename"),
	connect = require('gulp-connect');
	//reload      = browserSync.reload;

var tinypng = require('gulp-tinypng-compress'),
    kraken = require('gulp-kraken');


// https://tinypng.com/developers 500 картинок в месяц
gulp.task('tinypng', function () {
    gulp.src('dist/dflt_img/**/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: 'gMKFBhLkACk4iAF0_9V9Z4VN4Xb1n8Gc',
            sigFile: 'images/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('dist/images2'));
});

// https://kraken.io/
gulp.task('kraken', function () {
    gulp.src('images/**/*.*')
        .pipe(kraken({
            key: 'kraken-api-key-here',
            secret: 'kraken-api-secret-here',
            lossy: true
        }));
});


//html
gulp.task('html', function () {
	return gulp.src('src/jade/pages/*.jade')
	.pipe(jade({
		pretty: '\t'
	}))
    .pipe(gulp.dest('./dist/'))
});

// reload
gulp.task('reload', ['html'], function(){
	console.log('reload');
	return gulp.src('./dist/')
		.pipe(connect.reload());
});

//css
// gulp.task('css', function () {
//   gulp.src('./src/sass/index.scss')
//     .pipe(sass())
//     .pipe(autoprefixer())
//     .pipe(rename("dflt_css/site.css"))
//     .pipe(gulp.dest('./dist'))
// 	.pipe(connect.reload());
// });

gulp.task('css', function () {
  gulp.src('./src/sass/*.scss')
  	.pipe(sourcemaps.init())
    	.pipe(sass())
	.pipe(sourcemaps.write())
	.pipe(autoprefixer())
	.pipe(rename("css/style.css"))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

// server connect
gulp.task('connect', function() {
	connect.server({
		root: 'dist/',
		livereload: true
	});
	console.log(connect);
});

//image optimization
gulp.task('images', function(cb) {

});

// watch
gulp.task('watch', function () {
	gulp.watch('src/sass/**/*.scss', ['css'])
	gulp.watch('src/jade/**/*.jade', ['reload'])
	gulp.watch('dist/dflt_js/**/*.js', ['reload'])
});

//default
gulp.task('default', ['connect', 'html', 'css', 'watch']);

