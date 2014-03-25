var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');



gulp.task('default', function() {
    return gulp.src('jquery.onepage-scroll.js').pipe(uglify()).pipe(rename({
        extname: ".min.js"
    })).pipe(gulp.dest('./'));
});
