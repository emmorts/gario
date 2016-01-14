var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');

function compile(watch) {
  var bundler = watchify(
      browserify({
        // Define the entry point for our application
        entries: ['./src/client/js/app.js'],
        // Debugging is nice
        debug: true,
        builtins: [],
        // Allow importing from the following extensions
        extensions: [' ', 'js']
      }).transform(babel.configure({
        presets: ["es2015"]
      }))
    );

  function rebundle() {
    bundler.bundle()
      .on('error', function (err) { console.error(err); this.emit('end'); })
      .pipe(source('game.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./src/dist/js/'));
  }

  if (watch) {
    bundler.on('update', function () {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  gulp.watch(['./src/client/*.html'], ['html']);
  gulp.watch(['./src/client/css/*.css'], ['css']);
  
  return compile(true);
};

gulp.task('build', function () { return compile(); });
gulp.task('watch', function () { return watch(); });

// var src = [
//   './src/opCode.js',
//   './node_modules/buffercodec/index.js',
//   './src/client/js/keyCode.js',
//   './src/client/js/models/*.js',
//   './src/client/js/polyfills.js',
//   './src/client/js/graph.js',
//   './src/client/js/wsController.js',
//   './src/client/js/app.js'
// ];

// gulp.task('js', function () {
//   return gulp.src(src)
//     .pipe(concat('game.js'))
//     .pipe(gulp.dest('./src/dist/js'));
// });

gulp.task('css', function () {
  return gulp.src('./src/client/css/*.css')
    .pipe(gulp.dest('./src/dist/css'));
});

gulp.task('html', function () {
  return gulp.src('./src/client/*.html')
    .pipe(gulp.dest('./src/dist/'));
});

// gulp.task('default', ['js', 'css', 'html'], function () {
//   gulp.watch(src, ['js']);
//   gulp.watch(['./src/client/*.html'], ['html']);
//   gulp.watch(['./src/client/css/*.css'], ['css']);
// });