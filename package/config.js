/*
* @Author: dylan
* @Date:   2015-12-26 14:17:26
* @Last Modified by:   dylan
* @Last Modified time: 2016-01-10 10:22:09
*/
'use strict';

const path = require('path'),
    fs = require('fs'),
	root = path.resolve(__dirname, '../'),
	proName = 'joint';

/* 落地配置 */
// 这部分的配置，要根据使用者本地环境配置，所以请自定义。
// 涉及到：本地代理、部署到测试、部署到主干，这三项功能。
var	trunkRoot = '', // 主干 的绝对路径
	testRoot = '', // 测试环境 的绝对路径
	vhost = ''; // 该项目的虚拟主机名
const user = 'dylan';
switch (user) {
	case 'dylan': // 林文萍
		// trunkRoot = 'D:\\www\\meiyou\\192.168.0.234\\meiyou.wx.jaeapp.com\\trunk\\yunqi_api';
		trunkRoot = 'D:\\www\\meiyou\\192.168.0.234\\meiyou.wx.jaeapp.com\\branches\\branch-newzijian1.1\\yunqi_api';
		testRoot = 'D:\\www\\meiyou\\121.41.89.213\\h5.m.meiyou.com';
		vhost = '';//'dev.youzijie.com';
		break;
    case 'wulv': // 吴律
    // trunkRoot = 'D:\\www\\meiyou\\192.168.0.234\\meiyou.wx.jaeapp.com\\trunk\\yunqi_api';
    trunkRoot = 'D:\\WWW\\test.joint.meiyou.com\\trunk\\api';
    testRoot = 'D:\\WWW\\test.joint.meiyou.com\\trunk\\api';
    vhost = '';//'dev.youzijie.com';
    break;
	case 'liuyutong': // 刘禹彤
		trunkRoot = '/Users/xiaoyu/Documents/code/meetyou/joint/trunk/trunk/api';
		testRoot = '/Users/xiaoyu/Documents/code/meetyou/test/h5.m.meiyou.com';
        vhost = 'meiyou-zijian.com';
		// vhost = '';
		break;
	default:
		throw '请指定 user';
}
/*END：落地配置*/

var src =  {
	path: path.join(root, 'static-dev'),
	async: path.join(root, 'static-dev/async'),
    base: path.join(root, 'static-dev/base'),
	dev: path.join(root, 'static-dev/dev'),
    plugin: path.join(root, 'static-dev/plugin'),
    views: path.join(root, 'views_dev')
};

var devDist = {
    path: path.join(root, 'asset/dev'),
    publicPath: '/asset/dev/'
};

var proDist = {
    path: path.join(root, 'asset', proName),
    publicPath: '../asset/' + proName + '/',
    views: path.join(root, 'views')
};

var tmpDist = {
    path: path.join(root, 'asset/.tmp'),
    views: path.join(root, '.tmp_views')
};

const yargs = require('yargs');
var argv = yargs.argv,
    type = argv._[0],
	dist = devDist,
	asyncHot = !!argv.async,
    hot = argv.h; // HMR(hot module replace)

switch(type) {
	case 'build':
		dist = proDist;
		// throw 'You can not use "gulp build" now.';
		// break;
    case 'dev':
    case 'base':
	// case 'totest':
	// case 'totrunk':
	case 'new':
		break;
	default:
		throw 'Error commond';
}

var config = {
	root: root,
	trunkRoot: trunkRoot,
	testRoot: testRoot,
	proName: proName,
	vhost: vhost,
    type: type,
    hot: hot,
	asyncHot: asyncHot,
    modDir: path.resolve(__dirname, './method_mod'),
    // src
    src: src,
    // dist
	dist: dist, // core.base & core.webapck 会用到
    devDist: devDist,
    proDist: proDist,
    tmpDist: tmpDist,
};
module.exports = config;
