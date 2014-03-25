var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cssminify = require('gulp-minify-css');



gulp.task('default', function() {
    gulp.src('jquery.onepage-scroll.js').pipe(uglify()).pipe(rename({
        extname: ".min.js"
    })).pipe(gulp.dest('./'));

    gulp.src('onepage-scroll.css').pipe(cssminify()).pipe(rename({
        extname: ".min.css"
    })).pipe(gulp.dest('./'));

});
