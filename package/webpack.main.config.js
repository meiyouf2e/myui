const config = require('./config.js'),
    path = require('path'),
	fs = require('fs'),
    Tools = require('./tools.js');
var webpackConfig = Tools.deepCopy(require('./webpack.config.js')),
    md5 = config.md5 ? '_[hash:5]' : '';

/*
 * 获取 Entry Map
 */
function getEntryMap(src) {
	var enteryMap = {};
    var jsDirList = Tools.getDirNameList(src);

    jsDirList.forEach(function(name) {
        var entry = name,
            entryPath = path.resolve(src, name + '/js/index.js');
        enteryMap[entry] = entryPath;
    });
    return enteryMap;
};

module.exports = function(src) {
    webpackConfig.entry = getEntryMap(src);
    return webpackConfig;
};
