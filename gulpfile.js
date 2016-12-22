const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const livereload = require('gulp-livereload');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');

const dist = './dist/';

function compile(shouldWatch) {
  const bundler = watchify(
    browserify({
      entries: ['./src/client/app.js'],
      debug: true,
      paths: ['./node_modules', './src'],
      builtins: [],
      extensions: [' ', 'js'],
    }).transform(babel.configure({
      presets: ['es2015'],
    })));

  function rebundle(done) {
    return bundler.bundle()
      .on('error', (err) => { console.error(err); this.emit('end'); })
      .on('end', () => { if (done) done(); })
      .pipe(source('game.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(`${dist}js/`))
      .pipe(livereload());
  }

  if (shouldWatch) {
    bundler.on('update', () => {
      gutil.log('Bundling... ');
      rebundle(() => {
        gutil.log('Done!');
      });
    });
  }

  return rebundle();
}

function watch() {
  livereload.listen();

  gulp.watch(['./src/assets/*.html'], ['html']);
  gulp.watch(['./src/assets/css/*.css'], ['css']);

  return compile(true);
}

gulp.task('css', () => gulp
  .src('./src/assets/css/*.css')
  .pipe(gulp.dest(`${dist}css`))
  .pipe(livereload())
);

gulp.task('html', () => gulp
  .src('./src/assets/*.html')
  .pipe(gulp.dest(dist))
  .pipe(livereload())
);

gulp.task('sprites', () => gulp
  .src('./src/assets/sprites/*.png')
  .pipe(gulp.dest(`${dist}/sprites`))
  .pipe(livereload())
);

gulp.task('build', ['css', 'html', 'sprites'], compile);
gulp.task('watch', ['css', 'html', 'sprites'], watch);
gulp.task('default', ['watch']);
