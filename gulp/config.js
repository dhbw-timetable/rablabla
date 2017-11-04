const dest = './src/main/webapp';
const src = './src/main/web';

module.exports = {
  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [dest, src],
    },
    files: [
      `${dest}/**`,
    ],
  },
  markup: {
    src: `${src}/www/**`,
    dest,
  },
  browserify: {
    // Enable source maps
    debug: true,
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: `${src}/app/app.js`,
      dest,
      outputName: 'app.js',
    }],
    extensions: ['.js'],
  },
  sass: {
    src: `${src}/app/scss/*.scss`,
    dest: `${dest}/css/`,
  },
};
