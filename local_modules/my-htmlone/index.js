/*
 * 修改了 gulp-htmlone, 加入md5功能。
 * md5支持，css, js, img. 其中，img单纯的加入md5，没有进行8k转base64的处理。
 * md5的处理中，会把文件名修改。所以一旦对单个文件的引用，有一者使用keeplive，后面要内嵌会找不到文件的错误。
 */
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

var cheerio = require('cheerio');
var uglify = require('uglify-js');
var cssmin = require('ycssmin').cssmin;
var fs = require('fs');
var fsutil = require('fsmore');
var url = require('url');
var http = require('http');
var coimport = require('coimport');
var crypto = require('crypto');


var PluginError = gutil.PluginError;
var pluginName = 'gulp-htmlone';
var TEMP_DIR = 'htmlone_temp';
var reg_http = /^(\s+)?(http(s)?\:)?\/\//;
var no_protocol = /^(\s+)?\/\//;
var data_url = /^data:/;
var localParten = new RegExp('\\.\/');
var forceKeeplive = false,
	fixHtmlRelaPath = null; // function, 修改html中引用的 js&css&img的相对路径。 function(url) { return tagUrl;}

function extend(dest, source, isOverwrite) {
    if (isOverwrite == undefined) isOverwrite = true;
    for (var k in source) {
        if (!(k in dest) || isOverwrite) {
            dest[k] = source[k]
        }
    }
    return dest;
}

var Md5 = {
    listObj: {},
    add: function(htmlpath, filepath) {
        var self = this,
            rst = '';
        if (filepath in self.listObj) {
            rst = self.listObj[filepath];
        } else {
            var extname = path.extname(filepath),
                filename = path.basename(filepath, extname); // ../my/path/name.ext -> name
            var absSrc = path.join(path.dirname(htmlpath), filepath);
            if (fs.lstatSync(absSrc).isFile()) {
                var d = '_' + self.calcMd5(absSrc, 5),
                    tagFilename = filename + d + extname,
                    tagAbsSrc = path.join(path.dirname(absSrc), tagFilename);
                rst = path.join(path.dirname(filepath), tagFilename);
				if (!reg_http.test(rst) && fixHtmlRelaPath) {
					rst = fixHtmlRelaPath(rst);
				}
                fs.rename(absSrc, tagAbsSrc, function(err) {
                    if (err) throw err;
                });
                self.listObj[filepath] = rst;
            } else {
                console.log('"' + src + '" in "' + htmlpath + '" is an invalid file or url!');
            }
        }
        return rst;
    },
    calcMd5: function(filepath, size) {
        var md5 = crypto.createHash('md5');
        md5.update(fs.readFileSync(filepath, 'utf-8'));

        return size > 0 ? md5.digest('hex').slice(0, size) : md5.digest('hex');
    }
};

