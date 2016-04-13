const gulp = require('gulp'),
    path = require('path'),
    browserSync = require('browser-sync').create(),
    Concat = require('gulp-concat'),
    Sequence = require('gulp-sequence'),
	merge = require('merge-stream'),
	config = require('../config.js'),
	SRC = config.src,
	DIST = config.devDist;

// Static Server + watching
gulp.task('core.dev:hot', () => {
	var serveCfg = {};
	if (typeof config.vhost === 'string' && config.vhost.length > 1) {
		serveCfg.proxy = config.vhost;
	} else {
		serveCfg.server = './';
	}
    browserSync.init(serveCfg);

    gulp.watch([SRC.views + '/*.*', DIST.path + '/**/*']).on('change', browserSync.reload);
});

gulp.task('core.dev', (cb) => {
	var arr = config.hot ? ['core.dev:hot'] : [];
	arr = arr.concat(['core.webpack', cb]);
	Sequence.apply(null, arr);
});
