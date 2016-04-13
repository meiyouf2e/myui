var gulp = require('gulp'),
	path = require('path'),
	Tools = require('../tools.js'),
	config = require('../config.js'),
	modPath = path.join(config.modDir, 'init');
const yargs = require('yargs');
var argv = yargs.argv,
	type = argv._[0],
    pageName = argv.page,
    pluginName = argv.plugin,
	asyncName = argv.async;
if (type === 'new') {
	if (pageName === undefined && pluginName === undefined && asyncName === undefined) {
		throw '"gulp new" should be used like this: gulp new --{page, plugin, async} name';
	}
	var fileTree = {},
	name = pageName || pluginName || asyncName;
	if (pageName != undefined) {
		fileTree =  {
			'static-dev': {
				'dev': {}
			},
			'views_dev': {
			}
		};
		fileTree['static-dev']['dev'][name] = {
			'css': {
				'index.scss': Tools.getFileContent(modPath + '/page.scss')
			},
			'js': {
				'index.js': Tools.getFileContent(modPath + '/page.js')
			},
			'img': {}
		};
		fileTree['views_dev'][name + '.html'] = Tools.getFileContent(modPath + '/demo.html').replace(/\/demo\/index/g, '/' + name + '/index');
	} else if(pluginName != undefined) {
		fileTree = {
			'static-dev': {
				'plugin': {}
			}
		};
		Tools.createPlugin(modPath, fileTree, name);
	} else {
		fileTree = {
			'static-dev': {
				'async': {}
			}
		};
		Tools.createAsync(modPath, fileTree, name);
	}
}

gulp.task('core.new', function() {
	Tools.createFileTree(fileTree, './');
});
