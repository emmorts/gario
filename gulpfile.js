var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var path = require('path');
var pathmodify = require('pathmodify');

function compile(watch) {
  var bundler = watchify(
      browserify({
        entries: ['./src/client/js/app.js'],
        debug: true,
        paths: [ './node_modules', './src/client/js' ],
        builtins: [],
        extensions: [' ', 'js']
      }).transform(babel.configure({
        presets: ["es2015"]
      })).plugin(pathmodify, {
        mods: [
          pathmodify.mod.dir('shared', path.join(__dirname, 'src'))
        ]
      }));

  function rebundle(done) {
    return bundler.bundle()
      .on('error', function (err) { console.error(err); this.emit('end'); })
      .on('end', function () { if (done) done(); })
      .pipe(source('game.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./src/dist/js/'));
  }

  if (watch) {
    bundler.on('update', function () {
      gutil.log('Bundling... ');
      rebundle(function () {
        gutil.log('Done!');
      });
    });
  }

  return rebundle();
}

function watch() {
  gulp.watch(['./src/client/*.html'], ['html']);
  gulp.watch(['./src/client/css/*.css'], ['css']);
  
  return compile(true);
};

gulp.task('css', function () {
  return gulp.src('./src/client/css/*.css')
    .pipe(gulp.dest('./src/dist/css'));
});

gulp.task('html', function () {
  return gulp.src('./src/client/*.html')
    .pipe(gulp.dest('./src/dist/'));
});

gulp.task('build', ['css', 'html'], function () {
  return compile();
});
 
gulp.task('watch', ['css', 'html'], function () {
  return watch();
});

gulp.task('default', ['watch']);