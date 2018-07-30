'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
//var watch = require('gulp-watch');
var browserSync = require('browser-sync');

gulp.task('serve', ['scripts'], function() {

  browserSync.init({
      
    proxy: "http://localhost:8002/demo/"
    
  });

  gulp.watch("app/spatium.src/*.js", ['scripts']);
  gulp.watch("app/spatium.src/*.js").on('change', browserSync.reload);
});

gulp.task('scripts', function() {
    return gulp.src(
      [
      'app/spatium.src/spatium.jquery.js'
      ])
      .pipe(babel({presets: ['es2015']}))
      .pipe(gulp.dest('app/demo/js/'))
});

gulp.task('default', ['serve']);

