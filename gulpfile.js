var gulp = require('gulp');
var concat = require('gulp-concat');

var src = [
  './src/opCode.js',
  './node_modules/buffercodec/index.js',
  './src/client/js/models/*.js',
  './src/client/js/polyfills.js',
  './src/client/js/graph.js',
  './src/client/js/wsController.js',
  './src/client/js/app.js'
];

gulp.task('js', function () {
  return gulp.src(src)
    .pipe(concat('game.js'))
    .pipe(gulp.dest('./src/dist/js'));
});

gulp.task('css', function () {
  return gulp.src('./src/client/css/*.css')
    .pipe(gulp.dest('./src/dist/css'));
});

gulp.task('html', function () {
  return gulp.src('./src/client/*.html')
    .pipe(gulp.dest('./src/dist/'));
});

gulp.task('default', ['js', 'css', 'html'], function () {
  gulp.watch(src, ['js']);
  gulp.watch(['./src/client/*.html'], ['html']);
  gulp.watch(['./src/client/css/*.css'], ['css']);
});