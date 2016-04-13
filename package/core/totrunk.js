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
	base = argv.base,
	packageMod = argv.package,
    pluginName = argv.plugin,
	tagRoot = config.trunkRoot;
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
gulp.task('core.totrunk:page', () => {
	var onePage = function(pageName) {
		var view = gulp.src(src.views + '/' + pageName + '.htm.php')
		.pipe(gulp.dest(
			path.join(tagRoot, path.relative(config.root, src.views))
		));

		var pageLogic = gulp.src(src.path + '/' + pageName + '/**/*')
		.pipe(gulp.dest(
			path.join(tagRoot, path.relative(config.root, src.path), pageName)
		));
		return [view, pageLogic];
	};
	return exeTasks(pageName, onePage);
});
gulp.task('core.totrunk:base', () => {
	var src = config.mainSrc; // base 强制是 mainSrc
	return gulp.src(src.base + '/**/*')
		.pipe(gulp.dest(
			path.join(tagRoot, path.relative(config.root, src.base))
		));
});
gulp.task('core.totrunk:plugin', () => {
	var onePlugin = function(pluginName) {
		return gulp.src(src.plugin + '/' + pluginName + '/**/*')
		.pipe(gulp.dest(
			path.join(tagRoot, path.relative(config.root, src.plugin), pluginName)
		));
	};
	return exeTasks(pluginName, onePlugin);
});
gulp.task('core.totrunk:package', () => {
	var methods = gulp.src(config.root + '/package/**/*')
		.pipe(gulp.dest(
			path.join(tagRoot, 'package')
		));

	var mods = gulp.src(config.root + '/local_modules/**/*')
		.pipe(gulp.dest(
			path.join(tagRoot, 'local_modules')
		));

	var configFiles = gulp.src([config.root + '/gulpfile.babel.js', config.root + '/package.json'])
		.pipe(gulp.dest(tagRoot));

	return merge(methods, mods, configFiles);
});
gulp.task('core.totrunk', (cb) => {
	var arr = [];
	pageName && arr.push('core.totrunk:page'); // 指定页面
	base && arr.push('core.totrunk:base'); // base
	pluginName && arr.push('core.totrunk:plugin'); // 指定插件
	packageMod && arr.push('core.totrunk:package'); // 打包工具相关文件
	Sequence.apply(null, [arr, cb]);
});
