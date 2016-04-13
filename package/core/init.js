var gulp = require('gulp'),
	path = require('path'),
	Tools = require('../tools.js'),
	config = require('../config.js'),
	modPath = path.join(config.modDir, 'init');
var fileTree = {
	'static-dev': {
		'base': {
			'css': {
				'vendor': {}
			},
			'img': {},
			'js': {
				'vendor': {}
			}
		},
		'dev': {
			'demo': {
				'css': {
					'index.scss': Tools.getFileContent(modPath + '/page.scss')
				},
				'js': {
					'index.js': Tools.getFileContent(modPath + '/page.js')
				},
				'img': {}
			}
		},
		'plugin': {
			'plugin0': {
				'img': {},
				'plugin0.scss': Tools.getFileContent(modPath + '/plugin.scss').replace(/xxx/g, 'plugin0'),
				'index.js': Tools.getFileContent(modPath + '/plugin.js').replace(/xxx/g, 'plugin0').replace(/Xxx/g, Tools.upperFirstLetter('plugin0'))
			}
		}
	},
	'views_dev': {
		'demo.html': Tools.getFileContent(modPath + '/demo.html')
	}
};
gulp.task('core.init', function() {
	Tools.createFileTree(fileTree, './');
});
