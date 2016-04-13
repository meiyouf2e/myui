const gulp = require('gulp'),
	path = require('path'),
	Sequence = require('gulp-sequence'),
	merge = require('merge-stream'),
	Htmlone = require('my-htmlone'),
	Prefix = require('gulp-prefix'),
	config = require('../config.js'),
	SRC = config.src,
	DEV_DIST = config.devDist,
	TMP_DIST = config.tmpDist,
	DIST = config.proDist;

gulp.task('core.build:copyViewsToTmp', () => {
	// 之所以没有直接 copy 到 dist, 因为htmlone只对这些文件进行处理。
	return gulp.src(SRC.views + '/*.*')
		.pipe(gulp.dest(TMP_DIST.views));
});

gulp.task('core.build:copyRstToTag', () => {
	var staticSrc = gulp.src(TMP_DIST.path + '/**/*')
		.pipe(gulp.dest(DIST.path));
	var views = gulp.src(TMP_DIST.views + '/*.*')
		.pipe(gulp.dest(DIST.views));
	return merge(staticSrc, views);
});

var relativePath = path.relative(TMP_DIST.views, DIST.path).split(path.sep).join('/'); // 分级符号，统一为/，以符合网址的格式;
// replace url before we use hmtlone plugin
gulp.task('core.build:fixBeforeOne', () => {
	return gulp.src(TMP_DIST.views + '/*.*')
		.pipe(Prefix(function(uri) {
			var pre = relativePath,
				reg = new RegExp('../asset/(' + config.proName + '|dev)');
          uri.path = uri.path.replace(reg, '');
          return pre; // 最终路径：原uri.path -> pre + uri.path
      }))
      .pipe(gulp.dest(TMP_DIST.views));
});

//  html rebase after htmlone
gulp.task('core.build:fixAfterOne', () => {
  return gulp.src(TMP_DIST.views + '/*.*')
      .pipe(Prefix(function(uri) {
      	var pre = DIST.publicPath,
			reg = relativePath;
        uri.path = uri.path.replace(reg, '');
        return pre; // 最终路径：原uri.path -> pre + uri.path
      }))
      .pipe(gulp.dest(TMP_DIST.views));
});

// htmlone
gulp.task('core.build:htmlone', () => {
	return gulp.src(TMP_DIST.views + '/*.*')
		.pipe(Htmlone({
			forceKeeplive: true, // 强制不内嵌，为true时，keepliveSelector无效。默认 false
			removeSelector: '[will-remove]', // selector 配置，源文档中符合这个selector的标签将自动移除
			keepliveSelector: '[keeplive]', // 不要combo的selector配置，源文档中符合这个selector的将保持原状，同时，会为其中的文件名加入长度为5的md5
			cssminify: false, // 是否需要压缩css，默认 true. 因为在 webpack已经压缩了，所以这里就用 false.
			jsminify: false, // 是否需要压缩js，默认 true. 因为在 webpack已经压缩了，所以这里就用 false.
			md5Type: ['js', 'css'], // 需要加 md5 的类型，支持： 'js', 'css', 'img'. 默认，['js', 'css', 'img']
			// function, 修改css文件中，相对url的路径。
			// fixCssRelaPath: function(url) {
			// 	return url.replace(/\\/g, '/').replace('/static/', '/haha/css/');
			// },
			// 完成编译后，修改html中引用的 js&css&img的相对路径。【物理上fix, 改到了文件中】
			// fixHtmlRelaPath: function(url) {
			// 	return config.dist.publicPath + url.replace('/asset/dev/', '');
			// }
		}))
		.pipe(gulp.dest(config.tmpDist.views));
});

gulp.task('core.build', (cb) => {
	var arr = [
			['core.clean:tmp', 'core.clean:pro'],
			['core.base', 'core.webpack'],
			'core.build:copyViewsToTmp',
			'core.build:fixBeforeOne',
			'core.build:htmlone',
			'core.build:fixAfterOne',
			'core.build:copyRstToTag',
			'core.clean:tmp',
			cb
		];
	Sequence.apply(null, arr);
});
