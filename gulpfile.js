const gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var qunit = require('gulp-qunit');

var pathJs = 'src/**/*.js';
var destinationJs = '.';

gulp.task('uglify', function () {
    return gulp.src(pathJs)
        .pipe(uglify())
        .pipe(rename('clickbus-payments-min.js'))
        .pipe(gulp.dest(destinationJs))
});

gulp.task('concat', function () {
    return gulp.src(pathJs)
        .pipe(concat('clickbus-payments.js'))
        .pipe(gulp.dest(destinationJs))
});

gulp.task('test', function() {
    return gulp.src('tests/tests.html')
        .pipe(qunit());
});

gulp.task('watch', function () {
    return gulp.watch(pathJs, allTasks);
});

var allTasks = gulp.series('concat', 'uglify');

exports.default = allTasks;
exports.test = gulp.series('test');
