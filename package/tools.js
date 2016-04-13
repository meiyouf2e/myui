const fs = require('fs'),
	path = require('path');

var Tools = function() {};

Tools.prototype = {
	// 获取指定文件路径的，最后一级文件夹的名字
	getLastDirName: function(fullPath) {
		var dirPath = path.dirname(fullPath);
		return path.basename(dirPath);
	},
	// 获取指定目录下，子级文件夹名字集合
	getDirNameList: function(dirPath) {
		return fs.readdirSync(dirPath).filter(function(file) {
			return fs.statSync(path.join(dirPath, file)).isDirectory();
		});
	},
	getFileContent: function(filePath) {
		return fs.readFileSync(filePath, 'utf-8');
	},
	createFile: function(filePath, content) {
		fs.writeFile(filePath, content, (err) => {
			if (err) throw err;
		});
	},
	createDir: function(dirPath) {
		try {
			fs.mkdirSync(dirPath);
		} catch (e) {
			if (e.code != 'EEXIST') throw e;
		}
	},
	createFileTree: function(treeObj, basePath) {
		var self = this;
		(function fn(tree, basePath) {
			if (typeof tree === 'object') { // folder
				for (var dir in tree) {
					var v = tree[dir],
						curPath = basePath + dir;
					if (typeof v === 'object') { // folder
						self.createDir(curPath);
						if (Object.keys(v).length > 0) { // not empty
							fn(v, curPath + '/');
						}
					} else { // file
						self.createFile(curPath, v);
					}
				}
			} else { // file
				self.createFile(basePath + tree, v);
			}
			return;
		})(treeObj, basePath || './');
	},
	createPlugin: function(modPath, fileTree, pluginName) {
		var self = this,
			name = pluginName;
		fileTree['static-dev']['plugin'][name] = {};
		fileTree['static-dev']['plugin'][name]['img'] = {};
		fileTree['static-dev']['plugin'][name][name + '.scss'] = self.getFileContent(
			modPath + '/plugin.scss').replace(/xxx/g, name);
		fileTree['static-dev']['plugin'][name]['index.js'] = self.getFileContent(
			modPath + '/plugin.js').replace(/xxx/g, name).replace(/Xxx/g, self.upperFirstLetter(
			name));
		return fileTree;
	},
	createAsync: function(modPath, fileTree, asyncName) {
		var self = this,
			name = asyncName;
		fileTree['static-dev']['async'][name] = {};
		fileTree['static-dev']['async'][name]['img'] = {};
		fileTree['static-dev']['async'][name][name + '.scss'] = self.getFileContent(
			modPath + '/async.scss').replace(/xxx/g, name);
		fileTree['static-dev']['async'][name]['index.js'] = self.getFileContent(
			modPath + '/async_index.js').replace(/xxx/g, name).replace(/Xxx/g, self.upperFirstLetter(
			name));
		fileTree['static-dev']['async'][name]['async.js'] = self.getFileContent(
			modPath + '/async.js').replace(/xxx/g, name).replace(/Xxx/g, self.upperFirstLetter(
			name));
		return fileTree;
	},
	upperFirstLetter: function(string) {
		string += '';
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	deepCopy: function(srcObj) {
		var class2type = {},
	    	toString = class2type.toString,
			rstObj = {};
		function type(obj) {
			return obj == null ? String(obj) :
				class2type[toString.call(obj)] || "object"
		}

		function isObject(obj) {
			return type(obj) == "object"
		}

		function isPlainObject(obj) {
			return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype
		}

		(function extend(target, source, deep) {
			for (key in source)
				if (deep && (isPlainObject(source[key]) || Array.isArray(source[key]))) {
					if (isPlainObject(source[key]) && !isPlainObject(target[key]))
						target[key] = {}
					if (Array.isArray(source[key]) && !Array.isArray(target[key]))
						target[key] = []
					extend(target[key], source[key], deep)
				} else if (source[key] !== undefined) target[key] = source[key]
		})(rstObj, srcObj, true);
		return rstObj;
	}
};

module.exports = new Tools();