// js process
var JsProcessor = function($, options, cb) {
	var needMd5 = options.md5Type.indexOf('js') > -1;
    this.doneJs = 0;
    this.isDone = false;
    this.cb = cb;
    this.options = options;
    this.$js = $('script');
    this.$ = $;

    var js = this.$js;
    var me = this;
    var htmlpath = options.htmlpath;
    var comboParten = new RegExp('\\?\\?');
    var comboScriptEl;

    if (js.length === 0) {
        this.isDone = true;
        this.cb && this.cb();
    } else {
        js.each(function(i, el) {
            var $el = $(this);
            var src = $(this).attr('src');
            var type = $(this).attr('type');
            var oldCon = $(this).html();
            var newCon = '\n';
            var isKeeplive = $el.is(options.keepliveSelector);

            if ((!type || type === 'text/javascript') && !!src) {
                if (forceKeeplive || isKeeplive) { // 不内嵌
                    if(comboParten.test(src)) {
                        comboScriptEl = el;
                    }
                    if(localParten.test(src)) {
						if (me.options.jsminify && typeof Md5.listObj[src] === 'undefined') {
							var jssrc = path.join(path.dirname(htmlpath), src);
							me.__minify(jssrc);
						}
                        $el.attr('src', needMd5 ? Md5.add(htmlpath, src) : src);
                    }
                    me.__checkJsDone();
                } else if (!reg_http.test(src)) {
                    var jssrc = path.join(path.dirname(htmlpath), src);
                    if (fs.lstatSync(jssrc).isFile()) {
                        newCon += fs.readFileSync(jssrc, {
                            encoding: 'utf8'
                        });
                        me.__minifyAndReplace($el, newCon);
                        me.__checkJsDone();
                    } else {
                        console.log('"' + src + '" in "' + htmlpath + '" is an invalid file or url!');
                    }
                }
            } else {
                me.__checkJsDone();
            }

        });
    }
};
JsProcessor.prototype = {
	__minify: function(jsPath) {
		if (fs.lstatSync(jsPath).isFile()) {
			var rst = uglify.minify(jsPath, {
				mangle: true
			});
			fs.writeFileSync(jsPath, rst.code);
		} else {
			throw 'Can\'t found ' + jsPath;
		}
	},
    __minifyAndReplace: function($el, jscon) {
        if (this.options.jsminify) {
            jscon = uglify.minify(jscon, {
                fromString: true,
                mangle: true
            }).code.replace(/\<\/script\>/g, '\\x3c/script>');
        }

        // do not use .html()
        $el.empty().removeAttr('src');
        var replaceStr = this.$.html($el).replace(/<\/script>/i, '') + jscon + '</script>';
        $el.replaceWith(replaceStr);
    },
    __checkJsDone: function() {
        this.doneJs++;
        if (this.doneJs === this.$js.length) {
            this.isDone = true;
            this.cb && this.cb();
        }
    }
};


// css processor
var CssProcessor = function($, options, cb) {
	var needMd5 = options.md5Type.indexOf('css') > -1;
    this._done = 0;
    this.options = options;
    this.cb = cb;

    this.$ = $;
    this.$css = $('link[rel=stylesheet]');
    this.fixCssRelaPath = options.fixCssRelaPath;

    var css = this.$css;
    var htmlpath = options.htmlpath;
    var me = this;

    if (css.length === 0) {
        this.isDone = true;
        this.cb && this.cb();
    } else {
        css.each(function(i, el) {
            var href = $(this).attr('href');
            var newCon = '\n';
            var $css = $(this);
            var isKeeplive = $(this).is(options.keepliveSelector);

            if (!isKeeplive && !forceKeeplive) {
                if (!reg_http.test(href)) {
                    var csshref = path.join(path.dirname(htmlpath), href);
                    if (fs.lstatSync(csshref).isFile()) {
                        newCon += (fs.readFileSync(csshref, {
                            encoding: 'utf8'
                        }) + '\n');
                        me.__cssMinifyAndReplace($css, csshref, newCon);
                    } else {
                        console.log('"' + href + '" in "' + htmlpath + '" is an invalid file or url!');
                    }
                }
            } else {
				if (me.options.cssminify && typeof Md5.listObj[href] === 'undefined') {
					var cssHref = path.join(path.dirname(htmlpath), href);
					me.__cssMinify(cssHref);
				}
                $css.attr('href', needMd5 ? Md5.add(htmlpath, href) : href);
                me._done++;
                me._checkCssDone();
            }

        });
    }
};
CssProcessor.prototype = {
    _checkCssDone: function() {
        if (this._done === this.$css.length) {
            this.isDone = true;
            this.cb && this.cb();
        }
    },
	__cssMinify: function(cssPath) {
		var me = this;
		if (fs.lstatSync(cssPath).isFile()) {
			var rst = fs.readFileSync(cssPath, {
				encoding: 'utf8'
			});
			if (me.fixCssRelaPath) {
				rst = me.fixAssetsPath(cssPath, rst);
			}
			fs.writeFileSync(cssPath, cssmin(rst));
		} else {
			throw 'Can\'t found ' + cssPath;
		}
	},
    __cssMinifyAndReplace: function($css, sourcePath, cssCon) {
        var $ = this.$;
        var me = this;
        if (this.options.cssminify) {
            cssCon = cssmin(cssCon);
        }
		if (me.fixCssRelaPath) {
			cssCon = me.fixAssetsPath(sourcePath, cssCon);
		}
        var style = $('<style>' + cssCon + '</style>');
        $css.replaceWith(style);
        this._done++;
        this._checkCssDone();
    },
    fixAssetsPath: function(sourcePath, cssStr) {
        var me = this;
        // fix relative path or `url`
        cssStr = cssStr.replace(/url\(\s*([\S^\)]+)\s*\)/g, function(c, d) {
            if (reg_http.test(d) || data_url.test(d)) return c;
			d = me.fixCssRelaPath(d);
            return 'url(' + d + ')';
        });
        return cssStr;
    }
};


