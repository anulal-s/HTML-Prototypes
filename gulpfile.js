var gulp = require('gulp');
var inject = require('gulp-inject');
var fileinclude = require('gulp-file-include');
var injectPartials = require('gulp-inject-partials');
var webserver = require('gulp-webserver');


gulp.task('server', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: 'src/'
    }));
});




gulp.task('default', ['server']);
