var gulp = require('gulp');
var express = require('gulp-dev-express');

gulp.task('default', function () {
  gulp.watch('modules/*.js', express('server.js'));
});
