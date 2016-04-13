const gulp = require('gulp'),
	config = require('../config.js'),
	SRC = config.src,
	DIST = config.dist,
	Sequence = require('gulp-sequence'),
	gulpWebpack = require('gulp-webpack');

gulp.task('core.webpack:main', (cb) => {
	var webpackConfig = require('../webpack.main.config.js')(SRC.dev);
	if (config.hot && !config.asyncHot) {
		webpackConfig.watch = true;
	}
	return gulp.src('')
		.pipe(gulpWebpack(webpackConfig))
		.pipe(gulp.dest(DIST.path));
});

gulp.task('core.webpack:async', (cb) => {
	var webpackConfig = require('../webpack.async.config.js')(SRC.async);
	if (config.hot && config.asyncHot) {
		webpackConfig.watch = true;
	}
	return gulp.src('')
		.pipe(gulpWebpack(webpackConfig))
		.pipe(gulp.dest(DIST.path));
});

gulp.task('core.webpack', (cb) => {
	if (config.asyncHot) {
		Sequence( 'core.webpack:main', 'core.webpack:async', cb);
	} else {
		Sequence('core.webpack:async', 'core.webpack:main', cb);
	}
});
