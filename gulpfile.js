var gulp = require('gulp');
var watch = require('gulp-watch');
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

gulp.task('stream', function () {
     watch('./src/html/pages/*.html',  'inject-partials');
});

gulp.task('inject-partials', function () {
  return gulp.src('./src/html/pages/*.html')
           .pipe(injectPartials())
           .pipe(gulp.dest('./src'));
});


gulp.task('default', ['inject-partials', 'stream', 'server']);
