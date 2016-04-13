const gulp = require('gulp'),
    path = require('path'),
    Sequence = require('gulp-sequence'),
	merge = require('merge-stream'),
	config = require('../config.js');
const yargs = require('yargs');
var argv = yargs.argv,
	type = argv._[0],
	src = config.mainSrc,
	srcType = argv.src,
    pageName = argv.page,
	pluginName = argv.plugin,
	base = argv.base,
	tagRoot = config.testRoot;
if (srcType) {
	switch (srcType.toLowerCase()) {
		case 'h5':
			src = config.h5Src;
			break;
		default:
			src = config.mainSrc;
	}
}
var exeTasks = function(arrStr, exeMethod) {
	var rstArr = arrStr.split(',').map(exeMethod),
		rst = [];
	rstArr.forEach(function(item) {
		rst.concat(item);
	});
	return merge.apply(null, rst);
};
gulp.task('core.totest:page', () => {
	var onePage = function(pageName) {
		var viewSrc = gulp.src(src.views + '/' + pageName + '.htm.php')
		.pipe(gulp.dest(
			path.join(tagRoot, path.relative(config.root, src.views))
		));

		var viewOnline = gulp.src(config.proDist.views + '/' + pageName + '.htm.php')
		.pipe(gulp.dest(
			path.join(tagRoot, path.relative(config.root, config.proDist.views))
		));

		var pageDev = gulp.src(config.devDist.path + '/' + pageName + '/**/*')
		.pipe(gulp.dest(
			path.join(tagRoot, '/asset/dev/', pageName)
		));

		var pageOnline = gulp.src(config.proDist.path + '/' + pageName + '/**/*')
		.pipe(gulp.dest(
			path.join(tagRoot, '/asset/' + config.proName + '/', pageName)
		));
		return [viewSrc, viewOnline, pageDev, pageOnline];
	};
	return exeTasks(pageName, onePage);
});
gulp.task('core.totest:plugin', () => {
	var onePlugin = function(pluginName) {
		var pluginDev = gulp.src(config.devDist.path + '/plugin/' + pluginName + '/**/*')
		.pipe(gulp.dest(
			path.join(tagRoot, '/asset/dev/plugin', pluginName)
		));

		var pluginOnline = gulp.src(config.proDist.path + '/plugin/' + pluginName + '/**/*')
		.pipe(gulp.dest(
			path.join(tagRoot, '/asset/' + config.proName + '/plugin', pluginName)
		));

		return [pluginDev, pluginOnline];
	}
	return exeTasks(pluginName, onePlugin);
});
gulp.task('core.totest:base', () => {
	return gulp.src(path.join(config.devDist.path, '/base/*.*'))
		.pipe(gulp.dest(
			path.join(tagRoot, '/asset/dev/base')
		));
});
gulp.task('core.totest', (cb) => {
	var arr = [];
	pageName && arr.push('core.totest:page'); // 指定页面
	pluginName && arr.push('core.totest:plugin'); // 指定plugin
	base && arr.push('core.totest:base'); // base
	Sequence.apply(null, [arr, cb]);
});
