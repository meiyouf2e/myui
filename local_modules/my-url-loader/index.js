/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var urlLoader = require("url-loader");
module.exports = function(content) {
	var rp = this.resourcePath.replace(/\\/g, '/'),
		contextStr = '';
	if (rp.indexOf('/H5/') > -1) {
		contextStr = './H5/';
	} else if(rp.indexOf('/static-dev/dev/') > -1) {
		contextStr = './static-dev/dev/';
	} else if(rp.indexOf('/static-dev/plugin/') > -1) {
		contextStr = './static-dev/';
	}
	contextStr && (this.query += '&context=' + contextStr);
	return urlLoader.call(this, content);
}
module.exports.raw = true;
