const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const colorRgbaFallback = require('postcss-color-rgba-fallback');
const opacity = require('postcss-opacity');
const pseudoelements = require('postcss-pseudoelements');
const vmin = require('postcss-vmin');
const willChange = require('postcss-will-change');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('cssnano');
const zindex = require('postcss-zindex');
const removeComments = require('postcss-discard-comments');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const gutil = require('gulp-util');
const replace = require('gulp-replace');
const fs = require('fs');
const babel = require('gulp-babel');

// Define base folders
var asset_src = 'assets/';
var npm_src   = 'node_modules/';
var dest      = 'assets/';

var onError = function( err ) {
  console.log('An error occurred:', gutil.colors.magenta(err.message));
  gutil.beep();
  this.emit('end');
};

gulp.task('fonts', function() {
  return gulp
    .src([
      npm_src   + 'font-awesome/fonts/**.*'
    ])
    .pipe(gulp.dest(dest + 'fonts'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp
    .src([
      npm_src   + 'lazysizes/lazysizes.min.js',
      npm_src   + 'moment/moment.js',
      npm_src   + 'fitvids/dist/fitvids.js',
      npm_src   + '@tryghost/content-api/umd/content-api.min.js',
      npm_src   + 'ghost-search/dist/ghost-search.js',
      asset_src + 'js/scripts/script.js'
    ])
    .pipe(babel({
      'presets': [
        [
          '@babel/preset-env', {
            'modules': false
          }
        ]
      ]
    }))
    .pipe(concat('app.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dest + 'js'))
    .pipe(notify({
      title: 'Javascript',
      message: 'JS compiled and minified!'
    }));
});

// Build styles from sass
gulp.task('sass', function () {
  var processors = [
    removeComments,
    cssnext({
      browsers:'> 1%, last 10 version, Firefox >= 30, ie >= 10',
      warnForDuplicates: false
    }),
    zindex,
    willChange,
    colorRgbaFallback,
    opacity,
    pseudoelements,
    vmin,
    cssnano
  ];

  return gulp
    .src(asset_src + '/sass/app.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(replace('@charset "UTF-8";', ''))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dest + 'css'));
});

gulp.task('inlinecss', function() {
  return gulp.src(['partials/inline-css.hbs'])
  .pipe(replace('@@compiled_css', fs.readFileSync('assets/css/app.min.css')))
  .pipe(gulp.dest('partials/compiled'))
  .pipe(notify({
    title: 'CSS',
    message: 'CSS compiled and inlined!'
  }));
});

// Browsersync init and reload
gulp.task('browsersync', function (callback) {
  browserSync.init({
    port: 3368,
    proxy: 'http://localhost:2368/'
  });
  callback();
});

gulp.task('reload', function (callback) {
  browserSync.reload();
  callback();
});

// Watch for changes in files
gulp.task('watch:scripts', function () {
  gulp.watch(asset_src + 'js/scripts/*.js', gulp.series('scripts', 'reload'));
});

gulp.task('watch:sass', function () {
  gulp.watch(asset_src + 'sass/*/*.scss', gulp.series('sass', 'inlinecss', 'reload'));
});

gulp.task('watch:hbs', function () {
  gulp.watch('**/*.hbs', gulp.series('reload'));
});

gulp.task('watch',
  gulp.parallel('watch:scripts', 'watch:sass', 'watch:hbs')
);

// // Default Task
gulp.task('default',
  gulp.series(
    gulp.parallel(
      'fonts',
      'scripts',
      'sass'
    ),
    'inlinecss',
    'browsersync',
    'watch'
  ),
);
