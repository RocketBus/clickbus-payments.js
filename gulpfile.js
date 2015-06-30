var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var qunit = require('gulp-qunit');

var pathJs = 'src/*.js';
var destinationJs = '.';

gulp.task('uglify', function() {
    gulp.src(pathJs)
        .pipe(uglify())
        .pipe(rename('clickbus-payments-min.js'))
        .pipe(gulp.dest(destinationJs))
});

gulp.task('concat', function() {
    gulp.src(pathJs)
        .pipe(concat('clickbus-payments.js'))
        .pipe(gulp.dest(destinationJs))
});

gulp.task('qunit', function() {
    return gulp.src('./tests/test.html')
        .pipe(qunit());
});

gulp.task('watch', function() {
    gulp.watch(pathJs, ['uglify', 'concat']);
});

gulp.task('default', ['uglify', 'concat', 'qunit']);