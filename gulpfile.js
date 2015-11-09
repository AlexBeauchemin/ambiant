/**
 * @file
 * Portable Gulp tool that checks a Meteor installation for js syntax errors.
 */
/* globals require */

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    runSequence = require('run-sequence');

gulp.task('default', function(callback) {
  runSequence('jshint', 'watch', callback);
});


/**
 * @task JavaScript lint.
 *   Runs JSCS and JSLint on server, client, lib, and gulp files.
 */
gulp.task('jshint', function () {
  return gulp.src([
    'gulpfile.js',
    'app/client/**/*.js',
    'app/server/**/*.js',
    'app/collections/**/*.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jscs());
});

/**
 * @task JavaScript/JSON watch.
 *   Watches changes on relevant js and json files and reports accordingly.
 */
gulp.task('watch', function () {
  gulp.watch([
    'gulpfile.js',
    'app/client/**/*.js',
    'app/collections/**/*.js',
    'app/server/**/*.js'
  ], ['jshint']);
});
