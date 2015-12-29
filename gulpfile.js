var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('js', function () {
   return gulp.src([
       './src/client/js/graph.js', 
       './src/client/js/wsController.js', 
       './src/client/js/app.js'
        ])
    .pipe(concat('game.js'))
    .pipe(gulp.dest('./src/client/dist'));
});

gulp.task('default', ['js'], function () {
   return gulp.watch('./src/client/js/*', ['js']); 
});