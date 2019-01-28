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
const sass = require('gulp-sass');
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
const asset_src = 'assets/';
const npm_src   = 'node_modules/';
const dest      = 'assets/';

const onError = function( err ) {
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
      npm_src   + 'moment/moment.js',
      npm_src   + 'vanilla-lazyload/dist/lazyload.js',
      npm_src   + 'fitvids/fitvids.js',
      npm_src   + 'ghost-search/dist/ghost-search.js',
      asset_src + 'js/scripts/ghostAPI.js',
      asset_src + 'js/scripts/script.js'
    ])
    .pipe(babel({
      presets: ['es2015']
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
  const processors = [
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
    port: 3568,
    proxy: 'http://localhost:2368/'
  });
  callback();
});

gulp.task('browsersync:reload', function (callback) {
  browserSync.reload();
  callback();
});

// Watch for changes in files
gulp.task('watch', function() {
  // Watch .js files
  gulp.watch(asset_src + 'js/scripts/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch(asset_src + 'sass/*/*.scss', ['sass']);
  // Watch app.min.css
  gulp.watch(asset_src + 'css/app.min.css', ['inlinecss']);
  // Watch app.min.css
  gulp.watch(asset_src + 'css/app.min.css', ['browsersync:reload']);
  // Watch app.min.js
  gulp.watch(asset_src + 'js/app.min.js', ['browsersync:reload']);
  // Watch .hbs files
  gulp.watch('**/*.hbs', ['browsersync:reload']);
});

// Default Task
gulp.task('default', ['sass','inlinecss', 'scripts', 'fonts', 'watch', 'browsersync']);
