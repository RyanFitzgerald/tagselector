var gulp = require('gulp');
var wait = require('gulp-wait');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('scripts', function() {
  return gulp.src('src/tagselector.js')
      .pipe(plumber(plumber({
          errorHandler: function (err) {
              console.log(err);
              this.emit('end');
          }
      })))
      .pipe(uglify({
          mangle: false,
          compress: false,
          output: {
            beautify: true,
            comments: '/^!/'
          }
      }))
      .pipe(gulp.dest('./dist'))
      .pipe(uglify({
          output: {
            comments: '/^!/'
          }
      }))
      .pipe(rename({extname: '.min.js'}))
      .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function () {
  return gulp.src('./src/tagselector.scss')
      .pipe(wait(250))
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest('./dist'))
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename({extname: '.min.css'}))
      .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['scripts', 'styles'], function() {
  gulp.watch('src/tagselector.js', ['scripts']);
  gulp.watch('src/tagselector.scss', ['styles']);
});