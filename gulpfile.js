var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cssminify = require('gulp-minify-css');
var connect = require('gulp-connect');



gulp.task('default', function() {
    gulp.src('jquery.onepage-scroll.js').pipe(uglify()).pipe(rename({
            extname: ".min.js"
        })).pipe(gulp.dest('./'));

    gulp.src('onepage-scroll.css').pipe(cssminify()).pipe(rename({
            extname: ".min.css"
        })).pipe(gulp.dest('./'));

});


gulp.task('demo', function() {
    connect.server({
        root: './Demo',
        port: 9000,
        livereload: true
    });
    gulp.src(['./jquery.onepage-scroll.js', './onepage-scroll.css']).pipe(gulp.dest('./Demo')).pipe(connect.reload());
});