// img processor
var ImgProcessor = function($, options, cb) {
	var needMd5 = options.md5Type.indexOf('img') > -1;
    this._done = 0;
    this.options = options;
    this.cb = cb;

    this.$ = $;
    this.$img = $('img');

    var img = this.$img;
    var htmlpath = options.htmlpath;
    var me = this;

    if (img.length === 0) {
        this.isDone = true;
        this.cb && this.cb();
    } else {
        img.each(function(i, el) {
            var src = $(this).attr('src');
            var newCon = '\n';
            var $img = $(this);
            var isKeeplive = $(this).is(options.keepliveSelector);
            !reg_http.test(src) && localParten.test(src) && $img.attr('src', needMd5 ? Md5.add(htmlpath, src) : src);
            me._done++;
            me._checkImgDone();
        });
    }
};
ImgProcessor.prototype = {
    _checkImgDone: function() {
        if (this._done === this.$img.length) {
            this.isDone = true;
            this.cb && this.cb();
        }
    }
};

var dealScripts = function(htmlpath, htmlFrag, options, cb) {

    //console.log(htmlFrag, options);
    var $ = cheerio.load(htmlFrag, {
        decodeEntities: false,
        normalizeWhitespace: false
    });
    if (options.removeSelector) {
        $(options.removeSelector).remove();
    }
    options.htmlpath = htmlpath;

    // deal js
    var todownloadCss = 0;
    var downloadedCss = 0;
    var isJsDone = false;
    var isCssDone = false;
    var isImgDone = false;

    var __checkAllDone = function() {
        if (isJsDone && isCssDone && isImgDone) {
            cb && cb($.html());
        }
    };


    var jser = new JsProcessor($, options, function() {
        isJsDone = true;
        __checkAllDone();
    });

    // deal css
    var csser = new CssProcessor($, options, function() {
        isCssDone = true;
        __checkAllDone();
    });

    // deal img
    var imger = new ImgProcessor($, options, function() {
        isImgDone = true;
        __checkAllDone();
    });

};

function getFileName(src) {
    var name = src.match(/(build|dest|dist)\/(.*)/);
    if(name && name[2]){
        name = name[2];
        name = name.replace(/\.debug/g,'').replace(/"/,'');
    } else {
        // 如果不在生成的目录，则直接取最终文件名
        name = src.match(/[^\/]*\.js$/);
        if (name && name[0]) {
            name = name[0];
        }
    }
    name = name || '';
    return name;
}

process.on('exit', function(code) {
  // clean before exit
  fsutil.rmdirSync('./' + TEMP_DIR + '/');
});

module.exports = function(opt) {

    var options = extend({
		forceKeeplive: false,
        removeSelector: '[will-remove]',
        keepliveSelector: '[keeplive]',
        fixCssRelaPath: null, // function, 修改url中的相对路径
		fixHtmlRelaPath: null, // function, 修改html中 js&css&img的相对路径
		md5Type: ['js', 'css', 'img'], // 需要加 md5 的类型，支持： 'js', 'css', 'img'
        coimport: true,
        cssminify: true,
        jsminify: true
    }, (opt || {}));
	forceKeeplive = options.forceKeeplive;
	fixHtmlRelaPath = options.fixHtmlRelaPath;
    var _todo = 0;
    var _done = 0;

    function transform(file, enc, cb) {
        if (file.isNull()) return cb(null, file);
        if (file.isStream()) return cb(new PluginError(pluginName, 'Streaming not supported'));

        var data;
        var str = file.contents.toString('utf8');
        var filepath = file.path;

        _todo++;
        dealScripts(filepath, str, options, function(html) {
            file.contents = new Buffer(html);
            cb(null, file);

            _done++;
            if (_done === _todo) {
                gutil.log(gutil.colors.cyan('>> ' + path.basename(filepath) + ' done!'));
            }
        });
    }

    return through.obj(transform);
}
