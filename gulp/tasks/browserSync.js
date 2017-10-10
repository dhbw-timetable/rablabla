const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const config = require('../config').browserSync;

gulp.task('browserSync', ['build'], () => {
  browserSync.init({
    ...config,
    codeSync: false,
    server: {
      baseDir: './src/main/webapp/',
    },
  });
});
