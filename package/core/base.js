const gulp = require('gulp'),
    path = require('path'),
    Concat = require('gulp-concat'),
    Sequence = require('gulp-sequence'),
    cssmin = require('gulp-cssmin'),
    jsmin = require('gulp-uglify');

const config = require('../config.js'),
	SRC = config.src,
	DIST = config.dist,
    Tools = require('../tools');

// css folder to folder.css & folder.min.css
gulp.task('core.base:css', () => {
  var baseCssDir = SRC.base + '/css',
      dirNameList = Tools.getDirNameList(baseCssDir);
  var tasks = dirNameList.map(function(dirName) {
      var src = path.join(baseCssDir, dirName, '/**/*'),
          dist = DIST.path + '/base';
      var gA = gulp.src(src)
          .pipe(Concat(dirName + '.min.css'))
          .pipe(cssmin())
          .pipe(gulp.dest(dist));
      var gB = gulp.src(src)
          .pipe(Concat(dirName + '.css'))
          .pipe(gulp.dest(dist));
      return gB;
  });
  return tasks;
});

// js folder to folder.js & folder.min.js
gulp.task('core.base:js', () => {
  var baseJsDir = SRC.base + '/js',
      dirNameList = Tools.getDirNameList(baseJsDir);
  var tasks = dirNameList.map(function(dirName) {
      var src = path.join(baseJsDir, dirName, '/**/*'),
          dist = DIST.path + '/base';
      var gA = gulp.src(src)
        .pipe(Concat(dirName + '.min.js'))
        .pipe(jsmin())
        .pipe(gulp.dest(dist));
      var gB =  gulp.src(src)
        .pipe(Concat(dirName + '.js'))
        .pipe(gulp.dest(dist));
      return gB;
  });
  return tasks;
});

gulp.task('core.base', ['core.base:css', 'core.base:js']);
