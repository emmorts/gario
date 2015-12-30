var gulp = require('gulp');
var concat = require('gulp-concat');

var src = [
  './src/opCode.js', 
  './src/client/js/graph.js', 
  './src/client/js/wsController.js', 
  './src/client/js/app.js'
];

gulp.task('js', function () {
   return gulp.src(src)
    .pipe(concat('game.js'))
    .pipe(gulp.dest('./src/client/dist'));
});

gulp.task('default', ['js'], function () {
   return gulp.watch(src, ['js']); 
});