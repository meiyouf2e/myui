const config = require('./config.js'),
    path = require('path'),
	fs = require('fs'),
    Tools = require('./tools.js');
var webpackConfig = Tools.deepCopy(require('./webpack.config.js'));

/*
 * 获取 Entry Map: 页面独立打包 Entry
 */
function getEntryMap(src) {
    var enteryMap = {};
    // H5页面 Entry
    var jsDirList = Tools.getDirNameList(src);

    jsDirList.forEach(function(name) {
        var entry = name,
			entryPath = path.join(src, name, 'async.js');
		enteryMap['async/' + name] = entryPath;
    });
    return enteryMap;
};

module.exports = function(src) {
    webpackConfig.entry = getEntryMap(src);
	webpackConfig.output.filename = '[name].js';
	webpackConfig.module.loaders.forEach(function(loader) {
		if (loader.test.toString().indexOf('.css$') > -1) {
			loader.loader = 'style!css';
		} else if (loader.test.toString().indexOf('.scss$') > -1) {
			loader.loader = 'style!css!sass?outputStyle=expanded';
		}
	});
    return webpackConfig;
};
