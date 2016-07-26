var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');


gulp.task('default',['convertJS'], function() {

  gulp.watch('client/**', ['convertJS']);



});


  gulp.task('convertJS', function() {
    console.log('hi');
    return gulp.src('client/js/**')
      .pipe(concat('bundle.js'))
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('public/js'));

  });
