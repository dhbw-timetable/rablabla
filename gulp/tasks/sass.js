const gulp = require('gulp');
const sass = require('gulp-sass');
const config = require('../config').sass;

gulp.task('sass', () => {
  return gulp.src(config.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.dest));
});

gulp.task('sass:watch', () => {
  gulp.watch(config.src, ['sass']);
});
