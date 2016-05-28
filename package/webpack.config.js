/*
 * @Author: dylan
 * @Date:   2015-11-12 15:44:00
 * @Last Modified by:   dylan
 * @Last Modified time: 2016-01-10 11:08:11
 */

'use strict';
const path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    config = require('./config.js'),
	SRC = config.src,
	DIST = config.devDist,
    Tools = require('./tools.js'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");
// var md5 = config.md5 ? '_[chunkhash:5]' : '',
var md5 = '', // css && js 的 md5 交给gulp处理
    cssExtract = new ExtractTextPlugin('css', '[name]/index' + md5 + '.css');
var plugins = [cssExtract];
config.type === 'build' && plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = {
    output: {
        path: DIST.path, // 文件生成路径
        publicPath: DIST.publicPath, // html/css/js中，文件引用路径的基准
        filename: '[name]/index' + md5 + '.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: cssExtract.extract('css')
        }, {
            test: /\.scss$/,
            // loader: cssExtract.extract('css!compass?outputStyle=expanded')
            loader: cssExtract.extract('css!sass?outputStyle=expanded')
		}, {
            test: /\.jsx?$/i,
            loader: 'babel',
            exclude:['./node_modules'],
            query: {
                presets: ['react', 'es2015'] // 执行环境：react, 如果需要支持es2015, 那需要npm install babel-preset-es2015 -D
            }
        }, {
			test: /\.md$/i,
			loader: 'raw'
		}, {
            test: /\.json$/,
            loader: 'json'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.scss'],
        alias: { // 路径配置
            'plugin': SRC.plugin,
            'base': SRC.base,
            'async': SRC.async
        }
    },
    plugins: plugins
};
