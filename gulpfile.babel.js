/*
 *    Steps
 * 1. Rename your gulpfile.js to gulpfile.babel.js
 * 2. Add babel to your package.json (npm install -D babel-core)
 * 3. Start writing ES6 in your gulpfile!
 */

const gulp = require('gulp'),
	Sequence = require('gulp-sequence'),
	gulpWebpack = require('gulp-webpack'),
	requireDir = require('require-dir'),
	config = require('./package/config.js');
var mode = config.mode;

requireDir('./package/core', {recurse: false}); // 不递归往文件夹里继续找

gulp.task('base', ['core.base']);
gulp.task('H5', ['h5']);
gulp.task('h5', ['dev']);
gulp.task('dev', ['core.dev']);
gulp.task('build', ['core.build']);

gulp.task('init', ['core.init']);
gulp.task('new', ['core.new']);

gulp.task('totrunk', ['core.totrunk']);
gulp.task('totest', ['core.totest']);
