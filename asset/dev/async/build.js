/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/asset/dev/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(5);

	var ReactMarkdown = __webpack_require__(7),
	    md = __webpack_require__(65);

	window.AsyncBuild = React.createClass({
		displayName: 'AsyncBuild',
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'async-build' },
				React.createElement(ReactMarkdown, { source: md })
			);
		}
	});

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(6);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js?outputStyle=expanded!./build.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js?outputStyle=expanded!./build.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "@charset \"UTF-8\";\n/* 色系 */\n/* 几行文字 */\n.async-build {\n  font-size: 14px;\n}\n\n.async-build h2,\n.async-build h3 {\n  font-weight: bold;\n}\n\n.async-build h2 {\n  font-size: 1.5em;\n  margin: 0.83em 0;\n}\n\n.async-build h3 {\n  font-size: 1.17em;\n  margin: 1em 0;\n}\n\n.async-build p {\n  margin: 1em 0;\n}\n\n.async-build ol {\n  list-style-type: decimal;\n  padding-left: 40px;\n}\n\n.async-build pre {\n  display: block;\n  overflow-x: auto;\n  padding: 0.5em;\n  color: #333;\n  background: #f8f8f8;\n}\n\n.async-build pre code {\n  padding: 0;\n}\n\n.async-build code {\n  color: #333;\n  background: #f8f8f8;\n  padding: 0 .5em;\n}\n", ""]);

	// exports


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(8);
	var Parser = __webpack_require__(39).Parser;
	var ReactRenderer = __webpack_require__(59);

	var parser = new Parser();
	var propTypes = React.PropTypes;

	var ReactMarkdown = React.createClass({
	    displayName: 'ReactMarkdown',

	    propTypes: {
	        className: propTypes.string,
	        containerProps: propTypes.object,
	        source: propTypes.string.isRequired,
	        containerTagName: propTypes.string,
	        childBefore: propTypes.object,
	        childAfter: propTypes.object,
	        sourcePos: propTypes.bool,
	        escapeHtml: propTypes.bool,
	        skipHtml: propTypes.bool,
	        softBreak: propTypes.string,
	        allowNode: propTypes.func,
	        allowedTypes: propTypes.array,
	        disallowedTypes: propTypes.array,
	        transformLinkUri: propTypes.func,
	        unwrapDisallowed: propTypes.bool,
	        renderers: propTypes.object,
	        walker: propTypes.func
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {
	            containerTagName: 'div'
	        };
	    },

	    render: function render() {
	        var containerProps = this.props.containerProps || {};
	        var renderer = new ReactRenderer(this.props);
	        var ast = parser.parse(this.props.source || '');

	        if (this.props.walker) {
	            var walker = ast.walker();
	            var event;

	            while (event = walker.next()) {
	                this.props.walker.call(this, event);
	            }
	        }

	        if (this.props.className) {
	            containerProps.className = this.props.className;
	        }

	        return React.createElement.apply(React, [this.props.containerTagName, containerProps, this.props.childBefore].concat(renderer.render(ast).concat([this.props.childAfter])));
	    }
	});

	ReactMarkdown.types = ReactRenderer.types;
	ReactMarkdown.renderers = ReactRenderer.renderers;
	ReactMarkdown.uriTransformer = ReactRenderer.uriTransformer;

	module.exports = ReactMarkdown;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(9);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule React
	 */

	'use strict';

	var _assign = __webpack_require__(11);

	var ReactChildren = __webpack_require__(12);
	var ReactComponent = __webpack_require__(22);
	var ReactClass = __webpack_require__(28);
	var ReactDOMFactories = __webpack_require__(33);
	var ReactElement = __webpack_require__(15);
	var ReactElementValidator = __webpack_require__(34);
	var ReactPropTypes = __webpack_require__(36);
	var ReactVersion = __webpack_require__(37);

	var onlyChild = __webpack_require__(38);
	var warning = __webpack_require__(17);

	var createElement = ReactElement.createElement;
	var createFactory = ReactElement.createFactory;
	var cloneElement = ReactElement.cloneElement;

	if (process.env.NODE_ENV !== 'production') {
	  createElement = ReactElementValidator.createElement;
	  createFactory = ReactElementValidator.createFactory;
	  cloneElement = ReactElementValidator.cloneElement;
	}

	var __spread = _assign;

	if (process.env.NODE_ENV !== 'production') {
	  var warned = false;
	  __spread = function __spread() {
	    process.env.NODE_ENV !== 'production' ? warning(warned, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.') : void 0;
	    warned = true;
	    return _assign.apply(null, arguments);
	  };
	}

	var React = {

	  // Modern

	  Children: {
	    map: ReactChildren.map,
	    forEach: ReactChildren.forEach,
	    count: ReactChildren.count,
	    toArray: ReactChildren.toArray,
	    only: onlyChild
	  },

	  Component: ReactComponent,

	  createElement: createElement,
	  cloneElement: cloneElement,
	  isValidElement: ReactElement.isValidElement,

	  // Classic

	  PropTypes: ReactPropTypes,
	  createClass: ReactClass.createClass,
	  createFactory: createFactory,
	  createMixin: function createMixin(mixin) {
	    // Currently a noop. Will be used to validate and trace mixins.
	    return mixin;
	  },

	  // This looks DOM specific but these are actually isomorphic helpers
	  // since they are just generating DOM strings.
	  DOM: ReactDOMFactories,

	  version: ReactVersion,

	  // Deprecated hook for JSX spread, don't use this for anything.
	  __spread: __spread
	};

	module.exports = React;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactChildren
	 */

	'use strict';

	var PooledClass = __webpack_require__(13);
	var ReactElement = __webpack_require__(15);

	var emptyFunction = __webpack_require__(18);
	var traverseAllChildren = __webpack_require__(20);

	var twoArgumentPooler = PooledClass.twoArgumentPooler;
	var fourArgumentPooler = PooledClass.fourArgumentPooler;

	var userProvidedKeyEscapeRegex = /\/+/g;
	function escapeUserProvidedKey(text) {
	  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
	}

	/**
	 * PooledClass representing the bookkeeping associated with performing a child
	 * traversal. Allows avoiding binding callbacks.
	 *
	 * @constructor ForEachBookKeeping
	 * @param {!function} forEachFunction Function to perform traversal with.
	 * @param {?*} forEachContext Context to perform context with.
	 */
	function ForEachBookKeeping(forEachFunction, forEachContext) {
	  this.func = forEachFunction;
	  this.context = forEachContext;
	  this.count = 0;
	}
	ForEachBookKeeping.prototype.destructor = function () {
	  this.func = null;
	  this.context = null;
	  this.count = 0;
	};
	PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

	function forEachSingleChild(bookKeeping, child, name) {
	  var func = bookKeeping.func;
	  var context = bookKeeping.context;

	  func.call(context, child, bookKeeping.count++);
	}

	/**
	 * Iterates through children that are typically specified as `props.children`.
	 *
	 * The provided forEachFunc(child, index) will be called for each
	 * leaf child.
	 *
	 * @param {?*} children Children tree container.
	 * @param {function(*, int)} forEachFunc
	 * @param {*} forEachContext Context for forEachContext.
	 */
	function forEachChildren(children, forEachFunc, forEachContext) {
	  if (children == null) {
	    return children;
	  }
	  var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
	  traverseAllChildren(children, forEachSingleChild, traverseContext);
	  ForEachBookKeeping.release(traverseContext);
	}

	/**
	 * PooledClass representing the bookkeeping associated with performing a child
	 * mapping. Allows avoiding binding callbacks.
	 *
	 * @constructor MapBookKeeping
	 * @param {!*} mapResult Object containing the ordered map of results.
	 * @param {!function} mapFunction Function to perform mapping with.
	 * @param {?*} mapContext Context to perform mapping with.
	 */
	function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
	  this.result = mapResult;
	  this.keyPrefix = keyPrefix;
	  this.func = mapFunction;
	  this.context = mapContext;
	  this.count = 0;
	}
	MapBookKeeping.prototype.destructor = function () {
	  this.result = null;
	  this.keyPrefix = null;
	  this.func = null;
	  this.context = null;
	  this.count = 0;
	};
	PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);

	function mapSingleChildIntoContext(bookKeeping, child, childKey) {
	  var result = bookKeeping.result;
	  var keyPrefix = bookKeeping.keyPrefix;
	  var func = bookKeeping.func;
	  var context = bookKeeping.context;

	  var mappedChild = func.call(context, child, bookKeeping.count++);
	  if (Array.isArray(mappedChild)) {
	    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
	  } else if (mappedChild != null) {
	    if (ReactElement.isValidElement(mappedChild)) {
	      mappedChild = ReactElement.cloneAndReplaceKey(mappedChild,
	      // Keep both the (mapped) and old keys if they differ, just as
	      // traverseAllChildren used to do for objects as children
	      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
	    }
	    result.push(mappedChild);
	  }
	}

	function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
	  var escapedPrefix = '';
	  if (prefix != null) {
	    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
	  }
	  var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
	  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
	  MapBookKeeping.release(traverseContext);
	}

	/**
	 * Maps children that are typically specified as `props.children`.
	 *
	 * The provided mapFunction(child, key, index) will be called for each
	 * leaf child.
	 *
	 * @param {?*} children Children tree container.
	 * @param {function(*, int)} func The map function.
	 * @param {*} context Context for mapFunction.
	 * @return {object} Object containing the ordered map of results.
	 */
	function mapChildren(children, func, context) {
	  if (children == null) {
	    return children;
	  }
	  var result = [];
	  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
	  return result;
	}

	function forEachSingleChildDummy(traverseContext, child, name) {
	  return null;
	}

	/**
	 * Count the number of children that are typically specified as
	 * `props.children`.
	 *
	 * @param {?*} children Children tree container.
	 * @return {number} The number of children.
	 */
	function countChildren(children, context) {
	  return traverseAllChildren(children, forEachSingleChildDummy, null);
	}

	/**
	 * Flatten a children object (typically specified as `props.children`) and
	 * return an array with appropriately re-keyed children.
	 */
	function toArray(children) {
	  var result = [];
	  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
	  return result;
	}

	var ReactChildren = {
	  forEach: forEachChildren,
	  map: mapChildren,
	  mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
	  count: countChildren,
	  toArray: toArray
	};

	module.exports = ReactChildren;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule PooledClass
	 */

	'use strict';

	var invariant = __webpack_require__(14);

	/**
	 * Static poolers. Several custom versions for each potential number of
	 * arguments. A completely generic pooler is easy to implement, but would
	 * require accessing the `arguments` object. In each of these, `this` refers to
	 * the Class itself, not an instance. If any others are needed, simply add them
	 * here, or in their own files.
	 */
	var oneArgumentPooler = function oneArgumentPooler(copyFieldsFrom) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, copyFieldsFrom);
	    return instance;
	  } else {
	    return new Klass(copyFieldsFrom);
	  }
	};

	var twoArgumentPooler = function twoArgumentPooler(a1, a2) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, a1, a2);
	    return instance;
	  } else {
	    return new Klass(a1, a2);
	  }
	};

	var threeArgumentPooler = function threeArgumentPooler(a1, a2, a3) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, a1, a2, a3);
	    return instance;
	  } else {
	    return new Klass(a1, a2, a3);
	  }
	};

	var fourArgumentPooler = function fourArgumentPooler(a1, a2, a3, a4) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, a1, a2, a3, a4);
	    return instance;
	  } else {
	    return new Klass(a1, a2, a3, a4);
	  }
	};

	var fiveArgumentPooler = function fiveArgumentPooler(a1, a2, a3, a4, a5) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, a1, a2, a3, a4, a5);
	    return instance;
	  } else {
	    return new Klass(a1, a2, a3, a4, a5);
	  }
	};

	var standardReleaser = function standardReleaser(instance) {
	  var Klass = this;
	  !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : invariant(false) : void 0;
	  instance.destructor();
	  if (Klass.instancePool.length < Klass.poolSize) {
	    Klass.instancePool.push(instance);
	  }
	};

	var DEFAULT_POOL_SIZE = 10;
	var DEFAULT_POOLER = oneArgumentPooler;

	/**
	 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
	 * itself (statically) not adding any prototypical fields. Any CopyConstructor
	 * you give this may have a `poolSize` property, and will look for a
	 * prototypical `destructor` on instances (optional).
	 *
	 * @param {Function} CopyConstructor Constructor that can be used to reset.
	 * @param {Function} pooler Customizable pooler.
	 */
	var addPoolingTo = function addPoolingTo(CopyConstructor, pooler) {
	  var NewKlass = CopyConstructor;
	  NewKlass.instancePool = [];
	  NewKlass.getPooled = pooler || DEFAULT_POOLER;
	  if (!NewKlass.poolSize) {
	    NewKlass.poolSize = DEFAULT_POOL_SIZE;
	  }
	  NewKlass.release = standardReleaser;
	  return NewKlass;
	};

	var PooledClass = {
	  addPoolingTo: addPoolingTo,
	  oneArgumentPooler: oneArgumentPooler,
	  twoArgumentPooler: twoArgumentPooler,
	  threeArgumentPooler: threeArgumentPooler,
	  fourArgumentPooler: fourArgumentPooler,
	  fiveArgumentPooler: fiveArgumentPooler
	};

	module.exports = PooledClass;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	function invariant(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactElement
	 */

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _assign = __webpack_require__(11);

	var ReactCurrentOwner = __webpack_require__(16);

	var warning = __webpack_require__(17);
	var canDefineProperty = __webpack_require__(19);

	// The Symbol used to tag the ReactElement type. If there is no native Symbol
	// nor polyfill, then a plain number is used for performance.
	var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

	var RESERVED_PROPS = {
	  key: true,
	  ref: true,
	  __self: true,
	  __source: true
	};

	var specialPropKeyWarningShown, specialPropRefWarningShown;

	/**
	 * Factory method to create a new React element. This no longer adheres to
	 * the class pattern, so do not use new to call it. Also, no instanceof check
	 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
	 * if something is a React Element.
	 *
	 * @param {*} type
	 * @param {*} key
	 * @param {string|object} ref
	 * @param {*} self A *temporary* helper to detect places where `this` is
	 * different from the `owner` when React.createElement is called, so that we
	 * can warn. We want to get rid of owner and replace string `ref`s with arrow
	 * functions, and as long as `this` and owner are the same, there will be no
	 * change in behavior.
	 * @param {*} source An annotation object (added by a transpiler or otherwise)
	 * indicating filename, line number, and/or other information.
	 * @param {*} owner
	 * @param {*} props
	 * @internal
	 */
	var ReactElement = function ReactElement(type, key, ref, self, source, owner, props) {
	  var element = {
	    // This tag allow us to uniquely identify this as a React Element
	    $$typeof: REACT_ELEMENT_TYPE,

	    // Built-in properties that belong on the element
	    type: type,
	    key: key,
	    ref: ref,
	    props: props,

	    // Record the component responsible for creating this element.
	    _owner: owner
	  };

	  if (process.env.NODE_ENV !== 'production') {
	    // The validation flag is currently mutative. We put it on
	    // an external backing store so that we can freeze the whole object.
	    // This can be replaced with a WeakMap once they are implemented in
	    // commonly used development environments.
	    element._store = {};

	    // To make comparing ReactElements easier for testing purposes, we make
	    // the validation flag non-enumerable (where possible, which should
	    // include every environment we run tests in), so the test framework
	    // ignores it.
	    if (canDefineProperty) {
	      Object.defineProperty(element._store, 'validated', {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: false
	      });
	      // self and source are DEV only properties.
	      Object.defineProperty(element, '_self', {
	        configurable: false,
	        enumerable: false,
	        writable: false,
	        value: self
	      });
	      // Two elements created in two different places should be considered
	      // equal for testing purposes and therefore we hide it from enumeration.
	      Object.defineProperty(element, '_source', {
	        configurable: false,
	        enumerable: false,
	        writable: false,
	        value: source
	      });
	    } else {
	      element._store.validated = false;
	      element._self = self;
	      element._source = source;
	    }
	    if (Object.freeze) {
	      Object.freeze(element.props);
	      Object.freeze(element);
	    }
	  }

	  return element;
	};

	ReactElement.createElement = function (type, config, children) {
	  var propName;

	  // Reserved names are extracted
	  var props = {};

	  var key = null;
	  var ref = null;
	  var self = null;
	  var source = null;

	  if (config != null) {
	    if (process.env.NODE_ENV !== 'production') {
	      ref = !config.hasOwnProperty('ref') || Object.getOwnPropertyDescriptor(config, 'ref').get ? null : config.ref;
	      key = !config.hasOwnProperty('key') || Object.getOwnPropertyDescriptor(config, 'key').get ? null : '' + config.key;
	    } else {
	      ref = config.ref === undefined ? null : config.ref;
	      key = config.key === undefined ? null : '' + config.key;
	    }
	    self = config.__self === undefined ? null : config.__self;
	    source = config.__source === undefined ? null : config.__source;
	    // Remaining properties are added to a new props object
	    for (propName in config) {
	      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	        props[propName] = config[propName];
	      }
	    }
	  }

	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    props.children = childArray;
	  }

	  // Resolve default props
	  if (type && type.defaultProps) {
	    var defaultProps = type.defaultProps;
	    for (propName in defaultProps) {
	      if (props[propName] === undefined) {
	        props[propName] = defaultProps[propName];
	      }
	    }
	  }
	  if (process.env.NODE_ENV !== 'production') {
	    // Create dummy `key` and `ref` property to `props` to warn users
	    // against its use
	    if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
	      if (!props.hasOwnProperty('key')) {
	        Object.defineProperty(props, 'key', {
	          get: function get() {
	            if (!specialPropKeyWarningShown) {
	              specialPropKeyWarningShown = true;
	              process.env.NODE_ENV !== 'production' ? warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', typeof type === 'function' && 'displayName' in type ? type.displayName : 'Element') : void 0;
	            }
	            return undefined;
	          },
	          configurable: true
	        });
	      }
	      if (!props.hasOwnProperty('ref')) {
	        Object.defineProperty(props, 'ref', {
	          get: function get() {
	            if (!specialPropRefWarningShown) {
	              specialPropRefWarningShown = true;
	              process.env.NODE_ENV !== 'production' ? warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', typeof type === 'function' && 'displayName' in type ? type.displayName : 'Element') : void 0;
	            }
	            return undefined;
	          },
	          configurable: true
	        });
	      }
	    }
	  }
	  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
	};

	ReactElement.createFactory = function (type) {
	  var factory = ReactElement.createElement.bind(null, type);
	  // Expose the type on the factory and the prototype so that it can be
	  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
	  // This should not be named `constructor` since this may not be the function
	  // that created the element, and it may not even be a constructor.
	  // Legacy hook TODO: Warn if this is accessed
	  factory.type = type;
	  return factory;
	};

	ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
	  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

	  return newElement;
	};

	ReactElement.cloneElement = function (element, config, children) {
	  var propName;

	  // Original props are copied
	  var props = _assign({}, element.props);

	  // Reserved names are extracted
	  var key = element.key;
	  var ref = element.ref;
	  // Self is preserved since the owner is preserved.
	  var self = element._self;
	  // Source is preserved since cloneElement is unlikely to be targeted by a
	  // transpiler, and the original source is probably a better indicator of the
	  // true owner.
	  var source = element._source;

	  // Owner will be preserved, unless ref is overridden
	  var owner = element._owner;

	  if (config != null) {
	    if (config.ref !== undefined) {
	      // Silently steal the ref from the parent.
	      ref = config.ref;
	      owner = ReactCurrentOwner.current;
	    }
	    if (config.key !== undefined) {
	      key = '' + config.key;
	    }
	    // Remaining properties override existing props
	    var defaultProps;
	    if (element.type && element.type.defaultProps) {
	      defaultProps = element.type.defaultProps;
	    }
	    for (propName in config) {
	      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	        if (config[propName] === undefined && defaultProps !== undefined) {
	          // Resolve default props
	          props[propName] = defaultProps[propName];
	        } else {
	          props[propName] = config[propName];
	        }
	      }
	    }
	  }

	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    props.children = childArray;
	  }

	  return ReactElement(element.type, key, ref, self, source, owner, props);
	};

	/**
	 * @param {?object} object
	 * @return {boolean} True if `object` is a valid component.
	 * @final
	 */
	ReactElement.isValidElement = function (object) {
	  return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	};

	module.exports = ReactElement;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactCurrentOwner
	 */

	'use strict';

	/**
	 * Keeps track of the current owner.
	 *
	 * The current owner is the component who should own any components that are
	 * currently being constructed.
	 */

	var ReactCurrentOwner = {

	  /**
	   * @internal
	   * @type {ReactComponent}
	   */
	  current: null

	};

	module.exports = ReactCurrentOwner;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var emptyFunction = __webpack_require__(18);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (process.env.NODE_ENV !== 'production') {
	  warning = function warning(condition, format) {
	    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      args[_key - 2] = arguments[_key];
	    }

	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }

	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    }
	  };
	}

	module.exports = warning;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	function emptyFunction() {}

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule canDefineProperty
	 */

	'use strict';

	var canDefineProperty = false;
	if (process.env.NODE_ENV !== 'production') {
	  try {
	    Object.defineProperty({}, 'x', { get: function get() {} });
	    canDefineProperty = true;
	  } catch (x) {
	    // IE will fail on defineProperty
	  }
	}

	module.exports = canDefineProperty;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule traverseAllChildren
	 */

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var ReactCurrentOwner = __webpack_require__(16);
	var ReactElement = __webpack_require__(15);

	var getIteratorFn = __webpack_require__(21);
	var invariant = __webpack_require__(14);
	var warning = __webpack_require__(17);

	var SEPARATOR = '.';
	var SUBSEPARATOR = ':';

	/**
	 * TODO: Test that a single child and an array with one item have the same key
	 * pattern.
	 */

	var userProvidedKeyEscaperLookup = {
	  '=': '=0',
	  ':': '=2'
	};

	var userProvidedKeyEscapeRegex = /[=:]/g;

	var didWarnAboutMaps = false;

	function userProvidedKeyEscaper(match) {
	  return userProvidedKeyEscaperLookup[match];
	}

	/**
	 * Generate a key string that identifies a component within a set.
	 *
	 * @param {*} component A component that could contain a manual key.
	 * @param {number} index Index that is used if a manual key is not provided.
	 * @return {string}
	 */
	function getComponentKey(component, index) {
	  // Do some typechecking here since we call this blindly. We want to ensure
	  // that we don't block potential future ES APIs.
	  if (component && (typeof component === 'undefined' ? 'undefined' : _typeof(component)) === 'object' && component.key != null) {
	    // Explicit key
	    return wrapUserProvidedKey(component.key);
	  }
	  // Implicit key determined by the index in the set
	  return index.toString(36);
	}

	/**
	 * Escape a component key so that it is safe to use in a reactid.
	 *
	 * @param {*} text Component key to be escaped.
	 * @return {string} An escaped string.
	 */
	function escapeUserProvidedKey(text) {
	  return ('' + text).replace(userProvidedKeyEscapeRegex, userProvidedKeyEscaper);
	}

	/**
	 * Wrap a `key` value explicitly provided by the user to distinguish it from
	 * implicitly-generated keys generated by a component's index in its parent.
	 *
	 * @param {string} key Value of a user-provided `key` attribute
	 * @return {string}
	 */
	function wrapUserProvidedKey(key) {
	  return '$' + escapeUserProvidedKey(key);
	}

	/**
	 * @param {?*} children Children tree container.
	 * @param {!string} nameSoFar Name of the key path so far.
	 * @param {!function} callback Callback to invoke with each child found.
	 * @param {?*} traverseContext Used to pass information throughout the traversal
	 * process.
	 * @return {!number} The number of children in this subtree.
	 */
	function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
	  var type = typeof children === 'undefined' ? 'undefined' : _typeof(children);

	  if (type === 'undefined' || type === 'boolean') {
	    // All of the above are perceived as null.
	    children = null;
	  }

	  if (children === null || type === 'string' || type === 'number' || ReactElement.isValidElement(children)) {
	    callback(traverseContext, children,
	    // If it's the only child, treat the name as if it was wrapped in an array
	    // so that it's consistent if the number of children grows.
	    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
	    return 1;
	  }

	  var child;
	  var nextName;
	  var subtreeCount = 0; // Count of children found in the current subtree.
	  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

	  if (Array.isArray(children)) {
	    for (var i = 0; i < children.length; i++) {
	      child = children[i];
	      nextName = nextNamePrefix + getComponentKey(child, i);
	      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
	    }
	  } else {
	    var iteratorFn = getIteratorFn(children);
	    if (iteratorFn) {
	      var iterator = iteratorFn.call(children);
	      var step;
	      if (iteratorFn !== children.entries) {
	        var ii = 0;
	        while (!(step = iterator.next()).done) {
	          child = step.value;
	          nextName = nextNamePrefix + getComponentKey(child, ii++);
	          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
	        }
	      } else {
	        if (process.env.NODE_ENV !== 'production') {
	          process.env.NODE_ENV !== 'production' ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.') : void 0;
	          didWarnAboutMaps = true;
	        }
	        // Iterator will provide entry [k,v] tuples rather than values.
	        while (!(step = iterator.next()).done) {
	          var entry = step.value;
	          if (entry) {
	            child = entry[1];
	            nextName = nextNamePrefix + wrapUserProvidedKey(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
	            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
	          }
	        }
	      }
	    } else if (type === 'object') {
	      var addendum = '';
	      if (process.env.NODE_ENV !== 'production') {
	        addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
	        if (children._isReactElement) {
	          addendum = ' It looks like you\'re using an element created by a different ' + 'version of React. Make sure to use only one copy of React.';
	        }
	        if (ReactCurrentOwner.current) {
	          var name = ReactCurrentOwner.current.getName();
	          if (name) {
	            addendum += ' Check the render method of `' + name + '`.';
	          }
	        }
	      }
	      var childrenString = String(children);
	       true ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : invariant(false) : void 0;
	    }
	  }

	  return subtreeCount;
	}

	/**
	 * Traverses children that are typically specified as `props.children`, but
	 * might also be specified through attributes:
	 *
	 * - `traverseAllChildren(this.props.children, ...)`
	 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
	 *
	 * The `traverseContext` is an optional argument that is passed through the
	 * entire traversal. It can be used to store accumulations or anything else that
	 * the callback might find relevant.
	 *
	 * @param {?*} children Children tree object.
	 * @param {!function} callback To invoke upon traversing each child.
	 * @param {?*} traverseContext Context for traversal.
	 * @return {!number} The number of children in this subtree.
	 */
	function traverseAllChildren(children, callback, traverseContext) {
	  if (children == null) {
	    return 0;
	  }

	  return traverseAllChildrenImpl(children, '', callback, traverseContext);
	}

	module.exports = traverseAllChildren;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule getIteratorFn
	 */

	'use strict';

	/* global Symbol */

	var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	/**
	 * Returns the iterator method function contained on the iterable object.
	 *
	 * Be sure to invoke the function with the iterable as context:
	 *
	 *     var iteratorFn = getIteratorFn(myIterable);
	 *     if (iteratorFn) {
	 *       var iterator = iteratorFn.call(myIterable);
	 *       ...
	 *     }
	 *
	 * @param {?object} maybeIterable
	 * @return {?function}
	 */
	function getIteratorFn(maybeIterable) {
	  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	  if (typeof iteratorFn === 'function') {
	    return iteratorFn;
	  }
	}

	module.exports = getIteratorFn;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactComponent
	 */

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var ReactNoopUpdateQueue = __webpack_require__(23);
	var ReactInstrumentation = __webpack_require__(24);

	var canDefineProperty = __webpack_require__(19);
	var emptyObject = __webpack_require__(27);
	var invariant = __webpack_require__(14);
	var warning = __webpack_require__(17);

	/**
	 * Base class helpers for the updating state of a component.
	 */
	function ReactComponent(props, context, updater) {
	  this.props = props;
	  this.context = context;
	  this.refs = emptyObject;
	  // We initialize the default updater but the real one gets injected by the
	  // renderer.
	  this.updater = updater || ReactNoopUpdateQueue;
	}

	ReactComponent.prototype.isReactComponent = {};

	/**
	 * Sets a subset of the state. Always use this to mutate
	 * state. You should treat `this.state` as immutable.
	 *
	 * There is no guarantee that `this.state` will be immediately updated, so
	 * accessing `this.state` after calling this method may return the old value.
	 *
	 * There is no guarantee that calls to `setState` will run synchronously,
	 * as they may eventually be batched together.  You can provide an optional
	 * callback that will be executed when the call to setState is actually
	 * completed.
	 *
	 * When a function is provided to setState, it will be called at some point in
	 * the future (not synchronously). It will be called with the up to date
	 * component arguments (state, props, context). These values can be different
	 * from this.* because your function may be called after receiveProps but before
	 * shouldComponentUpdate, and this new state, props, and context will not yet be
	 * assigned to this.
	 *
	 * @param {object|function} partialState Next partial state or function to
	 *        produce next partial state to be merged with current state.
	 * @param {?function} callback Called after state is updated.
	 * @final
	 * @protected
	 */
	ReactComponent.prototype.setState = function (partialState, callback) {
	  !((typeof partialState === 'undefined' ? 'undefined' : _typeof(partialState)) === 'object' || typeof partialState === 'function' || partialState == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'setState(...): takes an object of state variables to update or a ' + 'function which returns an object of state variables.') : invariant(false) : void 0;
	  if (process.env.NODE_ENV !== 'production') {
	    ReactInstrumentation.debugTool.onSetState();
	    process.env.NODE_ENV !== 'production' ? warning(partialState != null, 'setState(...): You passed an undefined or null state object; ' + 'instead, use forceUpdate().') : void 0;
	  }
	  this.updater.enqueueSetState(this, partialState);
	  if (callback) {
	    this.updater.enqueueCallback(this, callback, 'setState');
	  }
	};

	/**
	 * Forces an update. This should only be invoked when it is known with
	 * certainty that we are **not** in a DOM transaction.
	 *
	 * You may want to call this when you know that some deeper aspect of the
	 * component's state has changed but `setState` was not called.
	 *
	 * This will not invoke `shouldComponentUpdate`, but it will invoke
	 * `componentWillUpdate` and `componentDidUpdate`.
	 *
	 * @param {?function} callback Called after update is complete.
	 * @final
	 * @protected
	 */
	ReactComponent.prototype.forceUpdate = function (callback) {
	  this.updater.enqueueForceUpdate(this);
	  if (callback) {
	    this.updater.enqueueCallback(this, callback, 'forceUpdate');
	  }
	};

	/**
	 * Deprecated APIs. These APIs used to exist on classic React classes but since
	 * we would like to deprecate them, we're not going to move them over to this
	 * modern base class. Instead, we define a getter that warns if it's accessed.
	 */
	if (process.env.NODE_ENV !== 'production') {
	  var deprecatedAPIs = {
	    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
	    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
	  };
	  var defineDeprecationWarning = function defineDeprecationWarning(methodName, info) {
	    if (canDefineProperty) {
	      Object.defineProperty(ReactComponent.prototype, methodName, {
	        get: function get() {
	          process.env.NODE_ENV !== 'production' ? warning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]) : void 0;
	          return undefined;
	        }
	      });
	    }
	  };
	  for (var fnName in deprecatedAPIs) {
	    if (deprecatedAPIs.hasOwnProperty(fnName)) {
	      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
	    }
	  }
	}

	module.exports = ReactComponent;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2015-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactNoopUpdateQueue
	 */

	'use strict';

	var warning = __webpack_require__(17);

	function warnTDZ(publicInstance, callerName) {
	  if (process.env.NODE_ENV !== 'production') {
	    process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, publicInstance.constructor && publicInstance.constructor.displayName || '') : void 0;
	  }
	}

	/**
	 * This is the abstract API for an update queue.
	 */
	var ReactNoopUpdateQueue = {

	  /**
	   * Checks whether or not this composite component is mounted.
	   * @param {ReactClass} publicInstance The instance we want to test.
	   * @return {boolean} True if mounted, false otherwise.
	   * @protected
	   * @final
	   */
	  isMounted: function isMounted(publicInstance) {
	    return false;
	  },

	  /**
	   * Enqueue a callback that will be executed after all the pending updates
	   * have processed.
	   *
	   * @param {ReactClass} publicInstance The instance to use as `this` context.
	   * @param {?function} callback Called after state is updated.
	   * @internal
	   */
	  enqueueCallback: function enqueueCallback(publicInstance, callback) {},

	  /**
	   * Forces an update. This should only be invoked when it is known with
	   * certainty that we are **not** in a DOM transaction.
	   *
	   * You may want to call this when you know that some deeper aspect of the
	   * component's state has changed but `setState` was not called.
	   *
	   * This will not invoke `shouldComponentUpdate`, but it will invoke
	   * `componentWillUpdate` and `componentDidUpdate`.
	   *
	   * @param {ReactClass} publicInstance The instance that should rerender.
	   * @internal
	   */
	  enqueueForceUpdate: function enqueueForceUpdate(publicInstance) {
	    warnTDZ(publicInstance, 'forceUpdate');
	  },

	  /**
	   * Replaces all of the state. Always use this or `setState` to mutate state.
	   * You should treat `this.state` as immutable.
	   *
	   * There is no guarantee that `this.state` will be immediately updated, so
	   * accessing `this.state` after calling this method may return the old value.
	   *
	   * @param {ReactClass} publicInstance The instance that should rerender.
	   * @param {object} completeState Next state.
	   * @internal
	   */
	  enqueueReplaceState: function enqueueReplaceState(publicInstance, completeState) {
	    warnTDZ(publicInstance, 'replaceState');
	  },

	  /**
	   * Sets a subset of the state. This only exists because _pendingState is
	   * internal. This provides a merging strategy that is not available to deep
	   * properties which is confusing. TODO: Expose pendingState or don't use it
	   * during the merge.
	   *
	   * @param {ReactClass} publicInstance The instance that should rerender.
	   * @param {object} partialState Next partial state to be merged with state.
	   * @internal
	   */
	  enqueueSetState: function enqueueSetState(publicInstance, partialState) {
	    warnTDZ(publicInstance, 'setState');
	  }
	};

	module.exports = ReactNoopUpdateQueue;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2016-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactInstrumentation
	 */

	'use strict';

	var ReactDebugTool = __webpack_require__(25);

	module.exports = { debugTool: ReactDebugTool };

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2016-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactDebugTool
	 */

	'use strict';

	var ReactInvalidSetStateWarningDevTool = __webpack_require__(26);
	var warning = __webpack_require__(17);

	var eventHandlers = [];
	var handlerDoesThrowForEvent = {};

	function emitEvent(handlerFunctionName, arg1, arg2, arg3, arg4, arg5) {
	  if (process.env.NODE_ENV !== 'production') {
	    eventHandlers.forEach(function (handler) {
	      try {
	        if (handler[handlerFunctionName]) {
	          handler[handlerFunctionName](arg1, arg2, arg3, arg4, arg5);
	        }
	      } catch (e) {
	        process.env.NODE_ENV !== 'production' ? warning(!handlerDoesThrowForEvent[handlerFunctionName], 'exception thrown by devtool while handling %s: %s', handlerFunctionName, e.message) : void 0;
	        handlerDoesThrowForEvent[handlerFunctionName] = true;
	      }
	    });
	  }
	}

	var ReactDebugTool = {
	  addDevtool: function addDevtool(devtool) {
	    eventHandlers.push(devtool);
	  },
	  removeDevtool: function removeDevtool(devtool) {
	    for (var i = 0; i < eventHandlers.length; i++) {
	      if (eventHandlers[i] === devtool) {
	        eventHandlers.splice(i, 1);
	        i--;
	      }
	    }
	  },
	  onBeginProcessingChildContext: function onBeginProcessingChildContext() {
	    emitEvent('onBeginProcessingChildContext');
	  },
	  onEndProcessingChildContext: function onEndProcessingChildContext() {
	    emitEvent('onEndProcessingChildContext');
	  },
	  onSetState: function onSetState() {
	    emitEvent('onSetState');
	  },
	  onMountRootComponent: function onMountRootComponent(internalInstance) {
	    emitEvent('onMountRootComponent', internalInstance);
	  },
	  onMountComponent: function onMountComponent(internalInstance) {
	    emitEvent('onMountComponent', internalInstance);
	  },
	  onUpdateComponent: function onUpdateComponent(internalInstance) {
	    emitEvent('onUpdateComponent', internalInstance);
	  },
	  onUnmountComponent: function onUnmountComponent(internalInstance) {
	    emitEvent('onUnmountComponent', internalInstance);
	  }
	};

	ReactDebugTool.addDevtool(ReactInvalidSetStateWarningDevTool);

	module.exports = ReactDebugTool;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2016-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactInvalidSetStateWarningDevTool
	 */

	'use strict';

	var warning = __webpack_require__(17);

	if (process.env.NODE_ENV !== 'production') {
	  var processingChildContext = false;

	  var warnInvalidSetState = function warnInvalidSetState() {
	    process.env.NODE_ENV !== 'production' ? warning(!processingChildContext, 'setState(...): Cannot call setState() inside getChildContext()') : void 0;
	  };
	}

	var ReactInvalidSetStateWarningDevTool = {
	  onBeginProcessingChildContext: function onBeginProcessingChildContext() {
	    processingChildContext = true;
	  },
	  onEndProcessingChildContext: function onEndProcessingChildContext() {
	    processingChildContext = false;
	  },
	  onSetState: function onSetState() {
	    warnInvalidSetState();
	  }
	};

	module.exports = ReactInvalidSetStateWarningDevTool;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var emptyObject = {};

	if (process.env.NODE_ENV !== 'production') {
	  Object.freeze(emptyObject);
	}

	module.exports = emptyObject;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactClass
	 */

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _assign = __webpack_require__(11);

	var ReactComponent = __webpack_require__(22);
	var ReactElement = __webpack_require__(15);
	var ReactPropTypeLocations = __webpack_require__(29);
	var ReactPropTypeLocationNames = __webpack_require__(31);
	var ReactNoopUpdateQueue = __webpack_require__(23);

	var emptyObject = __webpack_require__(27);
	var invariant = __webpack_require__(14);
	var keyMirror = __webpack_require__(30);
	var keyOf = __webpack_require__(32);
	var warning = __webpack_require__(17);

	var MIXINS_KEY = keyOf({ mixins: null });

	/**
	 * Policies that describe methods in `ReactClassInterface`.
	 */
	var SpecPolicy = keyMirror({
	  /**
	   * These methods may be defined only once by the class specification or mixin.
	   */
	  DEFINE_ONCE: null,
	  /**
	   * These methods may be defined by both the class specification and mixins.
	   * Subsequent definitions will be chained. These methods must return void.
	   */
	  DEFINE_MANY: null,
	  /**
	   * These methods are overriding the base class.
	   */
	  OVERRIDE_BASE: null,
	  /**
	   * These methods are similar to DEFINE_MANY, except we assume they return
	   * objects. We try to merge the keys of the return values of all the mixed in
	   * functions. If there is a key conflict we throw.
	   */
	  DEFINE_MANY_MERGED: null
	});

	var injectedMixins = [];

	/**
	 * Composite components are higher-level components that compose other composite
	 * or native components.
	 *
	 * To create a new type of `ReactClass`, pass a specification of
	 * your new class to `React.createClass`. The only requirement of your class
	 * specification is that you implement a `render` method.
	 *
	 *   var MyComponent = React.createClass({
	 *     render: function() {
	 *       return <div>Hello World</div>;
	 *     }
	 *   });
	 *
	 * The class specification supports a specific protocol of methods that have
	 * special meaning (e.g. `render`). See `ReactClassInterface` for
	 * more the comprehensive protocol. Any other properties and methods in the
	 * class specification will be available on the prototype.
	 *
	 * @interface ReactClassInterface
	 * @internal
	 */
	var ReactClassInterface = {

	  /**
	   * An array of Mixin objects to include when defining your component.
	   *
	   * @type {array}
	   * @optional
	   */
	  mixins: SpecPolicy.DEFINE_MANY,

	  /**
	   * An object containing properties and methods that should be defined on
	   * the component's constructor instead of its prototype (static methods).
	   *
	   * @type {object}
	   * @optional
	   */
	  statics: SpecPolicy.DEFINE_MANY,

	  /**
	   * Definition of prop types for this component.
	   *
	   * @type {object}
	   * @optional
	   */
	  propTypes: SpecPolicy.DEFINE_MANY,

	  /**
	   * Definition of context types for this component.
	   *
	   * @type {object}
	   * @optional
	   */
	  contextTypes: SpecPolicy.DEFINE_MANY,

	  /**
	   * Definition of context types this component sets for its children.
	   *
	   * @type {object}
	   * @optional
	   */
	  childContextTypes: SpecPolicy.DEFINE_MANY,

	  // ==== Definition methods ====

	  /**
	   * Invoked when the component is mounted. Values in the mapping will be set on
	   * `this.props` if that prop is not specified (i.e. using an `in` check).
	   *
	   * This method is invoked before `getInitialState` and therefore cannot rely
	   * on `this.state` or use `this.setState`.
	   *
	   * @return {object}
	   * @optional
	   */
	  getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,

	  /**
	   * Invoked once before the component is mounted. The return value will be used
	   * as the initial value of `this.state`.
	   *
	   *   getInitialState: function() {
	   *     return {
	   *       isOn: false,
	   *       fooBaz: new BazFoo()
	   *     }
	   *   }
	   *
	   * @return {object}
	   * @optional
	   */
	  getInitialState: SpecPolicy.DEFINE_MANY_MERGED,

	  /**
	   * @return {object}
	   * @optional
	   */
	  getChildContext: SpecPolicy.DEFINE_MANY_MERGED,

	  /**
	   * Uses props from `this.props` and state from `this.state` to render the
	   * structure of the component.
	   *
	   * No guarantees are made about when or how often this method is invoked, so
	   * it must not have side effects.
	   *
	   *   render: function() {
	   *     var name = this.props.name;
	   *     return <div>Hello, {name}!</div>;
	   *   }
	   *
	   * @return {ReactComponent}
	   * @nosideeffects
	   * @required
	   */
	  render: SpecPolicy.DEFINE_ONCE,

	  // ==== Delegate methods ====

	  /**
	   * Invoked when the component is initially created and about to be mounted.
	   * This may have side effects, but any external subscriptions or data created
	   * by this method must be cleaned up in `componentWillUnmount`.
	   *
	   * @optional
	   */
	  componentWillMount: SpecPolicy.DEFINE_MANY,

	  /**
	   * Invoked when the component has been mounted and has a DOM representation.
	   * However, there is no guarantee that the DOM node is in the document.
	   *
	   * Use this as an opportunity to operate on the DOM when the component has
	   * been mounted (initialized and rendered) for the first time.
	   *
	   * @param {DOMElement} rootNode DOM element representing the component.
	   * @optional
	   */
	  componentDidMount: SpecPolicy.DEFINE_MANY,

	  /**
	   * Invoked before the component receives new props.
	   *
	   * Use this as an opportunity to react to a prop transition by updating the
	   * state using `this.setState`. Current props are accessed via `this.props`.
	   *
	   *   componentWillReceiveProps: function(nextProps, nextContext) {
	   *     this.setState({
	   *       likesIncreasing: nextProps.likeCount > this.props.likeCount
	   *     });
	   *   }
	   *
	   * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
	   * transition may cause a state change, but the opposite is not true. If you
	   * need it, you are probably looking for `componentWillUpdate`.
	   *
	   * @param {object} nextProps
	   * @optional
	   */
	  componentWillReceiveProps: SpecPolicy.DEFINE_MANY,

	  /**
	   * Invoked while deciding if the component should be updated as a result of
	   * receiving new props, state and/or context.
	   *
	   * Use this as an opportunity to `return false` when you're certain that the
	   * transition to the new props/state/context will not require a component
	   * update.
	   *
	   *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
	   *     return !equal(nextProps, this.props) ||
	   *       !equal(nextState, this.state) ||
	   *       !equal(nextContext, this.context);
	   *   }
	   *
	   * @param {object} nextProps
	   * @param {?object} nextState
	   * @param {?object} nextContext
	   * @return {boolean} True if the component should update.
	   * @optional
	   */
	  shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,

	  /**
	   * Invoked when the component is about to update due to a transition from
	   * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
	   * and `nextContext`.
	   *
	   * Use this as an opportunity to perform preparation before an update occurs.
	   *
	   * NOTE: You **cannot** use `this.setState()` in this method.
	   *
	   * @param {object} nextProps
	   * @param {?object} nextState
	   * @param {?object} nextContext
	   * @param {ReactReconcileTransaction} transaction
	   * @optional
	   */
	  componentWillUpdate: SpecPolicy.DEFINE_MANY,

	  /**
	   * Invoked when the component's DOM representation has been updated.
	   *
	   * Use this as an opportunity to operate on the DOM when the component has
	   * been updated.
	   *
	   * @param {object} prevProps
	   * @param {?object} prevState
	   * @param {?object} prevContext
	   * @param {DOMElement} rootNode DOM element representing the component.
	   * @optional
	   */
	  componentDidUpdate: SpecPolicy.DEFINE_MANY,

	  /**
	   * Invoked when the component is about to be removed from its parent and have
	   * its DOM representation destroyed.
	   *
	   * Use this as an opportunity to deallocate any external resources.
	   *
	   * NOTE: There is no `componentDidUnmount` since your component will have been
	   * destroyed by that point.
	   *
	   * @optional
	   */
	  componentWillUnmount: SpecPolicy.DEFINE_MANY,

	  // ==== Advanced methods ====

	  /**
	   * Updates the component's currently mounted DOM representation.
	   *
	   * By default, this implements React's rendering and reconciliation algorithm.
	   * Sophisticated clients may wish to override this.
	   *
	   * @param {ReactReconcileTransaction} transaction
	   * @internal
	   * @overridable
	   */
	  updateComponent: SpecPolicy.OVERRIDE_BASE

	};

	/**
	 * Mapping from class specification keys to special processing functions.
	 *
	 * Although these are declared like instance properties in the specification
	 * when defining classes using `React.createClass`, they are actually static
	 * and are accessible on the constructor instead of the prototype. Despite
	 * being static, they must be defined outside of the "statics" key under
	 * which all other static methods are defined.
	 */
	var RESERVED_SPEC_KEYS = {
	  displayName: function displayName(Constructor, _displayName) {
	    Constructor.displayName = _displayName;
	  },
	  mixins: function mixins(Constructor, _mixins) {
	    if (_mixins) {
	      for (var i = 0; i < _mixins.length; i++) {
	        mixSpecIntoComponent(Constructor, _mixins[i]);
	      }
	    }
	  },
	  childContextTypes: function childContextTypes(Constructor, _childContextTypes) {
	    if (process.env.NODE_ENV !== 'production') {
	      validateTypeDef(Constructor, _childContextTypes, ReactPropTypeLocations.childContext);
	    }
	    Constructor.childContextTypes = _assign({}, Constructor.childContextTypes, _childContextTypes);
	  },
	  contextTypes: function contextTypes(Constructor, _contextTypes) {
	    if (process.env.NODE_ENV !== 'production') {
	      validateTypeDef(Constructor, _contextTypes, ReactPropTypeLocations.context);
	    }
	    Constructor.contextTypes = _assign({}, Constructor.contextTypes, _contextTypes);
	  },
	  /**
	   * Special case getDefaultProps which should move into statics but requires
	   * automatic merging.
	   */
	  getDefaultProps: function getDefaultProps(Constructor, _getDefaultProps) {
	    if (Constructor.getDefaultProps) {
	      Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, _getDefaultProps);
	    } else {
	      Constructor.getDefaultProps = _getDefaultProps;
	    }
	  },
	  propTypes: function propTypes(Constructor, _propTypes) {
	    if (process.env.NODE_ENV !== 'production') {
	      validateTypeDef(Constructor, _propTypes, ReactPropTypeLocations.prop);
	    }
	    Constructor.propTypes = _assign({}, Constructor.propTypes, _propTypes);
	  },
	  statics: function statics(Constructor, _statics) {
	    mixStaticSpecIntoComponent(Constructor, _statics);
	  },
	  autobind: function autobind() {} };

	// noop
	function validateTypeDef(Constructor, typeDef, location) {
	  for (var propName in typeDef) {
	    if (typeDef.hasOwnProperty(propName)) {
	      // use a warning instead of an invariant so components
	      // don't show up in prod but only in __DEV__
	      process.env.NODE_ENV !== 'production' ? warning(typeof typeDef[propName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', Constructor.displayName || 'ReactClass', ReactPropTypeLocationNames[location], propName) : void 0;
	    }
	  }
	}

	function validateMethodOverride(isAlreadyDefined, name) {
	  var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;

	  // Disallow overriding of base class methods unless explicitly allowed.
	  if (ReactClassMixin.hasOwnProperty(name)) {
	    !(specPolicy === SpecPolicy.OVERRIDE_BASE) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to override ' + '`%s` from your class specification. Ensure that your method names ' + 'do not overlap with React methods.', name) : invariant(false) : void 0;
	  }

	  // Disallow defining methods more than once unless explicitly allowed.
	  if (isAlreadyDefined) {
	    !(specPolicy === SpecPolicy.DEFINE_MANY || specPolicy === SpecPolicy.DEFINE_MANY_MERGED) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to define ' + '`%s` on your component more than once. This conflict may be due ' + 'to a mixin.', name) : invariant(false) : void 0;
	  }
	}

	/**
	 * Mixin helper which handles policy validation and reserved
	 * specification keys when building React classes.
	 */
	function mixSpecIntoComponent(Constructor, spec) {
	  if (!spec) {
	    return;
	  }

	  !(typeof spec !== 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to ' + 'use a component class or function as a mixin. Instead, just use a ' + 'regular object.') : invariant(false) : void 0;
	  !!ReactElement.isValidElement(spec) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to ' + 'use a component as a mixin. Instead, just use a regular object.') : invariant(false) : void 0;

	  var proto = Constructor.prototype;
	  var autoBindPairs = proto.__reactAutoBindPairs;

	  // By handling mixins before any other properties, we ensure the same
	  // chaining order is applied to methods with DEFINE_MANY policy, whether
	  // mixins are listed before or after these methods in the spec.
	  if (spec.hasOwnProperty(MIXINS_KEY)) {
	    RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
	  }

	  for (var name in spec) {
	    if (!spec.hasOwnProperty(name)) {
	      continue;
	    }

	    if (name === MIXINS_KEY) {
	      // We have already handled mixins in a special case above.
	      continue;
	    }

	    var property = spec[name];
	    var isAlreadyDefined = proto.hasOwnProperty(name);
	    validateMethodOverride(isAlreadyDefined, name);

	    if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
	      RESERVED_SPEC_KEYS[name](Constructor, property);
	    } else {
	      // Setup methods on prototype:
	      // The following member methods should not be automatically bound:
	      // 1. Expected ReactClass methods (in the "interface").
	      // 2. Overridden methods (that were mixed in).
	      var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
	      var isFunction = typeof property === 'function';
	      var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

	      if (shouldAutoBind) {
	        autoBindPairs.push(name, property);
	        proto[name] = property;
	      } else {
	        if (isAlreadyDefined) {
	          var specPolicy = ReactClassInterface[name];

	          // These cases should already be caught by validateMethodOverride.
	          !(isReactClassMethod && (specPolicy === SpecPolicy.DEFINE_MANY_MERGED || specPolicy === SpecPolicy.DEFINE_MANY)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: Unexpected spec policy %s for key %s ' + 'when mixing in component specs.', specPolicy, name) : invariant(false) : void 0;

	          // For methods which are defined more than once, call the existing
	          // methods before calling the new property, merging if appropriate.
	          if (specPolicy === SpecPolicy.DEFINE_MANY_MERGED) {
	            proto[name] = createMergedResultFunction(proto[name], property);
	          } else if (specPolicy === SpecPolicy.DEFINE_MANY) {
	            proto[name] = createChainedFunction(proto[name], property);
	          }
	        } else {
	          proto[name] = property;
	          if (process.env.NODE_ENV !== 'production') {
	            // Add verbose displayName to the function, which helps when looking
	            // at profiling tools.
	            if (typeof property === 'function' && spec.displayName) {
	              proto[name].displayName = spec.displayName + '_' + name;
	            }
	          }
	        }
	      }
	    }
	  }
	}

	function mixStaticSpecIntoComponent(Constructor, statics) {
	  if (!statics) {
	    return;
	  }
	  for (var name in statics) {
	    var property = statics[name];
	    if (!statics.hasOwnProperty(name)) {
	      continue;
	    }

	    var isReserved = name in RESERVED_SPEC_KEYS;
	    !!isReserved ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define a reserved ' + 'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' + 'as an instance property instead; it will still be accessible on the ' + 'constructor.', name) : invariant(false) : void 0;

	    var isInherited = name in Constructor;
	    !!isInherited ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define ' + '`%s` on your component more than once. This conflict may be ' + 'due to a mixin.', name) : invariant(false) : void 0;
	    Constructor[name] = property;
	  }
	}

	/**
	 * Merge two objects, but throw if both contain the same key.
	 *
	 * @param {object} one The first object, which is mutated.
	 * @param {object} two The second object
	 * @return {object} one after it has been mutated to contain everything in two.
	 */
	function mergeIntoWithNoDuplicateKeys(one, two) {
	  !(one && two && (typeof one === 'undefined' ? 'undefined' : _typeof(one)) === 'object' && (typeof two === 'undefined' ? 'undefined' : _typeof(two)) === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.') : invariant(false) : void 0;

	  for (var key in two) {
	    if (two.hasOwnProperty(key)) {
	      !(one[key] === undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): ' + 'Tried to merge two objects with the same key: `%s`. This conflict ' + 'may be due to a mixin; in particular, this may be caused by two ' + 'getInitialState() or getDefaultProps() methods returning objects ' + 'with clashing keys.', key) : invariant(false) : void 0;
	      one[key] = two[key];
	    }
	  }
	  return one;
	}

	/**
	 * Creates a function that invokes two functions and merges their return values.
	 *
	 * @param {function} one Function to invoke first.
	 * @param {function} two Function to invoke second.
	 * @return {function} Function that invokes the two argument functions.
	 * @private
	 */
	function createMergedResultFunction(one, two) {
	  return function mergedResult() {
	    var a = one.apply(this, arguments);
	    var b = two.apply(this, arguments);
	    if (a == null) {
	      return b;
	    } else if (b == null) {
	      return a;
	    }
	    var c = {};
	    mergeIntoWithNoDuplicateKeys(c, a);
	    mergeIntoWithNoDuplicateKeys(c, b);
	    return c;
	  };
	}

	/**
	 * Creates a function that invokes two functions and ignores their return vales.
	 *
	 * @param {function} one Function to invoke first.
	 * @param {function} two Function to invoke second.
	 * @return {function} Function that invokes the two argument functions.
	 * @private
	 */
	function createChainedFunction(one, two) {
	  return function chainedFunction() {
	    one.apply(this, arguments);
	    two.apply(this, arguments);
	  };
	}

	/**
	 * Binds a method to the component.
	 *
	 * @param {object} component Component whose method is going to be bound.
	 * @param {function} method Method to be bound.
	 * @return {function} The bound method.
	 */
	function bindAutoBindMethod(component, method) {
	  var boundMethod = method.bind(component);
	  if (process.env.NODE_ENV !== 'production') {
	    boundMethod.__reactBoundContext = component;
	    boundMethod.__reactBoundMethod = method;
	    boundMethod.__reactBoundArguments = null;
	    var componentName = component.constructor.displayName;
	    var _bind = boundMethod.bind;
	    boundMethod.bind = function (newThis) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      // User is trying to bind() an autobound method; we effectively will
	      // ignore the value of "this" that the user is trying to use, so
	      // let's warn.
	      if (newThis !== component && newThis !== null) {
	        process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): React component methods may only be bound to the ' + 'component instance. See %s', componentName) : void 0;
	      } else if (!args.length) {
	        process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See %s', componentName) : void 0;
	        return boundMethod;
	      }
	      var reboundMethod = _bind.apply(boundMethod, arguments);
	      reboundMethod.__reactBoundContext = component;
	      reboundMethod.__reactBoundMethod = method;
	      reboundMethod.__reactBoundArguments = args;
	      return reboundMethod;
	    };
	  }
	  return boundMethod;
	}

	/**
	 * Binds all auto-bound methods in a component.
	 *
	 * @param {object} component Component whose method is going to be bound.
	 */
	function bindAutoBindMethods(component) {
	  var pairs = component.__reactAutoBindPairs;
	  for (var i = 0; i < pairs.length; i += 2) {
	    var autoBindKey = pairs[i];
	    var method = pairs[i + 1];
	    component[autoBindKey] = bindAutoBindMethod(component, method);
	  }
	}

	/**
	 * Add more to the ReactClass base class. These are all legacy features and
	 * therefore not already part of the modern ReactComponent.
	 */
	var ReactClassMixin = {

	  /**
	   * TODO: This will be deprecated because state should always keep a consistent
	   * type signature and the only use case for this, is to avoid that.
	   */
	  replaceState: function replaceState(newState, callback) {
	    this.updater.enqueueReplaceState(this, newState);
	    if (callback) {
	      this.updater.enqueueCallback(this, callback, 'replaceState');
	    }
	  },

	  /**
	   * Checks whether or not this composite component is mounted.
	   * @return {boolean} True if mounted, false otherwise.
	   * @protected
	   * @final
	   */
	  isMounted: function isMounted() {
	    return this.updater.isMounted(this);
	  }
	};

	var ReactClassComponent = function ReactClassComponent() {};
	_assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);

	/**
	 * Module for creating composite components.
	 *
	 * @class ReactClass
	 */
	var ReactClass = {

	  /**
	   * Creates a composite component class given a class specification.
	   *
	   * @param {object} spec Class specification (which must define `render`).
	   * @return {function} Component constructor function.
	   * @public
	   */
	  createClass: function createClass(spec) {
	    var Constructor = function Constructor(props, context, updater) {
	      // This constructor gets overridden by mocks. The argument is used
	      // by mocks to assert on what gets mounted.

	      if (process.env.NODE_ENV !== 'production') {
	        process.env.NODE_ENV !== 'production' ? warning(this instanceof Constructor, 'Something is calling a React component directly. Use a factory or ' + 'JSX instead. See: https://fb.me/react-legacyfactory') : void 0;
	      }

	      // Wire up auto-binding
	      if (this.__reactAutoBindPairs.length) {
	        bindAutoBindMethods(this);
	      }

	      this.props = props;
	      this.context = context;
	      this.refs = emptyObject;
	      this.updater = updater || ReactNoopUpdateQueue;

	      this.state = null;

	      // ReactClasses doesn't have constructors. Instead, they use the
	      // getInitialState and componentWillMount methods for initialization.

	      var initialState = this.getInitialState ? this.getInitialState() : null;
	      if (process.env.NODE_ENV !== 'production') {
	        // We allow auto-mocks to proceed as if they're returning null.
	        if (initialState === undefined && this.getInitialState._isMockFunction) {
	          // This is probably bad practice. Consider warning here and
	          // deprecating this convenience.
	          initialState = null;
	        }
	      }
	      !((typeof initialState === 'undefined' ? 'undefined' : _typeof(initialState)) === 'object' && !Array.isArray(initialState)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent') : invariant(false) : void 0;

	      this.state = initialState;
	    };
	    Constructor.prototype = new ReactClassComponent();
	    Constructor.prototype.constructor = Constructor;
	    Constructor.prototype.__reactAutoBindPairs = [];

	    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

	    mixSpecIntoComponent(Constructor, spec);

	    // Initialize the defaultProps property after all mixins have been merged.
	    if (Constructor.getDefaultProps) {
	      Constructor.defaultProps = Constructor.getDefaultProps();
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      // This is a tag to indicate that the use of these method names is ok,
	      // since it's used with createClass. If it's not, then it's likely a
	      // mistake so we'll warn you to use the static property, property
	      // initializer or constructor respectively.
	      if (Constructor.getDefaultProps) {
	        Constructor.getDefaultProps.isReactClassApproved = {};
	      }
	      if (Constructor.prototype.getInitialState) {
	        Constructor.prototype.getInitialState.isReactClassApproved = {};
	      }
	    }

	    !Constructor.prototype.render ? process.env.NODE_ENV !== 'production' ? invariant(false, 'createClass(...): Class specification must implement a `render` method.') : invariant(false) : void 0;

	    if (process.env.NODE_ENV !== 'production') {
	      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', spec.displayName || 'A component') : void 0;
	      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', spec.displayName || 'A component') : void 0;
	    }

	    // Reduce time spent doing lookups by setting these on the prototype.
	    for (var methodName in ReactClassInterface) {
	      if (!Constructor.prototype[methodName]) {
	        Constructor.prototype[methodName] = null;
	      }
	    }

	    return Constructor;
	  },

	  injection: {
	    injectMixin: function injectMixin(mixin) {
	      injectedMixins.push(mixin);
	    }
	  }

	};

	module.exports = ReactClass;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactPropTypeLocations
	 */

	'use strict';

	var keyMirror = __webpack_require__(30);

	var ReactPropTypeLocations = keyMirror({
	  prop: null,
	  context: null,
	  childContext: null
	});

	module.exports = ReactPropTypeLocations;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks static-only
	 */

	'use strict';

	var invariant = __webpack_require__(14);

	/**
	 * Constructs an enumeration with keys equal to their value.
	 *
	 * For example:
	 *
	 *   var COLORS = keyMirror({blue: null, red: null});
	 *   var myColor = COLORS.blue;
	 *   var isColorValid = !!COLORS[myColor];
	 *
	 * The last line could not be performed if the values of the generated enum were
	 * not equal to their keys.
	 *
	 *   Input:  {key1: val1, key2: val2}
	 *   Output: {key1: key1, key2: key2}
	 *
	 * @param {object} obj
	 * @return {object}
	 */
	var keyMirror = function keyMirror(obj) {
	  var ret = {};
	  var key;
	  !(obj instanceof Object && !Array.isArray(obj)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'keyMirror(...): Argument must be an object.') : invariant(false) : void 0;
	  for (key in obj) {
	    if (!obj.hasOwnProperty(key)) {
	      continue;
	    }
	    ret[key] = key;
	  }
	  return ret;
	};

	module.exports = keyMirror;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactPropTypeLocationNames
	 */

	'use strict';

	var ReactPropTypeLocationNames = {};

	if (process.env.NODE_ENV !== 'production') {
	  ReactPropTypeLocationNames = {
	    prop: 'prop',
	    context: 'context',
	    childContext: 'child context'
	  };
	}

	module.exports = ReactPropTypeLocationNames;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	/**
	 * Allows extraction of a minified key. Let's the build system minify keys
	 * without losing the ability to dynamically use key strings as values
	 * themselves. Pass in an object with a single key/val pair and it will return
	 * you the string key of that single record. Suppose you want to grab the
	 * value for a key 'className' inside of an object. Key/val minification may
	 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
	 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
	 * reuse those resolutions.
	 */

	var keyOf = function keyOf(oneKeyObj) {
	  var key;
	  for (key in oneKeyObj) {
	    if (!oneKeyObj.hasOwnProperty(key)) {
	      continue;
	    }
	    return key;
	  }
	  return null;
	};

	module.exports = keyOf;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactDOMFactories
	 */

	'use strict';

	var ReactElement = __webpack_require__(15);
	var ReactElementValidator = __webpack_require__(34);

	var mapObject = __webpack_require__(35);

	/**
	 * Create a factory that creates HTML tag elements.
	 *
	 * @param {string} tag Tag name (e.g. `div`).
	 * @private
	 */
	function createDOMFactory(tag) {
	  if (process.env.NODE_ENV !== 'production') {
	    return ReactElementValidator.createFactory(tag);
	  }
	  return ReactElement.createFactory(tag);
	}

	/**
	 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
	 * This is also accessible via `React.DOM`.
	 *
	 * @public
	 */
	var ReactDOMFactories = mapObject({
	  a: 'a',
	  abbr: 'abbr',
	  address: 'address',
	  area: 'area',
	  article: 'article',
	  aside: 'aside',
	  audio: 'audio',
	  b: 'b',
	  base: 'base',
	  bdi: 'bdi',
	  bdo: 'bdo',
	  big: 'big',
	  blockquote: 'blockquote',
	  body: 'body',
	  br: 'br',
	  button: 'button',
	  canvas: 'canvas',
	  caption: 'caption',
	  cite: 'cite',
	  code: 'code',
	  col: 'col',
	  colgroup: 'colgroup',
	  data: 'data',
	  datalist: 'datalist',
	  dd: 'dd',
	  del: 'del',
	  details: 'details',
	  dfn: 'dfn',
	  dialog: 'dialog',
	  div: 'div',
	  dl: 'dl',
	  dt: 'dt',
	  em: 'em',
	  embed: 'embed',
	  fieldset: 'fieldset',
	  figcaption: 'figcaption',
	  figure: 'figure',
	  footer: 'footer',
	  form: 'form',
	  h1: 'h1',
	  h2: 'h2',
	  h3: 'h3',
	  h4: 'h4',
	  h5: 'h5',
	  h6: 'h6',
	  head: 'head',
	  header: 'header',
	  hgroup: 'hgroup',
	  hr: 'hr',
	  html: 'html',
	  i: 'i',
	  iframe: 'iframe',
	  img: 'img',
	  input: 'input',
	  ins: 'ins',
	  kbd: 'kbd',
	  keygen: 'keygen',
	  label: 'label',
	  legend: 'legend',
	  li: 'li',
	  link: 'link',
	  main: 'main',
	  map: 'map',
	  mark: 'mark',
	  menu: 'menu',
	  menuitem: 'menuitem',
	  meta: 'meta',
	  meter: 'meter',
	  nav: 'nav',
	  noscript: 'noscript',
	  object: 'object',
	  ol: 'ol',
	  optgroup: 'optgroup',
	  option: 'option',
	  output: 'output',
	  p: 'p',
	  param: 'param',
	  picture: 'picture',
	  pre: 'pre',
	  progress: 'progress',
	  q: 'q',
	  rp: 'rp',
	  rt: 'rt',
	  ruby: 'ruby',
	  s: 's',
	  samp: 'samp',
	  script: 'script',
	  section: 'section',
	  select: 'select',
	  small: 'small',
	  source: 'source',
	  span: 'span',
	  strong: 'strong',
	  style: 'style',
	  sub: 'sub',
	  summary: 'summary',
	  sup: 'sup',
	  table: 'table',
	  tbody: 'tbody',
	  td: 'td',
	  textarea: 'textarea',
	  tfoot: 'tfoot',
	  th: 'th',
	  thead: 'thead',
	  time: 'time',
	  title: 'title',
	  tr: 'tr',
	  track: 'track',
	  u: 'u',
	  ul: 'ul',
	  'var': 'var',
	  video: 'video',
	  wbr: 'wbr',

	  // SVG
	  circle: 'circle',
	  clipPath: 'clipPath',
	  defs: 'defs',
	  ellipse: 'ellipse',
	  g: 'g',
	  image: 'image',
	  line: 'line',
	  linearGradient: 'linearGradient',
	  mask: 'mask',
	  path: 'path',
	  pattern: 'pattern',
	  polygon: 'polygon',
	  polyline: 'polyline',
	  radialGradient: 'radialGradient',
	  rect: 'rect',
	  stop: 'stop',
	  svg: 'svg',
	  text: 'text',
	  tspan: 'tspan'

	}, createDOMFactory);

	module.exports = ReactDOMFactories;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactElementValidator
	 */

	/**
	 * ReactElementValidator provides a wrapper around a element factory
	 * which validates the props passed to the element. This is intended to be
	 * used only in DEV and could be replaced by a static type checker for languages
	 * that support it.
	 */

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var ReactElement = __webpack_require__(15);
	var ReactPropTypeLocations = __webpack_require__(29);
	var ReactPropTypeLocationNames = __webpack_require__(31);
	var ReactCurrentOwner = __webpack_require__(16);

	var canDefineProperty = __webpack_require__(19);
	var getIteratorFn = __webpack_require__(21);
	var invariant = __webpack_require__(14);
	var warning = __webpack_require__(17);

	function getDeclarationErrorAddendum() {
	  if (ReactCurrentOwner.current) {
	    var name = ReactCurrentOwner.current.getName();
	    if (name) {
	      return ' Check the render method of `' + name + '`.';
	    }
	  }
	  return '';
	}

	/**
	 * Warn if there's no key explicitly set on dynamic arrays of children or
	 * object keys are not valid. This allows us to keep track of children between
	 * updates.
	 */
	var ownerHasKeyUseWarning = {};

	var loggedTypeFailures = {};

	/**
	 * Warn if the element doesn't have an explicit key assigned to it.
	 * This element is in an array. The array could grow and shrink or be
	 * reordered. All children that haven't already been validated are required to
	 * have a "key" property assigned to it.
	 *
	 * @internal
	 * @param {ReactElement} element Element that requires a key.
	 * @param {*} parentType element's parent's type.
	 */
	function validateExplicitKey(element, parentType) {
	  if (!element._store || element._store.validated || element.key != null) {
	    return;
	  }
	  element._store.validated = true;

	  var addenda = getAddendaForKeyUse('uniqueKey', element, parentType);
	  if (addenda === null) {
	    // we already showed the warning
	    return;
	  }
	  process.env.NODE_ENV !== 'production' ? warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s%s', addenda.parentOrOwner || '', addenda.childOwner || '', addenda.url || '') : void 0;
	}

	/**
	 * Shared warning and monitoring code for the key warnings.
	 *
	 * @internal
	 * @param {string} messageType A key used for de-duping warnings.
	 * @param {ReactElement} element Component that requires a key.
	 * @param {*} parentType element's parent's type.
	 * @returns {?object} A set of addenda to use in the warning message, or null
	 * if the warning has already been shown before (and shouldn't be shown again).
	 */
	function getAddendaForKeyUse(messageType, element, parentType) {
	  var addendum = getDeclarationErrorAddendum();
	  if (!addendum) {
	    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
	    if (parentName) {
	      addendum = ' Check the top-level render call using <' + parentName + '>.';
	    }
	  }

	  var memoizer = ownerHasKeyUseWarning[messageType] || (ownerHasKeyUseWarning[messageType] = {});
	  if (memoizer[addendum]) {
	    return null;
	  }
	  memoizer[addendum] = true;

	  var addenda = {
	    parentOrOwner: addendum,
	    url: ' See https://fb.me/react-warning-keys for more information.',
	    childOwner: null
	  };

	  // Usually the current owner is the offender, but if it accepts children as a
	  // property, it may be the creator of the child that's responsible for
	  // assigning it a key.
	  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
	    // Give the component that originally created this child.
	    addenda.childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
	  }

	  return addenda;
	}

	/**
	 * Ensure that every element either is passed in a static location, in an
	 * array with an explicit keys property defined, or in an object literal
	 * with valid key property.
	 *
	 * @internal
	 * @param {ReactNode} node Statically passed child of any type.
	 * @param {*} parentType node's parent's type.
	 */
	function validateChildKeys(node, parentType) {
	  if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) !== 'object') {
	    return;
	  }
	  if (Array.isArray(node)) {
	    for (var i = 0; i < node.length; i++) {
	      var child = node[i];
	      if (ReactElement.isValidElement(child)) {
	        validateExplicitKey(child, parentType);
	      }
	    }
	  } else if (ReactElement.isValidElement(node)) {
	    // This element was passed in a valid location.
	    if (node._store) {
	      node._store.validated = true;
	    }
	  } else if (node) {
	    var iteratorFn = getIteratorFn(node);
	    // Entry iterators provide implicit keys.
	    if (iteratorFn) {
	      if (iteratorFn !== node.entries) {
	        var iterator = iteratorFn.call(node);
	        var step;
	        while (!(step = iterator.next()).done) {
	          if (ReactElement.isValidElement(step.value)) {
	            validateExplicitKey(step.value, parentType);
	          }
	        }
	      }
	    }
	  }
	}

	/**
	 * Assert that the props are valid
	 *
	 * @param {string} componentName Name of the component for error messages.
	 * @param {object} propTypes Map of prop name to a ReactPropType
	 * @param {object} props
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @private
	 */
	function checkPropTypes(componentName, propTypes, props, location) {
	  for (var propName in propTypes) {
	    if (propTypes.hasOwnProperty(propName)) {
	      var error;
	      // Prop type validation may throw. In case they do, we don't want to
	      // fail the render phase where it didn't fail before. So we log it.
	      // After these have been cleaned up, we'll let them throw.
	      try {
	        // This is intentionally an invariant that gets caught. It's the same
	        // behavior as without this statement except with a better message.
	        !(typeof propTypes[propName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], propName) : invariant(false) : void 0;
	        error = propTypes[propName](props, propName, componentName, location);
	      } catch (ex) {
	        error = ex;
	      }
	      process.env.NODE_ENV !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], propName, typeof error === 'undefined' ? 'undefined' : _typeof(error)) : void 0;
	      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	        // Only monitor this failure once because there tends to be a lot of the
	        // same error.
	        loggedTypeFailures[error.message] = true;

	        var addendum = getDeclarationErrorAddendum();
	        process.env.NODE_ENV !== 'production' ? warning(false, 'Failed propType: %s%s', error.message, addendum) : void 0;
	      }
	    }
	  }
	}

	/**
	 * Given an element, validate that its props follow the propTypes definition,
	 * provided by the type.
	 *
	 * @param {ReactElement} element
	 */
	function validatePropTypes(element) {
	  var componentClass = element.type;
	  if (typeof componentClass !== 'function') {
	    return;
	  }
	  var name = componentClass.displayName || componentClass.name;
	  if (componentClass.propTypes) {
	    checkPropTypes(name, componentClass.propTypes, element.props, ReactPropTypeLocations.prop);
	  }
	  if (typeof componentClass.getDefaultProps === 'function') {
	    process.env.NODE_ENV !== 'production' ? warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
	  }
	}

	var ReactElementValidator = {

	  createElement: function createElement(type, props, children) {
	    var validType = typeof type === 'string' || typeof type === 'function';
	    // We warn in this case but don't throw. We expect the element creation to
	    // succeed and there will likely be errors in render.
	    process.env.NODE_ENV !== 'production' ? warning(validType, 'React.createElement: type should not be null, undefined, boolean, or ' + 'number. It should be a string (for DOM elements) or a ReactClass ' + '(for composite components).%s', getDeclarationErrorAddendum()) : void 0;

	    var element = ReactElement.createElement.apply(this, arguments);

	    // The result can be nullish if a mock or a custom function is used.
	    // TODO: Drop this when these are no longer allowed as the type argument.
	    if (element == null) {
	      return element;
	    }

	    // Skip key warning if the type isn't valid since our key validation logic
	    // doesn't expect a non-string/function type and can throw confusing errors.
	    // We don't want exception behavior to differ between dev and prod.
	    // (Rendering will throw with a helpful message and as soon as the type is
	    // fixed, the key warnings will appear.)
	    if (validType) {
	      for (var i = 2; i < arguments.length; i++) {
	        validateChildKeys(arguments[i], type);
	      }
	    }

	    validatePropTypes(element);

	    return element;
	  },

	  createFactory: function createFactory(type) {
	    var validatedFactory = ReactElementValidator.createElement.bind(null, type);
	    // Legacy hook TODO: Warn if this is accessed
	    validatedFactory.type = type;

	    if (process.env.NODE_ENV !== 'production') {
	      if (canDefineProperty) {
	        Object.defineProperty(validatedFactory, 'type', {
	          enumerable: false,
	          get: function get() {
	            process.env.NODE_ENV !== 'production' ? warning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.') : void 0;
	            Object.defineProperty(this, 'type', {
	              value: type
	            });
	            return type;
	          }
	        });
	      }
	    }

	    return validatedFactory;
	  },

	  cloneElement: function cloneElement(element, props, children) {
	    var newElement = ReactElement.cloneElement.apply(this, arguments);
	    for (var i = 2; i < arguments.length; i++) {
	      validateChildKeys(arguments[i], newElement.type);
	    }
	    validatePropTypes(newElement);
	    return newElement;
	  }

	};

	module.exports = ReactElementValidator;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 35 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Executes the provided `callback` once for each enumerable own property in the
	 * object and constructs a new object from the results. The `callback` is
	 * invoked with three arguments:
	 *
	 *  - the property value
	 *  - the property name
	 *  - the object being traversed
	 *
	 * Properties that are added after the call to `mapObject` will not be visited
	 * by `callback`. If the values of existing properties are changed, the value
	 * passed to `callback` will be the value at the time `mapObject` visits them.
	 * Properties that are deleted before being visited are not visited.
	 *
	 * @grep function objectMap()
	 * @grep function objMap()
	 *
	 * @param {?object} object
	 * @param {function} callback
	 * @param {*} context
	 * @return {?object}
	 */
	function mapObject(object, callback, context) {
	  if (!object) {
	    return null;
	  }
	  var result = {};
	  for (var name in object) {
	    if (hasOwnProperty.call(object, name)) {
	      result[name] = callback.call(context, object[name], name, object);
	    }
	  }
	  return result;
	}

	module.exports = mapObject;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactPropTypes
	 */

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var ReactElement = __webpack_require__(15);
	var ReactPropTypeLocationNames = __webpack_require__(31);

	var emptyFunction = __webpack_require__(18);
	var getIteratorFn = __webpack_require__(21);

	/**
	 * Collection of methods that allow declaration and validation of props that are
	 * supplied to React components. Example usage:
	 *
	 *   var Props = require('ReactPropTypes');
	 *   var MyArticle = React.createClass({
	 *     propTypes: {
	 *       // An optional string prop named "description".
	 *       description: Props.string,
	 *
	 *       // A required enum prop named "category".
	 *       category: Props.oneOf(['News','Photos']).isRequired,
	 *
	 *       // A prop named "dialog" that requires an instance of Dialog.
	 *       dialog: Props.instanceOf(Dialog).isRequired
	 *     },
	 *     render: function() { ... }
	 *   });
	 *
	 * A more formal specification of how these methods are used:
	 *
	 *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	 *   decl := ReactPropTypes.{type}(.isRequired)?
	 *
	 * Each and every declaration produces a function with the same signature. This
	 * allows the creation of custom validation functions. For example:
	 *
	 *  var MyLink = React.createClass({
	 *    propTypes: {
	 *      // An optional string or URI prop named "href".
	 *      href: function(props, propName, componentName) {
	 *        var propValue = props[propName];
	 *        if (propValue != null && typeof propValue !== 'string' &&
	 *            !(propValue instanceof URI)) {
	 *          return new Error(
	 *            'Expected a string or an URI for ' + propName + ' in ' +
	 *            componentName
	 *          );
	 *        }
	 *      }
	 *    },
	 *    render: function() {...}
	 *  });
	 *
	 * @internal
	 */

	var ANONYMOUS = '<<anonymous>>';

	var ReactPropTypes = {
	  array: createPrimitiveTypeChecker('array'),
	  bool: createPrimitiveTypeChecker('boolean'),
	  func: createPrimitiveTypeChecker('function'),
	  number: createPrimitiveTypeChecker('number'),
	  object: createPrimitiveTypeChecker('object'),
	  string: createPrimitiveTypeChecker('string'),

	  any: createAnyTypeChecker(),
	  arrayOf: createArrayOfTypeChecker,
	  element: createElementTypeChecker(),
	  instanceOf: createInstanceTypeChecker,
	  node: createNodeChecker(),
	  objectOf: createObjectOfTypeChecker,
	  oneOf: createEnumTypeChecker,
	  oneOfType: createUnionTypeChecker,
	  shape: createShapeTypeChecker
	};

	/**
	 * inlined Object.is polyfill to avoid requiring consumers ship their own
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	 */
	/*eslint-disable no-self-compare*/
	function is(x, y) {
	  // SameValue algorithm
	  if (x === y) {
	    // Steps 1-5, 7-10
	    // Steps 6.b-6.e: +0 != -0
	    return x !== 0 || 1 / x === 1 / y;
	  } else {
	    // Step 6.a: NaN == NaN
	    return x !== x && y !== y;
	  }
	}
	/*eslint-enable no-self-compare*/

	function createChainableTypeChecker(validate) {
	  function checkType(isRequired, props, propName, componentName, location, propFullName) {
	    componentName = componentName || ANONYMOUS;
	    propFullName = propFullName || propName;
	    if (props[propName] == null) {
	      var locationName = ReactPropTypeLocationNames[location];
	      if (isRequired) {
	        return new Error('Required ' + locationName + ' `' + propFullName + '` was not specified in ' + ('`' + componentName + '`.'));
	      }
	      return null;
	    } else {
	      return validate(props, propName, componentName, location, propFullName);
	    }
	  }

	  var chainedCheckType = checkType.bind(null, false);
	  chainedCheckType.isRequired = checkType.bind(null, true);

	  return chainedCheckType;
	}

	function createPrimitiveTypeChecker(expectedType) {
	  function validate(props, propName, componentName, location, propFullName) {
	    var propValue = props[propName];
	    var propType = getPropType(propValue);
	    if (propType !== expectedType) {
	      var locationName = ReactPropTypeLocationNames[location];
	      // `propValue` being instance of, say, date/regexp, pass the 'object'
	      // check, but we can offer a more precise error message here rather than
	      // 'of type `object`'.
	      var preciseType = getPreciseType(propValue);

	      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createAnyTypeChecker() {
	  return createChainableTypeChecker(emptyFunction.thatReturns(null));
	}

	function createArrayOfTypeChecker(typeChecker) {
	  function validate(props, propName, componentName, location, propFullName) {
	    if (typeof typeChecker !== 'function') {
	      return new Error('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	    }
	    var propValue = props[propName];
	    if (!Array.isArray(propValue)) {
	      var locationName = ReactPropTypeLocationNames[location];
	      var propType = getPropType(propValue);
	      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	    }
	    for (var i = 0; i < propValue.length; i++) {
	      var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']');
	      if (error instanceof Error) {
	        return error;
	      }
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createElementTypeChecker() {
	  function validate(props, propName, componentName, location, propFullName) {
	    if (!ReactElement.isValidElement(props[propName])) {
	      var locationName = ReactPropTypeLocationNames[location];
	      return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a single ReactElement.'));
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createInstanceTypeChecker(expectedClass) {
	  function validate(props, propName, componentName, location, propFullName) {
	    if (!(props[propName] instanceof expectedClass)) {
	      var locationName = ReactPropTypeLocationNames[location];
	      var expectedClassName = expectedClass.name || ANONYMOUS;
	      var actualClassName = getClassName(props[propName]);
	      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createEnumTypeChecker(expectedValues) {
	  if (!Array.isArray(expectedValues)) {
	    return createChainableTypeChecker(function () {
	      return new Error('Invalid argument supplied to oneOf, expected an instance of array.');
	    });
	  }

	  function validate(props, propName, componentName, location, propFullName) {
	    var propValue = props[propName];
	    for (var i = 0; i < expectedValues.length; i++) {
	      if (is(propValue, expectedValues[i])) {
	        return null;
	      }
	    }

	    var locationName = ReactPropTypeLocationNames[location];
	    var valuesString = JSON.stringify(expectedValues);
	    return new Error('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	  }
	  return createChainableTypeChecker(validate);
	}

	function createObjectOfTypeChecker(typeChecker) {
	  function validate(props, propName, componentName, location, propFullName) {
	    if (typeof typeChecker !== 'function') {
	      return new Error('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	    }
	    var propValue = props[propName];
	    var propType = getPropType(propValue);
	    if (propType !== 'object') {
	      var locationName = ReactPropTypeLocationNames[location];
	      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	    }
	    for (var key in propValue) {
	      if (propValue.hasOwnProperty(key)) {
	        var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createUnionTypeChecker(arrayOfTypeCheckers) {
	  if (!Array.isArray(arrayOfTypeCheckers)) {
	    return createChainableTypeChecker(function () {
	      return new Error('Invalid argument supplied to oneOfType, expected an instance of array.');
	    });
	  }

	  function validate(props, propName, componentName, location, propFullName) {
	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (checker(props, propName, componentName, location, propFullName) == null) {
	        return null;
	      }
	    }

	    var locationName = ReactPropTypeLocationNames[location];
	    return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
	  }
	  return createChainableTypeChecker(validate);
	}

	function createNodeChecker() {
	  function validate(props, propName, componentName, location, propFullName) {
	    if (!isNode(props[propName])) {
	      var locationName = ReactPropTypeLocationNames[location];
	      return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createShapeTypeChecker(shapeTypes) {
	  function validate(props, propName, componentName, location, propFullName) {
	    var propValue = props[propName];
	    var propType = getPropType(propValue);
	    if (propType !== 'object') {
	      var locationName = ReactPropTypeLocationNames[location];
	      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	    }
	    for (var key in shapeTypes) {
	      var checker = shapeTypes[key];
	      if (!checker) {
	        continue;
	      }
	      var error = checker(propValue, key, componentName, location, propFullName + '.' + key);
	      if (error) {
	        return error;
	      }
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function isNode(propValue) {
	  switch (typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue)) {
	    case 'number':
	    case 'string':
	    case 'undefined':
	      return true;
	    case 'boolean':
	      return !propValue;
	    case 'object':
	      if (Array.isArray(propValue)) {
	        return propValue.every(isNode);
	      }
	      if (propValue === null || ReactElement.isValidElement(propValue)) {
	        return true;
	      }

	      var iteratorFn = getIteratorFn(propValue);
	      if (iteratorFn) {
	        var iterator = iteratorFn.call(propValue);
	        var step;
	        if (iteratorFn !== propValue.entries) {
	          while (!(step = iterator.next()).done) {
	            if (!isNode(step.value)) {
	              return false;
	            }
	          }
	        } else {
	          // Iterator will provide entry [k,v] tuples rather than values.
	          while (!(step = iterator.next()).done) {
	            var entry = step.value;
	            if (entry) {
	              if (!isNode(entry[1])) {
	                return false;
	              }
	            }
	          }
	        }
	      } else {
	        return false;
	      }

	      return true;
	    default:
	      return false;
	  }
	}

	// Equivalent of `typeof` but with special handling for array and regexp.
	function getPropType(propValue) {
	  var propType = typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue);
	  if (Array.isArray(propValue)) {
	    return 'array';
	  }
	  if (propValue instanceof RegExp) {
	    // Old webkits (at least until Android 4.0) return 'function' rather than
	    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	    // passes PropTypes.object.
	    return 'object';
	  }
	  return propType;
	}

	// This handles more types than `getPropType`. Only used for error messages.
	// See `createPrimitiveTypeChecker`.
	function getPreciseType(propValue) {
	  var propType = getPropType(propValue);
	  if (propType === 'object') {
	    if (propValue instanceof Date) {
	      return 'date';
	    } else if (propValue instanceof RegExp) {
	      return 'regexp';
	    }
	  }
	  return propType;
	}

	// Returns class name of the object, if any.
	function getClassName(propValue) {
	  if (!propValue.constructor || !propValue.constructor.name) {
	    return ANONYMOUS;
	  }
	  return propValue.constructor.name;
	}

	module.exports = ReactPropTypes;

/***/ },
/* 37 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactVersion
	 */

	'use strict';

	module.exports = '15.0.1';

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule onlyChild
	 */
	'use strict';

	var ReactElement = __webpack_require__(15);

	var invariant = __webpack_require__(14);

	/**
	 * Returns the first child in a collection of children and verifies that there
	 * is only one child in the collection. The current implementation of this
	 * function assumes that a single child gets passed without a wrapper, but the
	 * purpose of this helper function is to abstract away the particular structure
	 * of children.
	 *
	 * @param {?object} children Child collection structure.
	 * @return {ReactComponent} The first and only `ReactComponent` contained in the
	 * structure.
	 */
	function onlyChild(children) {
	  !ReactElement.isValidElement(children) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'onlyChild must be passed a children with exactly one child.') : invariant(false) : void 0;
	  return children;
	}

	module.exports = onlyChild;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// commonmark.js - CommomMark in JavaScript
	// Copyright (C) 2014 John MacFarlane
	// License: BSD3.

	// Basic usage:
	//
	// var commonmark = require('commonmark');
	// var parser = new commonmark.Parser();
	// var renderer = new commonmark.HtmlRenderer();
	// console.log(renderer.render(parser.parse('Hello *world*')));

	module.exports.version = '0.24.0';
	module.exports.Node = __webpack_require__(40);
	module.exports.Parser = __webpack_require__(41);
	module.exports.HtmlRenderer = __webpack_require__(57);
	module.exports.XmlRenderer = __webpack_require__(58);

/***/ },
/* 40 */
/***/ function(module, exports) {

	"use strict";

	function isContainer(node) {
	    switch (node._type) {
	        case 'Document':
	        case 'BlockQuote':
	        case 'List':
	        case 'Item':
	        case 'Paragraph':
	        case 'Heading':
	        case 'Emph':
	        case 'Strong':
	        case 'Link':
	        case 'Image':
	        case 'CustomInline':
	        case 'CustomBlock':
	            return true;
	        default:
	            return false;
	    }
	}

	var resumeAt = function resumeAt(node, entering) {
	    this.current = node;
	    this.entering = entering === true;
	};

	var next = function next() {
	    var cur = this.current;
	    var entering = this.entering;

	    if (cur === null) {
	        return null;
	    }

	    var container = isContainer(cur);

	    if (entering && container) {
	        if (cur._firstChild) {
	            this.current = cur._firstChild;
	            this.entering = true;
	        } else {
	            // stay on node but exit
	            this.entering = false;
	        }
	    } else if (cur === this.root) {
	        this.current = null;
	    } else if (cur._next === null) {
	        this.current = cur._parent;
	        this.entering = false;
	    } else {
	        this.current = cur._next;
	        this.entering = true;
	    }

	    return { entering: entering, node: cur };
	};

	var NodeWalker = function NodeWalker(root) {
	    return { current: root,
	        root: root,
	        entering: true,
	        next: next,
	        resumeAt: resumeAt };
	};

	var Node = function Node(nodeType, sourcepos) {
	    this._type = nodeType;
	    this._parent = null;
	    this._firstChild = null;
	    this._lastChild = null;
	    this._prev = null;
	    this._next = null;
	    this._sourcepos = sourcepos;
	    this._lastLineBlank = false;
	    this._open = true;
	    this._string_content = null;
	    this._literal = null;
	    this._listData = {};
	    this._info = null;
	    this._destination = null;
	    this._title = null;
	    this._isFenced = false;
	    this._fenceChar = null;
	    this._fenceLength = 0;
	    this._fenceOffset = null;
	    this._level = null;
	    this._onEnter = null;
	    this._onExit = null;
	};

	var proto = Node.prototype;

	Object.defineProperty(proto, 'isContainer', {
	    get: function get() {
	        return isContainer(this);
	    }
	});

	Object.defineProperty(proto, 'type', {
	    get: function get() {
	        return this._type;
	    }
	});

	Object.defineProperty(proto, 'firstChild', {
	    get: function get() {
	        return this._firstChild;
	    }
	});

	Object.defineProperty(proto, 'lastChild', {
	    get: function get() {
	        return this._lastChild;
	    }
	});

	Object.defineProperty(proto, 'next', {
	    get: function get() {
	        return this._next;
	    }
	});

	Object.defineProperty(proto, 'prev', {
	    get: function get() {
	        return this._prev;
	    }
	});

	Object.defineProperty(proto, 'parent', {
	    get: function get() {
	        return this._parent;
	    }
	});

	Object.defineProperty(proto, 'sourcepos', {
	    get: function get() {
	        return this._sourcepos;
	    }
	});

	Object.defineProperty(proto, 'literal', {
	    get: function get() {
	        return this._literal;
	    },
	    set: function set(s) {
	        this._literal = s;
	    }
	});

	Object.defineProperty(proto, 'destination', {
	    get: function get() {
	        return this._destination;
	    },
	    set: function set(s) {
	        this._destination = s;
	    }
	});

	Object.defineProperty(proto, 'title', {
	    get: function get() {
	        return this._title;
	    },
	    set: function set(s) {
	        this._title = s;
	    }
	});

	Object.defineProperty(proto, 'info', {
	    get: function get() {
	        return this._info;
	    },
	    set: function set(s) {
	        this._info = s;
	    }
	});

	Object.defineProperty(proto, 'level', {
	    get: function get() {
	        return this._level;
	    },
	    set: function set(s) {
	        this._level = s;
	    }
	});

	Object.defineProperty(proto, 'listType', {
	    get: function get() {
	        return this._listData.type;
	    },
	    set: function set(t) {
	        this._listData.type = t;
	    }
	});

	Object.defineProperty(proto, 'listTight', {
	    get: function get() {
	        return this._listData.tight;
	    },
	    set: function set(t) {
	        this._listData.tight = t;
	    }
	});

	Object.defineProperty(proto, 'listStart', {
	    get: function get() {
	        return this._listData.start;
	    },
	    set: function set(n) {
	        this._listData.start = n;
	    }
	});

	Object.defineProperty(proto, 'listDelimiter', {
	    get: function get() {
	        return this._listData.delimiter;
	    },
	    set: function set(delim) {
	        this._listData.delimiter = delim;
	    }
	});

	Object.defineProperty(proto, 'onEnter', {
	    get: function get() {
	        return this._onEnter;
	    },
	    set: function set(s) {
	        this._onEnter = s;
	    }
	});

	Object.defineProperty(proto, 'onExit', {
	    get: function get() {
	        return this._onExit;
	    },
	    set: function set(s) {
	        this._onExit = s;
	    }
	});

	Node.prototype.appendChild = function (child) {
	    child.unlink();
	    child._parent = this;
	    if (this._lastChild) {
	        this._lastChild._next = child;
	        child._prev = this._lastChild;
	        this._lastChild = child;
	    } else {
	        this._firstChild = child;
	        this._lastChild = child;
	    }
	};

	Node.prototype.prependChild = function (child) {
	    child.unlink();
	    child._parent = this;
	    if (this._firstChild) {
	        this._firstChild._prev = child;
	        child._next = this._firstChild;
	        this._firstChild = child;
	    } else {
	        this._firstChild = child;
	        this._lastChild = child;
	    }
	};

	Node.prototype.unlink = function () {
	    if (this._prev) {
	        this._prev._next = this._next;
	    } else if (this._parent) {
	        this._parent._firstChild = this._next;
	    }
	    if (this._next) {
	        this._next._prev = this._prev;
	    } else if (this._parent) {
	        this._parent._lastChild = this._prev;
	    }
	    this._parent = null;
	    this._next = null;
	    this._prev = null;
	};

	Node.prototype.insertAfter = function (sibling) {
	    sibling.unlink();
	    sibling._next = this._next;
	    if (sibling._next) {
	        sibling._next._prev = sibling;
	    }
	    sibling._prev = this;
	    this._next = sibling;
	    sibling._parent = this._parent;
	    if (!sibling._next) {
	        sibling._parent._lastChild = sibling;
	    }
	};

	Node.prototype.insertBefore = function (sibling) {
	    sibling.unlink();
	    sibling._prev = this._prev;
	    if (sibling._prev) {
	        sibling._prev._next = sibling;
	    }
	    sibling._next = this;
	    this._prev = sibling;
	    sibling._parent = this._parent;
	    if (!sibling._prev) {
	        sibling._parent._firstChild = sibling;
	    }
	};

	Node.prototype.walker = function () {
	    var walker = new NodeWalker(this);
	    return walker;
	};

	module.exports = Node;

	/* Example of use of walker:

	 var walker = w.walker();
	 var event;

	 while (event = walker.next()) {
	 console.log(event.entering, event.node.type);
	 }

	 */

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Node = __webpack_require__(40);
	var unescapeString = __webpack_require__(42).unescapeString;
	var OPENTAG = __webpack_require__(42).OPENTAG;
	var CLOSETAG = __webpack_require__(42).CLOSETAG;

	var CODE_INDENT = 4;

	var C_TAB = 9;
	var C_NEWLINE = 10;
	var C_GREATERTHAN = 62;
	var C_LESSTHAN = 60;
	var C_SPACE = 32;
	var C_OPEN_BRACKET = 91;

	var InlineParser = __webpack_require__(53);

	var reHtmlBlockOpen = [/./, // dummy for 0
	/^<(?:script|pre|style)(?:\s|>|$)/i, /^<!--/, /^<[?]/, /^<![A-Z]/, /^<!\[CDATA\[/, /^<[/]?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|title|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|[/]?[>]|$)/i, new RegExp('^(?:' + OPENTAG + '|' + CLOSETAG + ')\s*$', 'i')];

	var reHtmlBlockClose = [/./, // dummy for 0
	/<\/(?:script|pre|style)>/i, /-->/, /\?>/, />/, /\]\]>/];

	var reThematicBreak = /^(?:(?:\* *){3,}|(?:_ *){3,}|(?:- *){3,}) *$/;

	var reMaybeSpecial = /^[#`~*+_=<>0-9-]/;

	var reNonSpace = /[^ \t\f\v\r\n]/;

	var reBulletListMarker = /^[*+-]/;

	var reOrderedListMarker = /^(\d{1,9})([.)])/;

	var reATXHeadingMarker = /^#{1,6}(?: +|$)/;

	var reCodeFence = /^`{3,}(?!.*`)|^~{3,}(?!.*~)/;

	var reClosingCodeFence = /^(?:`{3,}|~{3,})(?= *$)/;

	var reSetextHeadingLine = /^(?:=+|-+) *$/;

	var reLineEnding = /\r\n|\n|\r/;

	// Returns true if string contains only space characters.
	var isBlank = function isBlank(s) {
	    return !reNonSpace.test(s);
	};

	var peek = function peek(ln, pos) {
	    if (pos < ln.length) {
	        return ln.charCodeAt(pos);
	    } else {
	        return -1;
	    }
	};

	// DOC PARSER

	// These are methods of a Parser object, defined below.

	// Returns true if block ends with a blank line, descending if needed
	// into lists and sublists.
	var endsWithBlankLine = function endsWithBlankLine(block) {
	    while (block) {
	        if (block._lastLineBlank) {
	            return true;
	        }
	        var t = block.type;
	        if (t === 'List' || t === 'Item') {
	            block = block._lastChild;
	        } else {
	            break;
	        }
	    }
	    return false;
	};

	// Break out of all containing lists, resetting the tip of the
	// document to the parent of the highest list, and finalizing
	// all the lists.  (This is used to implement the "two blank lines
	// break out of all lists" feature.)
	var breakOutOfLists = function breakOutOfLists(block) {
	    var b = block;
	    var last_list = null;
	    do {
	        if (b.type === 'List') {
	            last_list = b;
	        }
	        b = b._parent;
	    } while (b);

	    if (last_list) {
	        while (block !== last_list) {
	            this.finalize(block, this.lineNumber);
	            block = block._parent;
	        }
	        this.finalize(last_list, this.lineNumber);
	        this.tip = last_list._parent;
	    }
	};

	// Add a line to the block at the tip.  We assume the tip
	// can accept lines -- that check should be done before calling this.
	var addLine = function addLine() {
	    this.tip._string_content += this.currentLine.slice(this.offset) + '\n';
	};

	// Add block of type tag as a child of the tip.  If the tip can't
	// accept children, close and finalize it and try its parent,
	// and so on til we find a block that can accept children.
	var addChild = function addChild(tag, offset) {
	    while (!this.blocks[this.tip.type].canContain(tag)) {
	        this.finalize(this.tip, this.lineNumber - 1);
	    }

	    var column_number = offset + 1; // offset 0 = column 1
	    var newBlock = new Node(tag, [[this.lineNumber, column_number], [0, 0]]);
	    newBlock._string_content = '';
	    this.tip.appendChild(newBlock);
	    this.tip = newBlock;
	    return newBlock;
	};

	// Parse a list marker and return data on the marker (type,
	// start, delimiter, bullet character, padding) or null.
	var parseListMarker = function parseListMarker(parser) {
	    var rest = parser.currentLine.slice(parser.nextNonspace);
	    var match;
	    var nextc;
	    var spacesStartCol;
	    var spacesStartOffset;
	    var data = { type: null,
	        tight: true, // lists are tight by default
	        bulletChar: null,
	        start: null,
	        delimiter: null,
	        padding: null,
	        markerOffset: parser.indent };
	    if (match = rest.match(reBulletListMarker)) {
	        data.type = 'Bullet';
	        data.bulletChar = match[0][0];
	    } else if (match = rest.match(reOrderedListMarker)) {
	        data.type = 'Ordered';
	        data.start = parseInt(match[1]);
	        data.delimiter = match[2];
	    } else {
	        return null;
	    }
	    // make sure we have spaces after
	    nextc = peek(parser.currentLine, parser.nextNonspace + match[0].length);
	    if (!(nextc === -1 || nextc === C_TAB || nextc === C_SPACE)) {
	        return null;
	    }

	    // we've got a match! advance offset and calculate padding
	    parser.advanceNextNonspace(); // to start of marker
	    parser.advanceOffset(match[0].length, true); // to end of marker
	    spacesStartCol = parser.column;
	    spacesStartOffset = parser.offset;
	    do {
	        parser.advanceOffset(1, true);
	        nextc = peek(parser.currentLine, parser.offset);
	    } while (parser.column - spacesStartCol < 5 && (nextc === C_SPACE || nextc === C_TAB));
	    var blank_item = peek(parser.currentLine, parser.offset) === -1;
	    var spaces_after_marker = parser.column - spacesStartCol;
	    if (spaces_after_marker >= 5 || spaces_after_marker < 1 || blank_item) {
	        data.padding = match[0].length + 1;
	        parser.column = spacesStartCol;
	        parser.offset = spacesStartOffset;
	        if (peek(parser.currentLine, parser.offset) === C_SPACE) {
	            parser.advanceOffset(1, true);
	        }
	    } else {
	        data.padding = match[0].length + spaces_after_marker;
	    }
	    return data;
	};

	// Returns true if the two list items are of the same type,
	// with the same delimiter and bullet character.  This is used
	// in agglomerating list items into lists.
	var listsMatch = function listsMatch(list_data, item_data) {
	    return list_data.type === item_data.type && list_data.delimiter === item_data.delimiter && list_data.bulletChar === item_data.bulletChar;
	};

	// Finalize and close any unmatched blocks.
	var closeUnmatchedBlocks = function closeUnmatchedBlocks() {
	    if (!this.allClosed) {
	        // finalize any blocks not matched
	        while (this.oldtip !== this.lastMatchedContainer) {
	            var parent = this.oldtip._parent;
	            this.finalize(this.oldtip, this.lineNumber - 1);
	            this.oldtip = parent;
	        }
	        this.allClosed = true;
	    }
	};

	// 'finalize' is run when the block is closed.
	// 'continue' is run to check whether the block is continuing
	// at a certain line and offset (e.g. whether a block quote
	// contains a `>`.  It returns 0 for matched, 1 for not matched,
	// and 2 for "we've dealt with this line completely, go to next."
	var blocks = {
	    Document: {
	        continue: function _continue() {
	            return 0;
	        },
	        finalize: function finalize() {
	            return;
	        },
	        canContain: function canContain(t) {
	            return t !== 'Item';
	        },
	        acceptsLines: false
	    },
	    List: {
	        continue: function _continue() {
	            return 0;
	        },
	        finalize: function finalize(parser, block) {
	            var item = block._firstChild;
	            while (item) {
	                // check for non-final list item ending with blank line:
	                if (endsWithBlankLine(item) && item._next) {
	                    block._listData.tight = false;
	                    break;
	                }
	                // recurse into children of list item, to see if there are
	                // spaces between any of them:
	                var subitem = item._firstChild;
	                while (subitem) {
	                    if (endsWithBlankLine(subitem) && (item._next || subitem._next)) {
	                        block._listData.tight = false;
	                        break;
	                    }
	                    subitem = subitem._next;
	                }
	                item = item._next;
	            }
	        },
	        canContain: function canContain(t) {
	            return t === 'Item';
	        },
	        acceptsLines: false
	    },
	    BlockQuote: {
	        continue: function _continue(parser) {
	            var ln = parser.currentLine;
	            if (!parser.indented && peek(ln, parser.nextNonspace) === C_GREATERTHAN) {
	                parser.advanceNextNonspace();
	                parser.advanceOffset(1, false);
	                if (peek(ln, parser.offset) === C_SPACE) {
	                    parser.offset++;
	                }
	            } else {
	                return 1;
	            }
	            return 0;
	        },
	        finalize: function finalize() {
	            return;
	        },
	        canContain: function canContain(t) {
	            return t !== 'Item';
	        },
	        acceptsLines: false
	    },
	    Item: {
	        continue: function _continue(parser, container) {
	            if (parser.blank && container._firstChild !== null) {
	                parser.advanceNextNonspace();
	            } else if (parser.indent >= container._listData.markerOffset + container._listData.padding) {
	                parser.advanceOffset(container._listData.markerOffset + container._listData.padding, true);
	            } else {
	                return 1;
	            }
	            return 0;
	        },
	        finalize: function finalize() {
	            return;
	        },
	        canContain: function canContain(t) {
	            return t !== 'Item';
	        },
	        acceptsLines: false
	    },
	    Heading: {
	        continue: function _continue() {
	            // a heading can never container > 1 line, so fail to match:
	            return 1;
	        },
	        finalize: function finalize() {
	            return;
	        },
	        canContain: function canContain() {
	            return false;
	        },
	        acceptsLines: false
	    },
	    ThematicBreak: {
	        continue: function _continue() {
	            // a thematic break can never container > 1 line, so fail to match:
	            return 1;
	        },
	        finalize: function finalize() {
	            return;
	        },
	        canContain: function canContain() {
	            return false;
	        },
	        acceptsLines: false
	    },
	    CodeBlock: {
	        continue: function _continue(parser, container) {
	            var ln = parser.currentLine;
	            var indent = parser.indent;
	            if (container._isFenced) {
	                // fenced
	                var match = indent <= 3 && ln.charAt(parser.nextNonspace) === container._fenceChar && ln.slice(parser.nextNonspace).match(reClosingCodeFence);
	                if (match && match[0].length >= container._fenceLength) {
	                    // closing fence - we're at end of line, so we can return
	                    parser.finalize(container, parser.lineNumber);
	                    return 2;
	                } else {
	                    // skip optional spaces of fence offset
	                    var i = container._fenceOffset;
	                    while (i > 0 && peek(ln, parser.offset) === C_SPACE) {
	                        parser.advanceOffset(1, false);
	                        i--;
	                    }
	                }
	            } else {
	                // indented
	                if (indent >= CODE_INDENT) {
	                    parser.advanceOffset(CODE_INDENT, true);
	                } else if (parser.blank) {
	                    parser.advanceNextNonspace();
	                } else {
	                    return 1;
	                }
	            }
	            return 0;
	        },
	        finalize: function finalize(parser, block) {
	            if (block._isFenced) {
	                // fenced
	                // first line becomes info string
	                var content = block._string_content;
	                var newlinePos = content.indexOf('\n');
	                var firstLine = content.slice(0, newlinePos);
	                var rest = content.slice(newlinePos + 1);
	                block.info = unescapeString(firstLine.trim());
	                block._literal = rest;
	            } else {
	                // indented
	                block._literal = block._string_content.replace(/(\n *)+$/, '\n');
	            }
	            block._string_content = null; // allow GC
	        },
	        canContain: function canContain() {
	            return false;
	        },
	        acceptsLines: true
	    },
	    HtmlBlock: {
	        continue: function _continue(parser, container) {
	            return parser.blank && (container._htmlBlockType === 6 || container._htmlBlockType === 7) ? 1 : 0;
	        },
	        finalize: function finalize(parser, block) {
	            block._literal = block._string_content.replace(/(\n *)+$/, '');
	            block._string_content = null; // allow GC
	        },
	        canContain: function canContain() {
	            return false;
	        },
	        acceptsLines: true
	    },
	    Paragraph: {
	        continue: function _continue(parser) {
	            return parser.blank ? 1 : 0;
	        },
	        finalize: function finalize(parser, block) {
	            var pos;
	            var hasReferenceDefs = false;

	            // try parsing the beginning as link reference definitions:
	            while (peek(block._string_content, 0) === C_OPEN_BRACKET && (pos = parser.inlineParser.parseReference(block._string_content, parser.refmap))) {
	                block._string_content = block._string_content.slice(pos);
	                hasReferenceDefs = true;
	            }
	            if (hasReferenceDefs && isBlank(block._string_content)) {
	                block.unlink();
	            }
	        },
	        canContain: function canContain() {
	            return false;
	        },
	        acceptsLines: true
	    }
	};

	// block start functions.  Return values:
	// 0 = no match
	// 1 = matched container, keep going
	// 2 = matched leaf, no more block starts
	var blockStarts = [
	// block quote
	function (parser) {
	    if (!parser.indented && peek(parser.currentLine, parser.nextNonspace) === C_GREATERTHAN) {
	        parser.advanceNextNonspace();
	        parser.advanceOffset(1, false);
	        // optional following space
	        if (peek(parser.currentLine, parser.offset) === C_SPACE) {
	            parser.advanceOffset(1, false);
	        }
	        parser.closeUnmatchedBlocks();
	        parser.addChild('BlockQuote', parser.nextNonspace);
	        return 1;
	    } else {
	        return 0;
	    }
	},

	// ATX heading
	function (parser) {
	    var match;
	    if (!parser.indented && (match = parser.currentLine.slice(parser.nextNonspace).match(reATXHeadingMarker))) {
	        parser.advanceNextNonspace();
	        parser.advanceOffset(match[0].length, false);
	        parser.closeUnmatchedBlocks();
	        var container = parser.addChild('Heading', parser.nextNonspace);
	        container.level = match[0].trim().length; // number of #s
	        // remove trailing ###s:
	        container._string_content = parser.currentLine.slice(parser.offset).replace(/^ *#+ *$/, '').replace(/ +#+ *$/, '');
	        parser.advanceOffset(parser.currentLine.length - parser.offset);
	        return 2;
	    } else {
	        return 0;
	    }
	},

	// Fenced code block
	function (parser) {
	    var match;
	    if (!parser.indented && (match = parser.currentLine.slice(parser.nextNonspace).match(reCodeFence))) {
	        var fenceLength = match[0].length;
	        parser.closeUnmatchedBlocks();
	        var container = parser.addChild('CodeBlock', parser.nextNonspace);
	        container._isFenced = true;
	        container._fenceLength = fenceLength;
	        container._fenceChar = match[0][0];
	        container._fenceOffset = parser.indent;
	        parser.advanceNextNonspace();
	        parser.advanceOffset(fenceLength, false);
	        return 2;
	    } else {
	        return 0;
	    }
	},

	// HTML block
	function (parser, container) {
	    if (!parser.indented && peek(parser.currentLine, parser.nextNonspace) === C_LESSTHAN) {
	        var s = parser.currentLine.slice(parser.nextNonspace);
	        var blockType;

	        for (blockType = 1; blockType <= 7; blockType++) {
	            if (reHtmlBlockOpen[blockType].test(s) && (blockType < 7 || container.type !== 'Paragraph')) {
	                parser.closeUnmatchedBlocks();
	                // We don't adjust parser.offset;
	                // spaces are part of the HTML block:
	                var b = parser.addChild('HtmlBlock', parser.offset);
	                b._htmlBlockType = blockType;
	                return 2;
	            }
	        }
	    }

	    return 0;
	},

	// Setext heading
	function (parser, container) {
	    var match;
	    if (!parser.indented && container.type === 'Paragraph' && (match = parser.currentLine.slice(parser.nextNonspace).match(reSetextHeadingLine))) {
	        parser.closeUnmatchedBlocks();
	        var heading = new Node('Heading', container.sourcepos);
	        heading.level = match[0][0] === '=' ? 1 : 2;
	        heading._string_content = container._string_content;
	        container.insertAfter(heading);
	        container.unlink();
	        parser.tip = heading;
	        parser.advanceOffset(parser.currentLine.length - parser.offset, false);
	        return 2;
	    } else {
	        return 0;
	    }
	},

	// thematic break
	function (parser) {
	    if (!parser.indented && reThematicBreak.test(parser.currentLine.slice(parser.nextNonspace))) {
	        parser.closeUnmatchedBlocks();
	        parser.addChild('ThematicBreak', parser.nextNonspace);
	        parser.advanceOffset(parser.currentLine.length - parser.offset, false);
	        return 2;
	    } else {
	        return 0;
	    }
	},

	// list item
	function (parser, container) {
	    var data;

	    if ((!parser.indented || container.type === 'List') && (data = parseListMarker(parser))) {
	        parser.closeUnmatchedBlocks();

	        // add the list if needed
	        if (parser.tip.type !== 'List' || !listsMatch(container._listData, data)) {
	            container = parser.addChild('List', parser.nextNonspace);
	            container._listData = data;
	        }

	        // add the list item
	        container = parser.addChild('Item', parser.nextNonspace);
	        container._listData = data;
	        return 1;
	    } else {
	        return 0;
	    }
	},

	// indented code block
	function (parser) {
	    if (parser.indented && parser.tip.type !== 'Paragraph' && !parser.blank) {
	        // indented code
	        parser.advanceOffset(CODE_INDENT, true);
	        parser.closeUnmatchedBlocks();
	        parser.addChild('CodeBlock', parser.offset);
	        return 2;
	    } else {
	        return 0;
	    }
	}];

	var advanceOffset = function advanceOffset(count, columns) {
	    var cols = 0;
	    var currentLine = this.currentLine;
	    var charsToTab;
	    var c;
	    while (count > 0 && (c = currentLine[this.offset])) {
	        if (c === '\t') {
	            charsToTab = 4 - this.column % 4;
	            this.column += charsToTab;
	            this.offset += 1;
	            count -= columns ? charsToTab : 1;
	        } else {
	            cols += 1;
	            this.offset += 1;
	            this.column += 1; // assume ascii; block starts are ascii
	            count -= 1;
	        }
	    }
	};

	var advanceNextNonspace = function advanceNextNonspace() {
	    this.offset = this.nextNonspace;
	    this.column = this.nextNonspaceColumn;
	};

	var findNextNonspace = function findNextNonspace() {
	    var currentLine = this.currentLine;
	    var i = this.offset;
	    var cols = this.column;
	    var c;

	    while ((c = currentLine.charAt(i)) !== '') {
	        if (c === ' ') {
	            i++;
	            cols++;
	        } else if (c === '\t') {
	            i++;
	            cols += 4 - cols % 4;
	        } else {
	            break;
	        }
	    }
	    this.blank = c === '\n' || c === '\r' || c === '';
	    this.nextNonspace = i;
	    this.nextNonspaceColumn = cols;
	    this.indent = this.nextNonspaceColumn - this.column;
	    this.indented = this.indent >= CODE_INDENT;
	};

	// Analyze a line of text and update the document appropriately.
	// We parse markdown text by calling this on each line of input,
	// then finalizing the document.
	var incorporateLine = function incorporateLine(ln) {
	    var all_matched = true;
	    var t;

	    var container = this.doc;
	    this.oldtip = this.tip;
	    this.offset = 0;
	    this.column = 0;
	    this.lineNumber += 1;

	    // replace NUL characters for security
	    if (ln.indexOf('\u0000') !== -1) {
	        ln = ln.replace(/\0/g, '�');
	    }

	    this.currentLine = ln;

	    // For each containing block, try to parse the associated line start.
	    // Bail out on failure: container will point to the last matching block.
	    // Set all_matched to false if not all containers match.
	    var lastChild;
	    while ((lastChild = container._lastChild) && lastChild._open) {
	        container = lastChild;

	        this.findNextNonspace();

	        switch (this.blocks[container.type].continue(this, container)) {
	            case 0:
	                // we've matched, keep going
	                break;
	            case 1:
	                // we've failed to match a block
	                all_matched = false;
	                break;
	            case 2:
	                // we've hit end of line for fenced code close and can return
	                this.lastLineLength = ln.length;
	                return;
	            default:
	                throw 'continue returned illegal value, must be 0, 1, or 2';
	        }
	        if (!all_matched) {
	            container = container._parent; // back up to last matching block
	            break;
	        }
	    }

	    this.allClosed = container === this.oldtip;
	    this.lastMatchedContainer = container;

	    // Check to see if we've hit 2nd blank line; if so break out of list:
	    if (this.blank && container._lastLineBlank) {
	        this.breakOutOfLists(container);
	        container = this.tip;
	    }

	    var matchedLeaf = container.type !== 'Paragraph' && blocks[container.type].acceptsLines;
	    var starts = this.blockStarts;
	    var startsLen = starts.length;
	    // Unless last matched container is a code block, try new container starts,
	    // adding children to the last matched container:
	    while (!matchedLeaf) {

	        this.findNextNonspace();

	        // this is a little performance optimization:
	        if (!this.indented && !reMaybeSpecial.test(ln.slice(this.nextNonspace))) {
	            this.advanceNextNonspace();
	            break;
	        }

	        var i = 0;
	        while (i < startsLen) {
	            var res = starts[i](this, container);
	            if (res === 1) {
	                container = this.tip;
	                break;
	            } else if (res === 2) {
	                container = this.tip;
	                matchedLeaf = true;
	                break;
	            } else {
	                i++;
	            }
	        }

	        if (i === startsLen) {
	            // nothing matched
	            this.advanceNextNonspace();
	            break;
	        }
	    }

	    // What remains at the offset is a text line.  Add the text to the
	    // appropriate container.

	    // First check for a lazy paragraph continuation:
	    if (!this.allClosed && !this.blank && this.tip.type === 'Paragraph') {
	        // lazy paragraph continuation
	        this.addLine();
	    } else {
	        // not a lazy continuation

	        // finalize any blocks not matched
	        this.closeUnmatchedBlocks();
	        if (this.blank && container.lastChild) {
	            container.lastChild._lastLineBlank = true;
	        }

	        t = container.type;

	        // Block quote lines are never blank as they start with >
	        // and we don't count blanks in fenced code for purposes of tight/loose
	        // lists or breaking out of lists.  We also don't set _lastLineBlank
	        // on an empty list item, or if we just closed a fenced block.
	        var lastLineBlank = this.blank && !(t === 'BlockQuote' || t === 'CodeBlock' && container._isFenced || t === 'Item' && !container._firstChild && container.sourcepos[0][0] === this.lineNumber);

	        // propagate lastLineBlank up through parents:
	        var cont = container;
	        while (cont) {
	            cont._lastLineBlank = lastLineBlank;
	            cont = cont._parent;
	        }

	        if (this.blocks[t].acceptsLines) {
	            this.addLine();
	            // if HtmlBlock, check for end condition
	            if (t === 'HtmlBlock' && container._htmlBlockType >= 1 && container._htmlBlockType <= 5 && reHtmlBlockClose[container._htmlBlockType].test(this.currentLine.slice(this.offset))) {
	                this.finalize(container, this.lineNumber);
	            }
	        } else if (this.offset < ln.length && !this.blank) {
	            // create paragraph container for line
	            container = this.addChild('Paragraph', this.offset);
	            this.advanceNextNonspace();
	            this.addLine();
	        }
	    }
	    this.lastLineLength = ln.length;
	};

	// Finalize a block.  Close it and do any necessary postprocessing,
	// e.g. creating string_content from strings, setting the 'tight'
	// or 'loose' status of a list, and parsing the beginnings
	// of paragraphs for reference definitions.  Reset the tip to the
	// parent of the closed block.
	var finalize = function finalize(block, lineNumber) {
	    var above = block._parent;
	    block._open = false;
	    block.sourcepos[1] = [lineNumber, this.lastLineLength];

	    this.blocks[block.type].finalize(this, block);

	    this.tip = above;
	};

	// Walk through a block & children recursively, parsing string content
	// into inline content where appropriate.
	var processInlines = function processInlines(block) {
	    var node, event, t;
	    var walker = block.walker();
	    this.inlineParser.refmap = this.refmap;
	    this.inlineParser.options = this.options;
	    while (event = walker.next()) {
	        node = event.node;
	        t = node.type;
	        if (!event.entering && (t === 'Paragraph' || t === 'Heading')) {
	            this.inlineParser.parse(node);
	        }
	    }
	};

	var Document = function Document() {
	    var doc = new Node('Document', [[1, 1], [0, 0]]);
	    return doc;
	};

	// The main parsing function.  Returns a parsed document AST.
	var parse = function parse(input) {
	    this.doc = new Document();
	    this.tip = this.doc;
	    this.refmap = {};
	    this.lineNumber = 0;
	    this.lastLineLength = 0;
	    this.offset = 0;
	    this.column = 0;
	    this.lastMatchedContainer = this.doc;
	    this.currentLine = "";
	    if (this.options.time) {
	        console.time("preparing input");
	    }
	    var lines = input.split(reLineEnding);
	    var len = lines.length;
	    if (input.charCodeAt(input.length - 1) === C_NEWLINE) {
	        // ignore last blank line created by final newline
	        len -= 1;
	    }
	    if (this.options.time) {
	        console.timeEnd("preparing input");
	    }
	    if (this.options.time) {
	        console.time("block parsing");
	    }
	    for (var i = 0; i < len; i++) {
	        this.incorporateLine(lines[i]);
	    }
	    while (this.tip) {
	        this.finalize(this.tip, len);
	    }
	    if (this.options.time) {
	        console.timeEnd("block parsing");
	    }
	    if (this.options.time) {
	        console.time("inline parsing");
	    }
	    this.processInlines(this.doc);
	    if (this.options.time) {
	        console.timeEnd("inline parsing");
	    }
	    return this.doc;
	};

	// The Parser object.
	function Parser(options) {
	    return {
	        doc: new Document(),
	        blocks: blocks,
	        blockStarts: blockStarts,
	        tip: this.doc,
	        oldtip: this.doc,
	        currentLine: "",
	        lineNumber: 0,
	        offset: 0,
	        column: 0,
	        nextNonspace: 0,
	        nextNonspaceColumn: 0,
	        indent: 0,
	        indented: false,
	        blank: false,
	        allClosed: true,
	        lastMatchedContainer: this.doc,
	        refmap: {},
	        lastLineLength: 0,
	        inlineParser: new InlineParser(options),
	        findNextNonspace: findNextNonspace,
	        advanceOffset: advanceOffset,
	        advanceNextNonspace: advanceNextNonspace,
	        breakOutOfLists: breakOutOfLists,
	        addLine: addLine,
	        addChild: addChild,
	        incorporateLine: incorporateLine,
	        finalize: finalize,
	        processInlines: processInlines,
	        closeUnmatchedBlocks: closeUnmatchedBlocks,
	        parse: parse,
	        options: options || {}
	    };
	}

	module.exports = Parser;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var encode = __webpack_require__(43);
	var decode = __webpack_require__(44);

	var C_BACKSLASH = 92;

	var decodeHTML = __webpack_require__(45).decodeHTML;

	var ENTITY = "&(?:#x[a-f0-9]{1,8}|#[0-9]{1,8}|[a-z][a-z0-9]{1,31});";

	var TAGNAME = '[A-Za-z][A-Za-z0-9-]*';
	var ATTRIBUTENAME = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
	var UNQUOTEDVALUE = "[^\"'=<>`\\x00-\\x20]+";
	var SINGLEQUOTEDVALUE = "'[^']*'";
	var DOUBLEQUOTEDVALUE = '"[^"]*"';
	var ATTRIBUTEVALUE = "(?:" + UNQUOTEDVALUE + "|" + SINGLEQUOTEDVALUE + "|" + DOUBLEQUOTEDVALUE + ")";
	var ATTRIBUTEVALUESPEC = "(?:" + "\\s*=" + "\\s*" + ATTRIBUTEVALUE + ")";
	var ATTRIBUTE = "(?:" + "\\s+" + ATTRIBUTENAME + ATTRIBUTEVALUESPEC + "?)";
	var OPENTAG = "<" + TAGNAME + ATTRIBUTE + "*" + "\\s*/?>";
	var CLOSETAG = "</" + TAGNAME + "\\s*[>]";
	var HTMLCOMMENT = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->";
	var PROCESSINGINSTRUCTION = "[<][?].*?[?][>]";
	var DECLARATION = "<![A-Z]+" + "\\s+[^>]*>";
	var CDATA = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
	var HTMLTAG = "(?:" + OPENTAG + "|" + CLOSETAG + "|" + HTMLCOMMENT + "|" + PROCESSINGINSTRUCTION + "|" + DECLARATION + "|" + CDATA + ")";
	var reHtmlTag = new RegExp('^' + HTMLTAG, 'i');

	var reBackslashOrAmp = /[\\&]/;

	var ESCAPABLE = '[!"#$%&\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]';

	var reEntityOrEscapedChar = new RegExp('\\\\' + ESCAPABLE + '|' + ENTITY, 'gi');

	var XMLSPECIAL = '[&<>"]';

	var reXmlSpecial = new RegExp(XMLSPECIAL, 'g');

	var reXmlSpecialOrEntity = new RegExp(ENTITY + '|' + XMLSPECIAL, 'gi');

	var unescapeChar = function unescapeChar(s) {
	    if (s.charCodeAt(0) === C_BACKSLASH) {
	        return s.charAt(1);
	    } else {
	        return decodeHTML(s);
	    }
	};

	// Replace entities and backslash escapes with literal characters.
	var unescapeString = function unescapeString(s) {
	    if (reBackslashOrAmp.test(s)) {
	        return s.replace(reEntityOrEscapedChar, unescapeChar);
	    } else {
	        return s;
	    }
	};

	var normalizeURI = function normalizeURI(uri) {
	    try {
	        return encode(decode(uri));
	    } catch (err) {
	        return uri;
	    }
	};

	var replaceUnsafeChar = function replaceUnsafeChar(s) {
	    switch (s) {
	        case '&':
	            return '&amp;';
	        case '<':
	            return '&lt;';
	        case '>':
	            return '&gt;';
	        case '"':
	            return '&quot;';
	        default:
	            return s;
	    }
	};

	var escapeXml = function escapeXml(s, preserve_entities) {
	    if (reXmlSpecial.test(s)) {
	        if (preserve_entities) {
	            return s.replace(reXmlSpecialOrEntity, replaceUnsafeChar);
	        } else {
	            return s.replace(reXmlSpecial, replaceUnsafeChar);
	        }
	    } else {
	        return s;
	    }
	};

	module.exports = { unescapeString: unescapeString,
	    normalizeURI: normalizeURI,
	    escapeXml: escapeXml,
	    reHtmlTag: reHtmlTag,
	    OPENTAG: OPENTAG,
	    CLOSETAG: CLOSETAG,
	    ENTITY: ENTITY,
	    ESCAPABLE: ESCAPABLE
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	
	'use strict';

	var encodeCache = {};

	// Create a lookup array where anything but characters in `chars` string
	// and alphanumeric chars is percent-encoded.
	//
	function getEncodeCache(exclude) {
	  var i,
	      ch,
	      cache = encodeCache[exclude];
	  if (cache) {
	    return cache;
	  }

	  cache = encodeCache[exclude] = [];

	  for (i = 0; i < 128; i++) {
	    ch = String.fromCharCode(i);

	    if (/^[0-9a-z]$/i.test(ch)) {
	      // always allow unencoded alphanumeric characters
	      cache.push(ch);
	    } else {
	      cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
	    }
	  }

	  for (i = 0; i < exclude.length; i++) {
	    cache[exclude.charCodeAt(i)] = exclude[i];
	  }

	  return cache;
	}

	// Encode unsafe characters with percent-encoding, skipping already
	// encoded sequences.
	//
	//  - string       - string to encode
	//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
	//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
	//
	function encode(string, exclude, keepEscaped) {
	  var i,
	      l,
	      code,
	      nextCode,
	      cache,
	      result = '';

	  if (typeof exclude !== 'string') {
	    // encode(string, keepEscaped)
	    keepEscaped = exclude;
	    exclude = encode.defaultChars;
	  }

	  if (typeof keepEscaped === 'undefined') {
	    keepEscaped = true;
	  }

	  cache = getEncodeCache(exclude);

	  for (i = 0, l = string.length; i < l; i++) {
	    code = string.charCodeAt(i);

	    if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
	      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
	        result += string.slice(i, i + 3);
	        i += 2;
	        continue;
	      }
	    }

	    if (code < 128) {
	      result += cache[code];
	      continue;
	    }

	    if (code >= 0xD800 && code <= 0xDFFF) {
	      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
	        nextCode = string.charCodeAt(i + 1);
	        if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
	          result += encodeURIComponent(string[i] + string[i + 1]);
	          i++;
	          continue;
	        }
	      }
	      result += '%EF%BF%BD';
	      continue;
	    }

	    result += encodeURIComponent(string[i]);
	  }

	  return result;
	}

	encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
	encode.componentChars = "-_.!~*'()";

	module.exports = encode;

/***/ },
/* 44 */
/***/ function(module, exports) {

	
	'use strict';

	/* eslint-disable no-bitwise */

	var decodeCache = {};

	function getDecodeCache(exclude) {
	  var i,
	      ch,
	      cache = decodeCache[exclude];
	  if (cache) {
	    return cache;
	  }

	  cache = decodeCache[exclude] = [];

	  for (i = 0; i < 128; i++) {
	    ch = String.fromCharCode(i);
	    cache.push(ch);
	  }

	  for (i = 0; i < exclude.length; i++) {
	    ch = exclude.charCodeAt(i);
	    cache[ch] = '%' + ('0' + ch.toString(16).toUpperCase()).slice(-2);
	  }

	  return cache;
	}

	// Decode percent-encoded string.
	//
	function decode(string, exclude) {
	  var cache;

	  if (typeof exclude !== 'string') {
	    exclude = decode.defaultChars;
	  }

	  cache = getDecodeCache(exclude);

	  return string.replace(/(%[a-f0-9]{2})+/gi, function (seq) {
	    var i,
	        l,
	        b1,
	        b2,
	        b3,
	        b4,
	        chr,
	        result = '';

	    for (i = 0, l = seq.length; i < l; i += 3) {
	      b1 = parseInt(seq.slice(i + 1, i + 3), 16);

	      if (b1 < 0x80) {
	        result += cache[b1];
	        continue;
	      }

	      if ((b1 & 0xE0) === 0xC0 && i + 3 < l) {
	        // 110xxxxx 10xxxxxx
	        b2 = parseInt(seq.slice(i + 4, i + 6), 16);

	        if ((b2 & 0xC0) === 0x80) {
	          chr = b1 << 6 & 0x7C0 | b2 & 0x3F;

	          if (chr < 0x80) {
	            result += '��';
	          } else {
	            result += String.fromCharCode(chr);
	          }

	          i += 3;
	          continue;
	        }
	      }

	      if ((b1 & 0xF0) === 0xE0 && i + 6 < l) {
	        // 1110xxxx 10xxxxxx 10xxxxxx
	        b2 = parseInt(seq.slice(i + 4, i + 6), 16);
	        b3 = parseInt(seq.slice(i + 7, i + 9), 16);

	        if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
	          chr = b1 << 12 & 0xF000 | b2 << 6 & 0xFC0 | b3 & 0x3F;

	          if (chr < 0x800 || chr >= 0xD800 && chr <= 0xDFFF) {
	            result += '���';
	          } else {
	            result += String.fromCharCode(chr);
	          }

	          i += 6;
	          continue;
	        }
	      }

	      if ((b1 & 0xF8) === 0xF0 && i + 9 < l) {
	        // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx
	        b2 = parseInt(seq.slice(i + 4, i + 6), 16);
	        b3 = parseInt(seq.slice(i + 7, i + 9), 16);
	        b4 = parseInt(seq.slice(i + 10, i + 12), 16);

	        if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80 && (b4 & 0xC0) === 0x80) {
	          chr = b1 << 18 & 0x1C0000 | b2 << 12 & 0x3F000 | b3 << 6 & 0xFC0 | b4 & 0x3F;

	          if (chr < 0x10000 || chr > 0x10FFFF) {
	            result += '����';
	          } else {
	            chr -= 0x10000;
	            result += String.fromCharCode(0xD800 + (chr >> 10), 0xDC00 + (chr & 0x3FF));
	          }

	          i += 9;
	          continue;
	        }
	      }

	      result += '�';
	    }

	    return result;
	  });
	}

	decode.defaultChars = ';/?:@&=+$,#';
	decode.componentChars = '';

	module.exports = decode;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var encode = __webpack_require__(46),
	    decode = __webpack_require__(49);

	exports.decode = function (data, level) {
		return (!level || level <= 0 ? decode.XML : decode.HTML)(data);
	};

	exports.decodeStrict = function (data, level) {
		return (!level || level <= 0 ? decode.XML : decode.HTMLStrict)(data);
	};

	exports.encode = function (data, level) {
		return (!level || level <= 0 ? encode.XML : encode.HTML)(data);
	};

	exports.encodeXML = encode.XML;

	exports.encodeHTML4 = exports.encodeHTML5 = exports.encodeHTML = encode.HTML;

	exports.decodeXML = exports.decodeXMLStrict = decode.XML;

	exports.decodeHTML4 = exports.decodeHTML5 = exports.decodeHTML = decode.HTML;

	exports.decodeHTML4Strict = exports.decodeHTML5Strict = exports.decodeHTMLStrict = decode.HTMLStrict;

	exports.escape = encode.escape;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var inverseXML = getInverseObj(__webpack_require__(47)),
	    xmlReplacer = getInverseReplacer(inverseXML);

	exports.XML = getInverse(inverseXML, xmlReplacer);

	var inverseHTML = getInverseObj(__webpack_require__(48)),
	    htmlReplacer = getInverseReplacer(inverseHTML);

	exports.HTML = getInverse(inverseHTML, htmlReplacer);

	function getInverseObj(obj) {
		return Object.keys(obj).sort().reduce(function (inverse, name) {
			inverse[obj[name]] = "&" + name + ";";
			return inverse;
		}, {});
	}

	function getInverseReplacer(inverse) {
		var single = [],
		    multiple = [];

		Object.keys(inverse).forEach(function (k) {
			if (k.length === 1) {
				single.push("\\" + k);
			} else {
				multiple.push(k);
			}
		});

		//TODO add ranges
		multiple.unshift("[" + single.join("") + "]");

		return new RegExp(multiple.join("|"), "g");
	}

	var re_nonASCII = /[^\0-\x7F]/g,
	    re_astralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

	function singleCharReplacer(c) {
		return "&#x" + c.charCodeAt(0).toString(16).toUpperCase() + ";";
	}

	function astralReplacer(c) {
		// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
		var high = c.charCodeAt(0);
		var low = c.charCodeAt(1);
		var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
		return "&#x" + codePoint.toString(16).toUpperCase() + ";";
	}

	function getInverse(inverse, re) {
		function func(name) {
			return inverse[name];
		}

		return function (data) {
			return data.replace(re, func).replace(re_astralSymbols, astralReplacer).replace(re_nonASCII, singleCharReplacer);
		};
	}

	var re_xmlChars = getInverseReplacer(inverseXML);

	function escapeXML(data) {
		return data.replace(re_xmlChars, singleCharReplacer).replace(re_astralSymbols, astralReplacer).replace(re_nonASCII, singleCharReplacer);
	}

	exports.escape = escapeXML;

/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = {
		"amp": "&",
		"apos": "'",
		"gt": ">",
		"lt": "<",
		"quot": "\""
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = {
		"Aacute": "Á",
		"aacute": "á",
		"Abreve": "Ă",
		"abreve": "ă",
		"ac": "∾",
		"acd": "∿",
		"acE": "∾̳",
		"Acirc": "Â",
		"acirc": "â",
		"acute": "´",
		"Acy": "А",
		"acy": "а",
		"AElig": "Æ",
		"aelig": "æ",
		"af": "⁡",
		"Afr": "𝔄",
		"afr": "𝔞",
		"Agrave": "À",
		"agrave": "à",
		"alefsym": "ℵ",
		"aleph": "ℵ",
		"Alpha": "Α",
		"alpha": "α",
		"Amacr": "Ā",
		"amacr": "ā",
		"amalg": "⨿",
		"amp": "&",
		"AMP": "&",
		"andand": "⩕",
		"And": "⩓",
		"and": "∧",
		"andd": "⩜",
		"andslope": "⩘",
		"andv": "⩚",
		"ang": "∠",
		"ange": "⦤",
		"angle": "∠",
		"angmsdaa": "⦨",
		"angmsdab": "⦩",
		"angmsdac": "⦪",
		"angmsdad": "⦫",
		"angmsdae": "⦬",
		"angmsdaf": "⦭",
		"angmsdag": "⦮",
		"angmsdah": "⦯",
		"angmsd": "∡",
		"angrt": "∟",
		"angrtvb": "⊾",
		"angrtvbd": "⦝",
		"angsph": "∢",
		"angst": "Å",
		"angzarr": "⍼",
		"Aogon": "Ą",
		"aogon": "ą",
		"Aopf": "𝔸",
		"aopf": "𝕒",
		"apacir": "⩯",
		"ap": "≈",
		"apE": "⩰",
		"ape": "≊",
		"apid": "≋",
		"apos": "'",
		"ApplyFunction": "⁡",
		"approx": "≈",
		"approxeq": "≊",
		"Aring": "Å",
		"aring": "å",
		"Ascr": "𝒜",
		"ascr": "𝒶",
		"Assign": "≔",
		"ast": "*",
		"asymp": "≈",
		"asympeq": "≍",
		"Atilde": "Ã",
		"atilde": "ã",
		"Auml": "Ä",
		"auml": "ä",
		"awconint": "∳",
		"awint": "⨑",
		"backcong": "≌",
		"backepsilon": "϶",
		"backprime": "‵",
		"backsim": "∽",
		"backsimeq": "⋍",
		"Backslash": "∖",
		"Barv": "⫧",
		"barvee": "⊽",
		"barwed": "⌅",
		"Barwed": "⌆",
		"barwedge": "⌅",
		"bbrk": "⎵",
		"bbrktbrk": "⎶",
		"bcong": "≌",
		"Bcy": "Б",
		"bcy": "б",
		"bdquo": "„",
		"becaus": "∵",
		"because": "∵",
		"Because": "∵",
		"bemptyv": "⦰",
		"bepsi": "϶",
		"bernou": "ℬ",
		"Bernoullis": "ℬ",
		"Beta": "Β",
		"beta": "β",
		"beth": "ℶ",
		"between": "≬",
		"Bfr": "𝔅",
		"bfr": "𝔟",
		"bigcap": "⋂",
		"bigcirc": "◯",
		"bigcup": "⋃",
		"bigodot": "⨀",
		"bigoplus": "⨁",
		"bigotimes": "⨂",
		"bigsqcup": "⨆",
		"bigstar": "★",
		"bigtriangledown": "▽",
		"bigtriangleup": "△",
		"biguplus": "⨄",
		"bigvee": "⋁",
		"bigwedge": "⋀",
		"bkarow": "⤍",
		"blacklozenge": "⧫",
		"blacksquare": "▪",
		"blacktriangle": "▴",
		"blacktriangledown": "▾",
		"blacktriangleleft": "◂",
		"blacktriangleright": "▸",
		"blank": "␣",
		"blk12": "▒",
		"blk14": "░",
		"blk34": "▓",
		"block": "█",
		"bne": "=⃥",
		"bnequiv": "≡⃥",
		"bNot": "⫭",
		"bnot": "⌐",
		"Bopf": "𝔹",
		"bopf": "𝕓",
		"bot": "⊥",
		"bottom": "⊥",
		"bowtie": "⋈",
		"boxbox": "⧉",
		"boxdl": "┐",
		"boxdL": "╕",
		"boxDl": "╖",
		"boxDL": "╗",
		"boxdr": "┌",
		"boxdR": "╒",
		"boxDr": "╓",
		"boxDR": "╔",
		"boxh": "─",
		"boxH": "═",
		"boxhd": "┬",
		"boxHd": "╤",
		"boxhD": "╥",
		"boxHD": "╦",
		"boxhu": "┴",
		"boxHu": "╧",
		"boxhU": "╨",
		"boxHU": "╩",
		"boxminus": "⊟",
		"boxplus": "⊞",
		"boxtimes": "⊠",
		"boxul": "┘",
		"boxuL": "╛",
		"boxUl": "╜",
		"boxUL": "╝",
		"boxur": "└",
		"boxuR": "╘",
		"boxUr": "╙",
		"boxUR": "╚",
		"boxv": "│",
		"boxV": "║",
		"boxvh": "┼",
		"boxvH": "╪",
		"boxVh": "╫",
		"boxVH": "╬",
		"boxvl": "┤",
		"boxvL": "╡",
		"boxVl": "╢",
		"boxVL": "╣",
		"boxvr": "├",
		"boxvR": "╞",
		"boxVr": "╟",
		"boxVR": "╠",
		"bprime": "‵",
		"breve": "˘",
		"Breve": "˘",
		"brvbar": "¦",
		"bscr": "𝒷",
		"Bscr": "ℬ",
		"bsemi": "⁏",
		"bsim": "∽",
		"bsime": "⋍",
		"bsolb": "⧅",
		"bsol": "\\",
		"bsolhsub": "⟈",
		"bull": "•",
		"bullet": "•",
		"bump": "≎",
		"bumpE": "⪮",
		"bumpe": "≏",
		"Bumpeq": "≎",
		"bumpeq": "≏",
		"Cacute": "Ć",
		"cacute": "ć",
		"capand": "⩄",
		"capbrcup": "⩉",
		"capcap": "⩋",
		"cap": "∩",
		"Cap": "⋒",
		"capcup": "⩇",
		"capdot": "⩀",
		"CapitalDifferentialD": "ⅅ",
		"caps": "∩︀",
		"caret": "⁁",
		"caron": "ˇ",
		"Cayleys": "ℭ",
		"ccaps": "⩍",
		"Ccaron": "Č",
		"ccaron": "č",
		"Ccedil": "Ç",
		"ccedil": "ç",
		"Ccirc": "Ĉ",
		"ccirc": "ĉ",
		"Cconint": "∰",
		"ccups": "⩌",
		"ccupssm": "⩐",
		"Cdot": "Ċ",
		"cdot": "ċ",
		"cedil": "¸",
		"Cedilla": "¸",
		"cemptyv": "⦲",
		"cent": "¢",
		"centerdot": "·",
		"CenterDot": "·",
		"cfr": "𝔠",
		"Cfr": "ℭ",
		"CHcy": "Ч",
		"chcy": "ч",
		"check": "✓",
		"checkmark": "✓",
		"Chi": "Χ",
		"chi": "χ",
		"circ": "ˆ",
		"circeq": "≗",
		"circlearrowleft": "↺",
		"circlearrowright": "↻",
		"circledast": "⊛",
		"circledcirc": "⊚",
		"circleddash": "⊝",
		"CircleDot": "⊙",
		"circledR": "®",
		"circledS": "Ⓢ",
		"CircleMinus": "⊖",
		"CirclePlus": "⊕",
		"CircleTimes": "⊗",
		"cir": "○",
		"cirE": "⧃",
		"cire": "≗",
		"cirfnint": "⨐",
		"cirmid": "⫯",
		"cirscir": "⧂",
		"ClockwiseContourIntegral": "∲",
		"CloseCurlyDoubleQuote": "”",
		"CloseCurlyQuote": "’",
		"clubs": "♣",
		"clubsuit": "♣",
		"colon": ":",
		"Colon": "∷",
		"Colone": "⩴",
		"colone": "≔",
		"coloneq": "≔",
		"comma": ",",
		"commat": "@",
		"comp": "∁",
		"compfn": "∘",
		"complement": "∁",
		"complexes": "ℂ",
		"cong": "≅",
		"congdot": "⩭",
		"Congruent": "≡",
		"conint": "∮",
		"Conint": "∯",
		"ContourIntegral": "∮",
		"copf": "𝕔",
		"Copf": "ℂ",
		"coprod": "∐",
		"Coproduct": "∐",
		"copy": "©",
		"COPY": "©",
		"copysr": "℗",
		"CounterClockwiseContourIntegral": "∳",
		"crarr": "↵",
		"cross": "✗",
		"Cross": "⨯",
		"Cscr": "𝒞",
		"cscr": "𝒸",
		"csub": "⫏",
		"csube": "⫑",
		"csup": "⫐",
		"csupe": "⫒",
		"ctdot": "⋯",
		"cudarrl": "⤸",
		"cudarrr": "⤵",
		"cuepr": "⋞",
		"cuesc": "⋟",
		"cularr": "↶",
		"cularrp": "⤽",
		"cupbrcap": "⩈",
		"cupcap": "⩆",
		"CupCap": "≍",
		"cup": "∪",
		"Cup": "⋓",
		"cupcup": "⩊",
		"cupdot": "⊍",
		"cupor": "⩅",
		"cups": "∪︀",
		"curarr": "↷",
		"curarrm": "⤼",
		"curlyeqprec": "⋞",
		"curlyeqsucc": "⋟",
		"curlyvee": "⋎",
		"curlywedge": "⋏",
		"curren": "¤",
		"curvearrowleft": "↶",
		"curvearrowright": "↷",
		"cuvee": "⋎",
		"cuwed": "⋏",
		"cwconint": "∲",
		"cwint": "∱",
		"cylcty": "⌭",
		"dagger": "†",
		"Dagger": "‡",
		"daleth": "ℸ",
		"darr": "↓",
		"Darr": "↡",
		"dArr": "⇓",
		"dash": "‐",
		"Dashv": "⫤",
		"dashv": "⊣",
		"dbkarow": "⤏",
		"dblac": "˝",
		"Dcaron": "Ď",
		"dcaron": "ď",
		"Dcy": "Д",
		"dcy": "д",
		"ddagger": "‡",
		"ddarr": "⇊",
		"DD": "ⅅ",
		"dd": "ⅆ",
		"DDotrahd": "⤑",
		"ddotseq": "⩷",
		"deg": "°",
		"Del": "∇",
		"Delta": "Δ",
		"delta": "δ",
		"demptyv": "⦱",
		"dfisht": "⥿",
		"Dfr": "𝔇",
		"dfr": "𝔡",
		"dHar": "⥥",
		"dharl": "⇃",
		"dharr": "⇂",
		"DiacriticalAcute": "´",
		"DiacriticalDot": "˙",
		"DiacriticalDoubleAcute": "˝",
		"DiacriticalGrave": "`",
		"DiacriticalTilde": "˜",
		"diam": "⋄",
		"diamond": "⋄",
		"Diamond": "⋄",
		"diamondsuit": "♦",
		"diams": "♦",
		"die": "¨",
		"DifferentialD": "ⅆ",
		"digamma": "ϝ",
		"disin": "⋲",
		"div": "÷",
		"divide": "÷",
		"divideontimes": "⋇",
		"divonx": "⋇",
		"DJcy": "Ђ",
		"djcy": "ђ",
		"dlcorn": "⌞",
		"dlcrop": "⌍",
		"dollar": "$",
		"Dopf": "𝔻",
		"dopf": "𝕕",
		"Dot": "¨",
		"dot": "˙",
		"DotDot": "⃜",
		"doteq": "≐",
		"doteqdot": "≑",
		"DotEqual": "≐",
		"dotminus": "∸",
		"dotplus": "∔",
		"dotsquare": "⊡",
		"doublebarwedge": "⌆",
		"DoubleContourIntegral": "∯",
		"DoubleDot": "¨",
		"DoubleDownArrow": "⇓",
		"DoubleLeftArrow": "⇐",
		"DoubleLeftRightArrow": "⇔",
		"DoubleLeftTee": "⫤",
		"DoubleLongLeftArrow": "⟸",
		"DoubleLongLeftRightArrow": "⟺",
		"DoubleLongRightArrow": "⟹",
		"DoubleRightArrow": "⇒",
		"DoubleRightTee": "⊨",
		"DoubleUpArrow": "⇑",
		"DoubleUpDownArrow": "⇕",
		"DoubleVerticalBar": "∥",
		"DownArrowBar": "⤓",
		"downarrow": "↓",
		"DownArrow": "↓",
		"Downarrow": "⇓",
		"DownArrowUpArrow": "⇵",
		"DownBreve": "̑",
		"downdownarrows": "⇊",
		"downharpoonleft": "⇃",
		"downharpoonright": "⇂",
		"DownLeftRightVector": "⥐",
		"DownLeftTeeVector": "⥞",
		"DownLeftVectorBar": "⥖",
		"DownLeftVector": "↽",
		"DownRightTeeVector": "⥟",
		"DownRightVectorBar": "⥗",
		"DownRightVector": "⇁",
		"DownTeeArrow": "↧",
		"DownTee": "⊤",
		"drbkarow": "⤐",
		"drcorn": "⌟",
		"drcrop": "⌌",
		"Dscr": "𝒟",
		"dscr": "𝒹",
		"DScy": "Ѕ",
		"dscy": "ѕ",
		"dsol": "⧶",
		"Dstrok": "Đ",
		"dstrok": "đ",
		"dtdot": "⋱",
		"dtri": "▿",
		"dtrif": "▾",
		"duarr": "⇵",
		"duhar": "⥯",
		"dwangle": "⦦",
		"DZcy": "Џ",
		"dzcy": "џ",
		"dzigrarr": "⟿",
		"Eacute": "É",
		"eacute": "é",
		"easter": "⩮",
		"Ecaron": "Ě",
		"ecaron": "ě",
		"Ecirc": "Ê",
		"ecirc": "ê",
		"ecir": "≖",
		"ecolon": "≕",
		"Ecy": "Э",
		"ecy": "э",
		"eDDot": "⩷",
		"Edot": "Ė",
		"edot": "ė",
		"eDot": "≑",
		"ee": "ⅇ",
		"efDot": "≒",
		"Efr": "𝔈",
		"efr": "𝔢",
		"eg": "⪚",
		"Egrave": "È",
		"egrave": "è",
		"egs": "⪖",
		"egsdot": "⪘",
		"el": "⪙",
		"Element": "∈",
		"elinters": "⏧",
		"ell": "ℓ",
		"els": "⪕",
		"elsdot": "⪗",
		"Emacr": "Ē",
		"emacr": "ē",
		"empty": "∅",
		"emptyset": "∅",
		"EmptySmallSquare": "◻",
		"emptyv": "∅",
		"EmptyVerySmallSquare": "▫",
		"emsp13": " ",
		"emsp14": " ",
		"emsp": " ",
		"ENG": "Ŋ",
		"eng": "ŋ",
		"ensp": " ",
		"Eogon": "Ę",
		"eogon": "ę",
		"Eopf": "𝔼",
		"eopf": "𝕖",
		"epar": "⋕",
		"eparsl": "⧣",
		"eplus": "⩱",
		"epsi": "ε",
		"Epsilon": "Ε",
		"epsilon": "ε",
		"epsiv": "ϵ",
		"eqcirc": "≖",
		"eqcolon": "≕",
		"eqsim": "≂",
		"eqslantgtr": "⪖",
		"eqslantless": "⪕",
		"Equal": "⩵",
		"equals": "=",
		"EqualTilde": "≂",
		"equest": "≟",
		"Equilibrium": "⇌",
		"equiv": "≡",
		"equivDD": "⩸",
		"eqvparsl": "⧥",
		"erarr": "⥱",
		"erDot": "≓",
		"escr": "ℯ",
		"Escr": "ℰ",
		"esdot": "≐",
		"Esim": "⩳",
		"esim": "≂",
		"Eta": "Η",
		"eta": "η",
		"ETH": "Ð",
		"eth": "ð",
		"Euml": "Ë",
		"euml": "ë",
		"euro": "€",
		"excl": "!",
		"exist": "∃",
		"Exists": "∃",
		"expectation": "ℰ",
		"exponentiale": "ⅇ",
		"ExponentialE": "ⅇ",
		"fallingdotseq": "≒",
		"Fcy": "Ф",
		"fcy": "ф",
		"female": "♀",
		"ffilig": "ﬃ",
		"fflig": "ﬀ",
		"ffllig": "ﬄ",
		"Ffr": "𝔉",
		"ffr": "𝔣",
		"filig": "ﬁ",
		"FilledSmallSquare": "◼",
		"FilledVerySmallSquare": "▪",
		"fjlig": "fj",
		"flat": "♭",
		"fllig": "ﬂ",
		"fltns": "▱",
		"fnof": "ƒ",
		"Fopf": "𝔽",
		"fopf": "𝕗",
		"forall": "∀",
		"ForAll": "∀",
		"fork": "⋔",
		"forkv": "⫙",
		"Fouriertrf": "ℱ",
		"fpartint": "⨍",
		"frac12": "½",
		"frac13": "⅓",
		"frac14": "¼",
		"frac15": "⅕",
		"frac16": "⅙",
		"frac18": "⅛",
		"frac23": "⅔",
		"frac25": "⅖",
		"frac34": "¾",
		"frac35": "⅗",
		"frac38": "⅜",
		"frac45": "⅘",
		"frac56": "⅚",
		"frac58": "⅝",
		"frac78": "⅞",
		"frasl": "⁄",
		"frown": "⌢",
		"fscr": "𝒻",
		"Fscr": "ℱ",
		"gacute": "ǵ",
		"Gamma": "Γ",
		"gamma": "γ",
		"Gammad": "Ϝ",
		"gammad": "ϝ",
		"gap": "⪆",
		"Gbreve": "Ğ",
		"gbreve": "ğ",
		"Gcedil": "Ģ",
		"Gcirc": "Ĝ",
		"gcirc": "ĝ",
		"Gcy": "Г",
		"gcy": "г",
		"Gdot": "Ġ",
		"gdot": "ġ",
		"ge": "≥",
		"gE": "≧",
		"gEl": "⪌",
		"gel": "⋛",
		"geq": "≥",
		"geqq": "≧",
		"geqslant": "⩾",
		"gescc": "⪩",
		"ges": "⩾",
		"gesdot": "⪀",
		"gesdoto": "⪂",
		"gesdotol": "⪄",
		"gesl": "⋛︀",
		"gesles": "⪔",
		"Gfr": "𝔊",
		"gfr": "𝔤",
		"gg": "≫",
		"Gg": "⋙",
		"ggg": "⋙",
		"gimel": "ℷ",
		"GJcy": "Ѓ",
		"gjcy": "ѓ",
		"gla": "⪥",
		"gl": "≷",
		"glE": "⪒",
		"glj": "⪤",
		"gnap": "⪊",
		"gnapprox": "⪊",
		"gne": "⪈",
		"gnE": "≩",
		"gneq": "⪈",
		"gneqq": "≩",
		"gnsim": "⋧",
		"Gopf": "𝔾",
		"gopf": "𝕘",
		"grave": "`",
		"GreaterEqual": "≥",
		"GreaterEqualLess": "⋛",
		"GreaterFullEqual": "≧",
		"GreaterGreater": "⪢",
		"GreaterLess": "≷",
		"GreaterSlantEqual": "⩾",
		"GreaterTilde": "≳",
		"Gscr": "𝒢",
		"gscr": "ℊ",
		"gsim": "≳",
		"gsime": "⪎",
		"gsiml": "⪐",
		"gtcc": "⪧",
		"gtcir": "⩺",
		"gt": ">",
		"GT": ">",
		"Gt": "≫",
		"gtdot": "⋗",
		"gtlPar": "⦕",
		"gtquest": "⩼",
		"gtrapprox": "⪆",
		"gtrarr": "⥸",
		"gtrdot": "⋗",
		"gtreqless": "⋛",
		"gtreqqless": "⪌",
		"gtrless": "≷",
		"gtrsim": "≳",
		"gvertneqq": "≩︀",
		"gvnE": "≩︀",
		"Hacek": "ˇ",
		"hairsp": " ",
		"half": "½",
		"hamilt": "ℋ",
		"HARDcy": "Ъ",
		"hardcy": "ъ",
		"harrcir": "⥈",
		"harr": "↔",
		"hArr": "⇔",
		"harrw": "↭",
		"Hat": "^",
		"hbar": "ℏ",
		"Hcirc": "Ĥ",
		"hcirc": "ĥ",
		"hearts": "♥",
		"heartsuit": "♥",
		"hellip": "…",
		"hercon": "⊹",
		"hfr": "𝔥",
		"Hfr": "ℌ",
		"HilbertSpace": "ℋ",
		"hksearow": "⤥",
		"hkswarow": "⤦",
		"hoarr": "⇿",
		"homtht": "∻",
		"hookleftarrow": "↩",
		"hookrightarrow": "↪",
		"hopf": "𝕙",
		"Hopf": "ℍ",
		"horbar": "―",
		"HorizontalLine": "─",
		"hscr": "𝒽",
		"Hscr": "ℋ",
		"hslash": "ℏ",
		"Hstrok": "Ħ",
		"hstrok": "ħ",
		"HumpDownHump": "≎",
		"HumpEqual": "≏",
		"hybull": "⁃",
		"hyphen": "‐",
		"Iacute": "Í",
		"iacute": "í",
		"ic": "⁣",
		"Icirc": "Î",
		"icirc": "î",
		"Icy": "И",
		"icy": "и",
		"Idot": "İ",
		"IEcy": "Е",
		"iecy": "е",
		"iexcl": "¡",
		"iff": "⇔",
		"ifr": "𝔦",
		"Ifr": "ℑ",
		"Igrave": "Ì",
		"igrave": "ì",
		"ii": "ⅈ",
		"iiiint": "⨌",
		"iiint": "∭",
		"iinfin": "⧜",
		"iiota": "℩",
		"IJlig": "Ĳ",
		"ijlig": "ĳ",
		"Imacr": "Ī",
		"imacr": "ī",
		"image": "ℑ",
		"ImaginaryI": "ⅈ",
		"imagline": "ℐ",
		"imagpart": "ℑ",
		"imath": "ı",
		"Im": "ℑ",
		"imof": "⊷",
		"imped": "Ƶ",
		"Implies": "⇒",
		"incare": "℅",
		"in": "∈",
		"infin": "∞",
		"infintie": "⧝",
		"inodot": "ı",
		"intcal": "⊺",
		"int": "∫",
		"Int": "∬",
		"integers": "ℤ",
		"Integral": "∫",
		"intercal": "⊺",
		"Intersection": "⋂",
		"intlarhk": "⨗",
		"intprod": "⨼",
		"InvisibleComma": "⁣",
		"InvisibleTimes": "⁢",
		"IOcy": "Ё",
		"iocy": "ё",
		"Iogon": "Į",
		"iogon": "į",
		"Iopf": "𝕀",
		"iopf": "𝕚",
		"Iota": "Ι",
		"iota": "ι",
		"iprod": "⨼",
		"iquest": "¿",
		"iscr": "𝒾",
		"Iscr": "ℐ",
		"isin": "∈",
		"isindot": "⋵",
		"isinE": "⋹",
		"isins": "⋴",
		"isinsv": "⋳",
		"isinv": "∈",
		"it": "⁢",
		"Itilde": "Ĩ",
		"itilde": "ĩ",
		"Iukcy": "І",
		"iukcy": "і",
		"Iuml": "Ï",
		"iuml": "ï",
		"Jcirc": "Ĵ",
		"jcirc": "ĵ",
		"Jcy": "Й",
		"jcy": "й",
		"Jfr": "𝔍",
		"jfr": "𝔧",
		"jmath": "ȷ",
		"Jopf": "𝕁",
		"jopf": "𝕛",
		"Jscr": "𝒥",
		"jscr": "𝒿",
		"Jsercy": "Ј",
		"jsercy": "ј",
		"Jukcy": "Є",
		"jukcy": "є",
		"Kappa": "Κ",
		"kappa": "κ",
		"kappav": "ϰ",
		"Kcedil": "Ķ",
		"kcedil": "ķ",
		"Kcy": "К",
		"kcy": "к",
		"Kfr": "𝔎",
		"kfr": "𝔨",
		"kgreen": "ĸ",
		"KHcy": "Х",
		"khcy": "х",
		"KJcy": "Ќ",
		"kjcy": "ќ",
		"Kopf": "𝕂",
		"kopf": "𝕜",
		"Kscr": "𝒦",
		"kscr": "𝓀",
		"lAarr": "⇚",
		"Lacute": "Ĺ",
		"lacute": "ĺ",
		"laemptyv": "⦴",
		"lagran": "ℒ",
		"Lambda": "Λ",
		"lambda": "λ",
		"lang": "⟨",
		"Lang": "⟪",
		"langd": "⦑",
		"langle": "⟨",
		"lap": "⪅",
		"Laplacetrf": "ℒ",
		"laquo": "«",
		"larrb": "⇤",
		"larrbfs": "⤟",
		"larr": "←",
		"Larr": "↞",
		"lArr": "⇐",
		"larrfs": "⤝",
		"larrhk": "↩",
		"larrlp": "↫",
		"larrpl": "⤹",
		"larrsim": "⥳",
		"larrtl": "↢",
		"latail": "⤙",
		"lAtail": "⤛",
		"lat": "⪫",
		"late": "⪭",
		"lates": "⪭︀",
		"lbarr": "⤌",
		"lBarr": "⤎",
		"lbbrk": "❲",
		"lbrace": "{",
		"lbrack": "[",
		"lbrke": "⦋",
		"lbrksld": "⦏",
		"lbrkslu": "⦍",
		"Lcaron": "Ľ",
		"lcaron": "ľ",
		"Lcedil": "Ļ",
		"lcedil": "ļ",
		"lceil": "⌈",
		"lcub": "{",
		"Lcy": "Л",
		"lcy": "л",
		"ldca": "⤶",
		"ldquo": "“",
		"ldquor": "„",
		"ldrdhar": "⥧",
		"ldrushar": "⥋",
		"ldsh": "↲",
		"le": "≤",
		"lE": "≦",
		"LeftAngleBracket": "⟨",
		"LeftArrowBar": "⇤",
		"leftarrow": "←",
		"LeftArrow": "←",
		"Leftarrow": "⇐",
		"LeftArrowRightArrow": "⇆",
		"leftarrowtail": "↢",
		"LeftCeiling": "⌈",
		"LeftDoubleBracket": "⟦",
		"LeftDownTeeVector": "⥡",
		"LeftDownVectorBar": "⥙",
		"LeftDownVector": "⇃",
		"LeftFloor": "⌊",
		"leftharpoondown": "↽",
		"leftharpoonup": "↼",
		"leftleftarrows": "⇇",
		"leftrightarrow": "↔",
		"LeftRightArrow": "↔",
		"Leftrightarrow": "⇔",
		"leftrightarrows": "⇆",
		"leftrightharpoons": "⇋",
		"leftrightsquigarrow": "↭",
		"LeftRightVector": "⥎",
		"LeftTeeArrow": "↤",
		"LeftTee": "⊣",
		"LeftTeeVector": "⥚",
		"leftthreetimes": "⋋",
		"LeftTriangleBar": "⧏",
		"LeftTriangle": "⊲",
		"LeftTriangleEqual": "⊴",
		"LeftUpDownVector": "⥑",
		"LeftUpTeeVector": "⥠",
		"LeftUpVectorBar": "⥘",
		"LeftUpVector": "↿",
		"LeftVectorBar": "⥒",
		"LeftVector": "↼",
		"lEg": "⪋",
		"leg": "⋚",
		"leq": "≤",
		"leqq": "≦",
		"leqslant": "⩽",
		"lescc": "⪨",
		"les": "⩽",
		"lesdot": "⩿",
		"lesdoto": "⪁",
		"lesdotor": "⪃",
		"lesg": "⋚︀",
		"lesges": "⪓",
		"lessapprox": "⪅",
		"lessdot": "⋖",
		"lesseqgtr": "⋚",
		"lesseqqgtr": "⪋",
		"LessEqualGreater": "⋚",
		"LessFullEqual": "≦",
		"LessGreater": "≶",
		"lessgtr": "≶",
		"LessLess": "⪡",
		"lesssim": "≲",
		"LessSlantEqual": "⩽",
		"LessTilde": "≲",
		"lfisht": "⥼",
		"lfloor": "⌊",
		"Lfr": "𝔏",
		"lfr": "𝔩",
		"lg": "≶",
		"lgE": "⪑",
		"lHar": "⥢",
		"lhard": "↽",
		"lharu": "↼",
		"lharul": "⥪",
		"lhblk": "▄",
		"LJcy": "Љ",
		"ljcy": "љ",
		"llarr": "⇇",
		"ll": "≪",
		"Ll": "⋘",
		"llcorner": "⌞",
		"Lleftarrow": "⇚",
		"llhard": "⥫",
		"lltri": "◺",
		"Lmidot": "Ŀ",
		"lmidot": "ŀ",
		"lmoustache": "⎰",
		"lmoust": "⎰",
		"lnap": "⪉",
		"lnapprox": "⪉",
		"lne": "⪇",
		"lnE": "≨",
		"lneq": "⪇",
		"lneqq": "≨",
		"lnsim": "⋦",
		"loang": "⟬",
		"loarr": "⇽",
		"lobrk": "⟦",
		"longleftarrow": "⟵",
		"LongLeftArrow": "⟵",
		"Longleftarrow": "⟸",
		"longleftrightarrow": "⟷",
		"LongLeftRightArrow": "⟷",
		"Longleftrightarrow": "⟺",
		"longmapsto": "⟼",
		"longrightarrow": "⟶",
		"LongRightArrow": "⟶",
		"Longrightarrow": "⟹",
		"looparrowleft": "↫",
		"looparrowright": "↬",
		"lopar": "⦅",
		"Lopf": "𝕃",
		"lopf": "𝕝",
		"loplus": "⨭",
		"lotimes": "⨴",
		"lowast": "∗",
		"lowbar": "_",
		"LowerLeftArrow": "↙",
		"LowerRightArrow": "↘",
		"loz": "◊",
		"lozenge": "◊",
		"lozf": "⧫",
		"lpar": "(",
		"lparlt": "⦓",
		"lrarr": "⇆",
		"lrcorner": "⌟",
		"lrhar": "⇋",
		"lrhard": "⥭",
		"lrm": "‎",
		"lrtri": "⊿",
		"lsaquo": "‹",
		"lscr": "𝓁",
		"Lscr": "ℒ",
		"lsh": "↰",
		"Lsh": "↰",
		"lsim": "≲",
		"lsime": "⪍",
		"lsimg": "⪏",
		"lsqb": "[",
		"lsquo": "‘",
		"lsquor": "‚",
		"Lstrok": "Ł",
		"lstrok": "ł",
		"ltcc": "⪦",
		"ltcir": "⩹",
		"lt": "<",
		"LT": "<",
		"Lt": "≪",
		"ltdot": "⋖",
		"lthree": "⋋",
		"ltimes": "⋉",
		"ltlarr": "⥶",
		"ltquest": "⩻",
		"ltri": "◃",
		"ltrie": "⊴",
		"ltrif": "◂",
		"ltrPar": "⦖",
		"lurdshar": "⥊",
		"luruhar": "⥦",
		"lvertneqq": "≨︀",
		"lvnE": "≨︀",
		"macr": "¯",
		"male": "♂",
		"malt": "✠",
		"maltese": "✠",
		"Map": "⤅",
		"map": "↦",
		"mapsto": "↦",
		"mapstodown": "↧",
		"mapstoleft": "↤",
		"mapstoup": "↥",
		"marker": "▮",
		"mcomma": "⨩",
		"Mcy": "М",
		"mcy": "м",
		"mdash": "—",
		"mDDot": "∺",
		"measuredangle": "∡",
		"MediumSpace": " ",
		"Mellintrf": "ℳ",
		"Mfr": "𝔐",
		"mfr": "𝔪",
		"mho": "℧",
		"micro": "µ",
		"midast": "*",
		"midcir": "⫰",
		"mid": "∣",
		"middot": "·",
		"minusb": "⊟",
		"minus": "−",
		"minusd": "∸",
		"minusdu": "⨪",
		"MinusPlus": "∓",
		"mlcp": "⫛",
		"mldr": "…",
		"mnplus": "∓",
		"models": "⊧",
		"Mopf": "𝕄",
		"mopf": "𝕞",
		"mp": "∓",
		"mscr": "𝓂",
		"Mscr": "ℳ",
		"mstpos": "∾",
		"Mu": "Μ",
		"mu": "μ",
		"multimap": "⊸",
		"mumap": "⊸",
		"nabla": "∇",
		"Nacute": "Ń",
		"nacute": "ń",
		"nang": "∠⃒",
		"nap": "≉",
		"napE": "⩰̸",
		"napid": "≋̸",
		"napos": "ŉ",
		"napprox": "≉",
		"natural": "♮",
		"naturals": "ℕ",
		"natur": "♮",
		"nbsp": " ",
		"nbump": "≎̸",
		"nbumpe": "≏̸",
		"ncap": "⩃",
		"Ncaron": "Ň",
		"ncaron": "ň",
		"Ncedil": "Ņ",
		"ncedil": "ņ",
		"ncong": "≇",
		"ncongdot": "⩭̸",
		"ncup": "⩂",
		"Ncy": "Н",
		"ncy": "н",
		"ndash": "–",
		"nearhk": "⤤",
		"nearr": "↗",
		"neArr": "⇗",
		"nearrow": "↗",
		"ne": "≠",
		"nedot": "≐̸",
		"NegativeMediumSpace": "​",
		"NegativeThickSpace": "​",
		"NegativeThinSpace": "​",
		"NegativeVeryThinSpace": "​",
		"nequiv": "≢",
		"nesear": "⤨",
		"nesim": "≂̸",
		"NestedGreaterGreater": "≫",
		"NestedLessLess": "≪",
		"NewLine": "\n",
		"nexist": "∄",
		"nexists": "∄",
		"Nfr": "𝔑",
		"nfr": "𝔫",
		"ngE": "≧̸",
		"nge": "≱",
		"ngeq": "≱",
		"ngeqq": "≧̸",
		"ngeqslant": "⩾̸",
		"nges": "⩾̸",
		"nGg": "⋙̸",
		"ngsim": "≵",
		"nGt": "≫⃒",
		"ngt": "≯",
		"ngtr": "≯",
		"nGtv": "≫̸",
		"nharr": "↮",
		"nhArr": "⇎",
		"nhpar": "⫲",
		"ni": "∋",
		"nis": "⋼",
		"nisd": "⋺",
		"niv": "∋",
		"NJcy": "Њ",
		"njcy": "њ",
		"nlarr": "↚",
		"nlArr": "⇍",
		"nldr": "‥",
		"nlE": "≦̸",
		"nle": "≰",
		"nleftarrow": "↚",
		"nLeftarrow": "⇍",
		"nleftrightarrow": "↮",
		"nLeftrightarrow": "⇎",
		"nleq": "≰",
		"nleqq": "≦̸",
		"nleqslant": "⩽̸",
		"nles": "⩽̸",
		"nless": "≮",
		"nLl": "⋘̸",
		"nlsim": "≴",
		"nLt": "≪⃒",
		"nlt": "≮",
		"nltri": "⋪",
		"nltrie": "⋬",
		"nLtv": "≪̸",
		"nmid": "∤",
		"NoBreak": "⁠",
		"NonBreakingSpace": " ",
		"nopf": "𝕟",
		"Nopf": "ℕ",
		"Not": "⫬",
		"not": "¬",
		"NotCongruent": "≢",
		"NotCupCap": "≭",
		"NotDoubleVerticalBar": "∦",
		"NotElement": "∉",
		"NotEqual": "≠",
		"NotEqualTilde": "≂̸",
		"NotExists": "∄",
		"NotGreater": "≯",
		"NotGreaterEqual": "≱",
		"NotGreaterFullEqual": "≧̸",
		"NotGreaterGreater": "≫̸",
		"NotGreaterLess": "≹",
		"NotGreaterSlantEqual": "⩾̸",
		"NotGreaterTilde": "≵",
		"NotHumpDownHump": "≎̸",
		"NotHumpEqual": "≏̸",
		"notin": "∉",
		"notindot": "⋵̸",
		"notinE": "⋹̸",
		"notinva": "∉",
		"notinvb": "⋷",
		"notinvc": "⋶",
		"NotLeftTriangleBar": "⧏̸",
		"NotLeftTriangle": "⋪",
		"NotLeftTriangleEqual": "⋬",
		"NotLess": "≮",
		"NotLessEqual": "≰",
		"NotLessGreater": "≸",
		"NotLessLess": "≪̸",
		"NotLessSlantEqual": "⩽̸",
		"NotLessTilde": "≴",
		"NotNestedGreaterGreater": "⪢̸",
		"NotNestedLessLess": "⪡̸",
		"notni": "∌",
		"notniva": "∌",
		"notnivb": "⋾",
		"notnivc": "⋽",
		"NotPrecedes": "⊀",
		"NotPrecedesEqual": "⪯̸",
		"NotPrecedesSlantEqual": "⋠",
		"NotReverseElement": "∌",
		"NotRightTriangleBar": "⧐̸",
		"NotRightTriangle": "⋫",
		"NotRightTriangleEqual": "⋭",
		"NotSquareSubset": "⊏̸",
		"NotSquareSubsetEqual": "⋢",
		"NotSquareSuperset": "⊐̸",
		"NotSquareSupersetEqual": "⋣",
		"NotSubset": "⊂⃒",
		"NotSubsetEqual": "⊈",
		"NotSucceeds": "⊁",
		"NotSucceedsEqual": "⪰̸",
		"NotSucceedsSlantEqual": "⋡",
		"NotSucceedsTilde": "≿̸",
		"NotSuperset": "⊃⃒",
		"NotSupersetEqual": "⊉",
		"NotTilde": "≁",
		"NotTildeEqual": "≄",
		"NotTildeFullEqual": "≇",
		"NotTildeTilde": "≉",
		"NotVerticalBar": "∤",
		"nparallel": "∦",
		"npar": "∦",
		"nparsl": "⫽⃥",
		"npart": "∂̸",
		"npolint": "⨔",
		"npr": "⊀",
		"nprcue": "⋠",
		"nprec": "⊀",
		"npreceq": "⪯̸",
		"npre": "⪯̸",
		"nrarrc": "⤳̸",
		"nrarr": "↛",
		"nrArr": "⇏",
		"nrarrw": "↝̸",
		"nrightarrow": "↛",
		"nRightarrow": "⇏",
		"nrtri": "⋫",
		"nrtrie": "⋭",
		"nsc": "⊁",
		"nsccue": "⋡",
		"nsce": "⪰̸",
		"Nscr": "𝒩",
		"nscr": "𝓃",
		"nshortmid": "∤",
		"nshortparallel": "∦",
		"nsim": "≁",
		"nsime": "≄",
		"nsimeq": "≄",
		"nsmid": "∤",
		"nspar": "∦",
		"nsqsube": "⋢",
		"nsqsupe": "⋣",
		"nsub": "⊄",
		"nsubE": "⫅̸",
		"nsube": "⊈",
		"nsubset": "⊂⃒",
		"nsubseteq": "⊈",
		"nsubseteqq": "⫅̸",
		"nsucc": "⊁",
		"nsucceq": "⪰̸",
		"nsup": "⊅",
		"nsupE": "⫆̸",
		"nsupe": "⊉",
		"nsupset": "⊃⃒",
		"nsupseteq": "⊉",
		"nsupseteqq": "⫆̸",
		"ntgl": "≹",
		"Ntilde": "Ñ",
		"ntilde": "ñ",
		"ntlg": "≸",
		"ntriangleleft": "⋪",
		"ntrianglelefteq": "⋬",
		"ntriangleright": "⋫",
		"ntrianglerighteq": "⋭",
		"Nu": "Ν",
		"nu": "ν",
		"num": "#",
		"numero": "№",
		"numsp": " ",
		"nvap": "≍⃒",
		"nvdash": "⊬",
		"nvDash": "⊭",
		"nVdash": "⊮",
		"nVDash": "⊯",
		"nvge": "≥⃒",
		"nvgt": ">⃒",
		"nvHarr": "⤄",
		"nvinfin": "⧞",
		"nvlArr": "⤂",
		"nvle": "≤⃒",
		"nvlt": "<⃒",
		"nvltrie": "⊴⃒",
		"nvrArr": "⤃",
		"nvrtrie": "⊵⃒",
		"nvsim": "∼⃒",
		"nwarhk": "⤣",
		"nwarr": "↖",
		"nwArr": "⇖",
		"nwarrow": "↖",
		"nwnear": "⤧",
		"Oacute": "Ó",
		"oacute": "ó",
		"oast": "⊛",
		"Ocirc": "Ô",
		"ocirc": "ô",
		"ocir": "⊚",
		"Ocy": "О",
		"ocy": "о",
		"odash": "⊝",
		"Odblac": "Ő",
		"odblac": "ő",
		"odiv": "⨸",
		"odot": "⊙",
		"odsold": "⦼",
		"OElig": "Œ",
		"oelig": "œ",
		"ofcir": "⦿",
		"Ofr": "𝔒",
		"ofr": "𝔬",
		"ogon": "˛",
		"Ograve": "Ò",
		"ograve": "ò",
		"ogt": "⧁",
		"ohbar": "⦵",
		"ohm": "Ω",
		"oint": "∮",
		"olarr": "↺",
		"olcir": "⦾",
		"olcross": "⦻",
		"oline": "‾",
		"olt": "⧀",
		"Omacr": "Ō",
		"omacr": "ō",
		"Omega": "Ω",
		"omega": "ω",
		"Omicron": "Ο",
		"omicron": "ο",
		"omid": "⦶",
		"ominus": "⊖",
		"Oopf": "𝕆",
		"oopf": "𝕠",
		"opar": "⦷",
		"OpenCurlyDoubleQuote": "“",
		"OpenCurlyQuote": "‘",
		"operp": "⦹",
		"oplus": "⊕",
		"orarr": "↻",
		"Or": "⩔",
		"or": "∨",
		"ord": "⩝",
		"order": "ℴ",
		"orderof": "ℴ",
		"ordf": "ª",
		"ordm": "º",
		"origof": "⊶",
		"oror": "⩖",
		"orslope": "⩗",
		"orv": "⩛",
		"oS": "Ⓢ",
		"Oscr": "𝒪",
		"oscr": "ℴ",
		"Oslash": "Ø",
		"oslash": "ø",
		"osol": "⊘",
		"Otilde": "Õ",
		"otilde": "õ",
		"otimesas": "⨶",
		"Otimes": "⨷",
		"otimes": "⊗",
		"Ouml": "Ö",
		"ouml": "ö",
		"ovbar": "⌽",
		"OverBar": "‾",
		"OverBrace": "⏞",
		"OverBracket": "⎴",
		"OverParenthesis": "⏜",
		"para": "¶",
		"parallel": "∥",
		"par": "∥",
		"parsim": "⫳",
		"parsl": "⫽",
		"part": "∂",
		"PartialD": "∂",
		"Pcy": "П",
		"pcy": "п",
		"percnt": "%",
		"period": ".",
		"permil": "‰",
		"perp": "⊥",
		"pertenk": "‱",
		"Pfr": "𝔓",
		"pfr": "𝔭",
		"Phi": "Φ",
		"phi": "φ",
		"phiv": "ϕ",
		"phmmat": "ℳ",
		"phone": "☎",
		"Pi": "Π",
		"pi": "π",
		"pitchfork": "⋔",
		"piv": "ϖ",
		"planck": "ℏ",
		"planckh": "ℎ",
		"plankv": "ℏ",
		"plusacir": "⨣",
		"plusb": "⊞",
		"pluscir": "⨢",
		"plus": "+",
		"plusdo": "∔",
		"plusdu": "⨥",
		"pluse": "⩲",
		"PlusMinus": "±",
		"plusmn": "±",
		"plussim": "⨦",
		"plustwo": "⨧",
		"pm": "±",
		"Poincareplane": "ℌ",
		"pointint": "⨕",
		"popf": "𝕡",
		"Popf": "ℙ",
		"pound": "£",
		"prap": "⪷",
		"Pr": "⪻",
		"pr": "≺",
		"prcue": "≼",
		"precapprox": "⪷",
		"prec": "≺",
		"preccurlyeq": "≼",
		"Precedes": "≺",
		"PrecedesEqual": "⪯",
		"PrecedesSlantEqual": "≼",
		"PrecedesTilde": "≾",
		"preceq": "⪯",
		"precnapprox": "⪹",
		"precneqq": "⪵",
		"precnsim": "⋨",
		"pre": "⪯",
		"prE": "⪳",
		"precsim": "≾",
		"prime": "′",
		"Prime": "″",
		"primes": "ℙ",
		"prnap": "⪹",
		"prnE": "⪵",
		"prnsim": "⋨",
		"prod": "∏",
		"Product": "∏",
		"profalar": "⌮",
		"profline": "⌒",
		"profsurf": "⌓",
		"prop": "∝",
		"Proportional": "∝",
		"Proportion": "∷",
		"propto": "∝",
		"prsim": "≾",
		"prurel": "⊰",
		"Pscr": "𝒫",
		"pscr": "𝓅",
		"Psi": "Ψ",
		"psi": "ψ",
		"puncsp": " ",
		"Qfr": "𝔔",
		"qfr": "𝔮",
		"qint": "⨌",
		"qopf": "𝕢",
		"Qopf": "ℚ",
		"qprime": "⁗",
		"Qscr": "𝒬",
		"qscr": "𝓆",
		"quaternions": "ℍ",
		"quatint": "⨖",
		"quest": "?",
		"questeq": "≟",
		"quot": "\"",
		"QUOT": "\"",
		"rAarr": "⇛",
		"race": "∽̱",
		"Racute": "Ŕ",
		"racute": "ŕ",
		"radic": "√",
		"raemptyv": "⦳",
		"rang": "⟩",
		"Rang": "⟫",
		"rangd": "⦒",
		"range": "⦥",
		"rangle": "⟩",
		"raquo": "»",
		"rarrap": "⥵",
		"rarrb": "⇥",
		"rarrbfs": "⤠",
		"rarrc": "⤳",
		"rarr": "→",
		"Rarr": "↠",
		"rArr": "⇒",
		"rarrfs": "⤞",
		"rarrhk": "↪",
		"rarrlp": "↬",
		"rarrpl": "⥅",
		"rarrsim": "⥴",
		"Rarrtl": "⤖",
		"rarrtl": "↣",
		"rarrw": "↝",
		"ratail": "⤚",
		"rAtail": "⤜",
		"ratio": "∶",
		"rationals": "ℚ",
		"rbarr": "⤍",
		"rBarr": "⤏",
		"RBarr": "⤐",
		"rbbrk": "❳",
		"rbrace": "}",
		"rbrack": "]",
		"rbrke": "⦌",
		"rbrksld": "⦎",
		"rbrkslu": "⦐",
		"Rcaron": "Ř",
		"rcaron": "ř",
		"Rcedil": "Ŗ",
		"rcedil": "ŗ",
		"rceil": "⌉",
		"rcub": "}",
		"Rcy": "Р",
		"rcy": "р",
		"rdca": "⤷",
		"rdldhar": "⥩",
		"rdquo": "”",
		"rdquor": "”",
		"rdsh": "↳",
		"real": "ℜ",
		"realine": "ℛ",
		"realpart": "ℜ",
		"reals": "ℝ",
		"Re": "ℜ",
		"rect": "▭",
		"reg": "®",
		"REG": "®",
		"ReverseElement": "∋",
		"ReverseEquilibrium": "⇋",
		"ReverseUpEquilibrium": "⥯",
		"rfisht": "⥽",
		"rfloor": "⌋",
		"rfr": "𝔯",
		"Rfr": "ℜ",
		"rHar": "⥤",
		"rhard": "⇁",
		"rharu": "⇀",
		"rharul": "⥬",
		"Rho": "Ρ",
		"rho": "ρ",
		"rhov": "ϱ",
		"RightAngleBracket": "⟩",
		"RightArrowBar": "⇥",
		"rightarrow": "→",
		"RightArrow": "→",
		"Rightarrow": "⇒",
		"RightArrowLeftArrow": "⇄",
		"rightarrowtail": "↣",
		"RightCeiling": "⌉",
		"RightDoubleBracket": "⟧",
		"RightDownTeeVector": "⥝",
		"RightDownVectorBar": "⥕",
		"RightDownVector": "⇂",
		"RightFloor": "⌋",
		"rightharpoondown": "⇁",
		"rightharpoonup": "⇀",
		"rightleftarrows": "⇄",
		"rightleftharpoons": "⇌",
		"rightrightarrows": "⇉",
		"rightsquigarrow": "↝",
		"RightTeeArrow": "↦",
		"RightTee": "⊢",
		"RightTeeVector": "⥛",
		"rightthreetimes": "⋌",
		"RightTriangleBar": "⧐",
		"RightTriangle": "⊳",
		"RightTriangleEqual": "⊵",
		"RightUpDownVector": "⥏",
		"RightUpTeeVector": "⥜",
		"RightUpVectorBar": "⥔",
		"RightUpVector": "↾",
		"RightVectorBar": "⥓",
		"RightVector": "⇀",
		"ring": "˚",
		"risingdotseq": "≓",
		"rlarr": "⇄",
		"rlhar": "⇌",
		"rlm": "‏",
		"rmoustache": "⎱",
		"rmoust": "⎱",
		"rnmid": "⫮",
		"roang": "⟭",
		"roarr": "⇾",
		"robrk": "⟧",
		"ropar": "⦆",
		"ropf": "𝕣",
		"Ropf": "ℝ",
		"roplus": "⨮",
		"rotimes": "⨵",
		"RoundImplies": "⥰",
		"rpar": ")",
		"rpargt": "⦔",
		"rppolint": "⨒",
		"rrarr": "⇉",
		"Rrightarrow": "⇛",
		"rsaquo": "›",
		"rscr": "𝓇",
		"Rscr": "ℛ",
		"rsh": "↱",
		"Rsh": "↱",
		"rsqb": "]",
		"rsquo": "’",
		"rsquor": "’",
		"rthree": "⋌",
		"rtimes": "⋊",
		"rtri": "▹",
		"rtrie": "⊵",
		"rtrif": "▸",
		"rtriltri": "⧎",
		"RuleDelayed": "⧴",
		"ruluhar": "⥨",
		"rx": "℞",
		"Sacute": "Ś",
		"sacute": "ś",
		"sbquo": "‚",
		"scap": "⪸",
		"Scaron": "Š",
		"scaron": "š",
		"Sc": "⪼",
		"sc": "≻",
		"sccue": "≽",
		"sce": "⪰",
		"scE": "⪴",
		"Scedil": "Ş",
		"scedil": "ş",
		"Scirc": "Ŝ",
		"scirc": "ŝ",
		"scnap": "⪺",
		"scnE": "⪶",
		"scnsim": "⋩",
		"scpolint": "⨓",
		"scsim": "≿",
		"Scy": "С",
		"scy": "с",
		"sdotb": "⊡",
		"sdot": "⋅",
		"sdote": "⩦",
		"searhk": "⤥",
		"searr": "↘",
		"seArr": "⇘",
		"searrow": "↘",
		"sect": "§",
		"semi": ";",
		"seswar": "⤩",
		"setminus": "∖",
		"setmn": "∖",
		"sext": "✶",
		"Sfr": "𝔖",
		"sfr": "𝔰",
		"sfrown": "⌢",
		"sharp": "♯",
		"SHCHcy": "Щ",
		"shchcy": "щ",
		"SHcy": "Ш",
		"shcy": "ш",
		"ShortDownArrow": "↓",
		"ShortLeftArrow": "←",
		"shortmid": "∣",
		"shortparallel": "∥",
		"ShortRightArrow": "→",
		"ShortUpArrow": "↑",
		"shy": "­",
		"Sigma": "Σ",
		"sigma": "σ",
		"sigmaf": "ς",
		"sigmav": "ς",
		"sim": "∼",
		"simdot": "⩪",
		"sime": "≃",
		"simeq": "≃",
		"simg": "⪞",
		"simgE": "⪠",
		"siml": "⪝",
		"simlE": "⪟",
		"simne": "≆",
		"simplus": "⨤",
		"simrarr": "⥲",
		"slarr": "←",
		"SmallCircle": "∘",
		"smallsetminus": "∖",
		"smashp": "⨳",
		"smeparsl": "⧤",
		"smid": "∣",
		"smile": "⌣",
		"smt": "⪪",
		"smte": "⪬",
		"smtes": "⪬︀",
		"SOFTcy": "Ь",
		"softcy": "ь",
		"solbar": "⌿",
		"solb": "⧄",
		"sol": "/",
		"Sopf": "𝕊",
		"sopf": "𝕤",
		"spades": "♠",
		"spadesuit": "♠",
		"spar": "∥",
		"sqcap": "⊓",
		"sqcaps": "⊓︀",
		"sqcup": "⊔",
		"sqcups": "⊔︀",
		"Sqrt": "√",
		"sqsub": "⊏",
		"sqsube": "⊑",
		"sqsubset": "⊏",
		"sqsubseteq": "⊑",
		"sqsup": "⊐",
		"sqsupe": "⊒",
		"sqsupset": "⊐",
		"sqsupseteq": "⊒",
		"square": "□",
		"Square": "□",
		"SquareIntersection": "⊓",
		"SquareSubset": "⊏",
		"SquareSubsetEqual": "⊑",
		"SquareSuperset": "⊐",
		"SquareSupersetEqual": "⊒",
		"SquareUnion": "⊔",
		"squarf": "▪",
		"squ": "□",
		"squf": "▪",
		"srarr": "→",
		"Sscr": "𝒮",
		"sscr": "𝓈",
		"ssetmn": "∖",
		"ssmile": "⌣",
		"sstarf": "⋆",
		"Star": "⋆",
		"star": "☆",
		"starf": "★",
		"straightepsilon": "ϵ",
		"straightphi": "ϕ",
		"strns": "¯",
		"sub": "⊂",
		"Sub": "⋐",
		"subdot": "⪽",
		"subE": "⫅",
		"sube": "⊆",
		"subedot": "⫃",
		"submult": "⫁",
		"subnE": "⫋",
		"subne": "⊊",
		"subplus": "⪿",
		"subrarr": "⥹",
		"subset": "⊂",
		"Subset": "⋐",
		"subseteq": "⊆",
		"subseteqq": "⫅",
		"SubsetEqual": "⊆",
		"subsetneq": "⊊",
		"subsetneqq": "⫋",
		"subsim": "⫇",
		"subsub": "⫕",
		"subsup": "⫓",
		"succapprox": "⪸",
		"succ": "≻",
		"succcurlyeq": "≽",
		"Succeeds": "≻",
		"SucceedsEqual": "⪰",
		"SucceedsSlantEqual": "≽",
		"SucceedsTilde": "≿",
		"succeq": "⪰",
		"succnapprox": "⪺",
		"succneqq": "⪶",
		"succnsim": "⋩",
		"succsim": "≿",
		"SuchThat": "∋",
		"sum": "∑",
		"Sum": "∑",
		"sung": "♪",
		"sup1": "¹",
		"sup2": "²",
		"sup3": "³",
		"sup": "⊃",
		"Sup": "⋑",
		"supdot": "⪾",
		"supdsub": "⫘",
		"supE": "⫆",
		"supe": "⊇",
		"supedot": "⫄",
		"Superset": "⊃",
		"SupersetEqual": "⊇",
		"suphsol": "⟉",
		"suphsub": "⫗",
		"suplarr": "⥻",
		"supmult": "⫂",
		"supnE": "⫌",
		"supne": "⊋",
		"supplus": "⫀",
		"supset": "⊃",
		"Supset": "⋑",
		"supseteq": "⊇",
		"supseteqq": "⫆",
		"supsetneq": "⊋",
		"supsetneqq": "⫌",
		"supsim": "⫈",
		"supsub": "⫔",
		"supsup": "⫖",
		"swarhk": "⤦",
		"swarr": "↙",
		"swArr": "⇙",
		"swarrow": "↙",
		"swnwar": "⤪",
		"szlig": "ß",
		"Tab": "\t",
		"target": "⌖",
		"Tau": "Τ",
		"tau": "τ",
		"tbrk": "⎴",
		"Tcaron": "Ť",
		"tcaron": "ť",
		"Tcedil": "Ţ",
		"tcedil": "ţ",
		"Tcy": "Т",
		"tcy": "т",
		"tdot": "⃛",
		"telrec": "⌕",
		"Tfr": "𝔗",
		"tfr": "𝔱",
		"there4": "∴",
		"therefore": "∴",
		"Therefore": "∴",
		"Theta": "Θ",
		"theta": "θ",
		"thetasym": "ϑ",
		"thetav": "ϑ",
		"thickapprox": "≈",
		"thicksim": "∼",
		"ThickSpace": "  ",
		"ThinSpace": " ",
		"thinsp": " ",
		"thkap": "≈",
		"thksim": "∼",
		"THORN": "Þ",
		"thorn": "þ",
		"tilde": "˜",
		"Tilde": "∼",
		"TildeEqual": "≃",
		"TildeFullEqual": "≅",
		"TildeTilde": "≈",
		"timesbar": "⨱",
		"timesb": "⊠",
		"times": "×",
		"timesd": "⨰",
		"tint": "∭",
		"toea": "⤨",
		"topbot": "⌶",
		"topcir": "⫱",
		"top": "⊤",
		"Topf": "𝕋",
		"topf": "𝕥",
		"topfork": "⫚",
		"tosa": "⤩",
		"tprime": "‴",
		"trade": "™",
		"TRADE": "™",
		"triangle": "▵",
		"triangledown": "▿",
		"triangleleft": "◃",
		"trianglelefteq": "⊴",
		"triangleq": "≜",
		"triangleright": "▹",
		"trianglerighteq": "⊵",
		"tridot": "◬",
		"trie": "≜",
		"triminus": "⨺",
		"TripleDot": "⃛",
		"triplus": "⨹",
		"trisb": "⧍",
		"tritime": "⨻",
		"trpezium": "⏢",
		"Tscr": "𝒯",
		"tscr": "𝓉",
		"TScy": "Ц",
		"tscy": "ц",
		"TSHcy": "Ћ",
		"tshcy": "ћ",
		"Tstrok": "Ŧ",
		"tstrok": "ŧ",
		"twixt": "≬",
		"twoheadleftarrow": "↞",
		"twoheadrightarrow": "↠",
		"Uacute": "Ú",
		"uacute": "ú",
		"uarr": "↑",
		"Uarr": "↟",
		"uArr": "⇑",
		"Uarrocir": "⥉",
		"Ubrcy": "Ў",
		"ubrcy": "ў",
		"Ubreve": "Ŭ",
		"ubreve": "ŭ",
		"Ucirc": "Û",
		"ucirc": "û",
		"Ucy": "У",
		"ucy": "у",
		"udarr": "⇅",
		"Udblac": "Ű",
		"udblac": "ű",
		"udhar": "⥮",
		"ufisht": "⥾",
		"Ufr": "𝔘",
		"ufr": "𝔲",
		"Ugrave": "Ù",
		"ugrave": "ù",
		"uHar": "⥣",
		"uharl": "↿",
		"uharr": "↾",
		"uhblk": "▀",
		"ulcorn": "⌜",
		"ulcorner": "⌜",
		"ulcrop": "⌏",
		"ultri": "◸",
		"Umacr": "Ū",
		"umacr": "ū",
		"uml": "¨",
		"UnderBar": "_",
		"UnderBrace": "⏟",
		"UnderBracket": "⎵",
		"UnderParenthesis": "⏝",
		"Union": "⋃",
		"UnionPlus": "⊎",
		"Uogon": "Ų",
		"uogon": "ų",
		"Uopf": "𝕌",
		"uopf": "𝕦",
		"UpArrowBar": "⤒",
		"uparrow": "↑",
		"UpArrow": "↑",
		"Uparrow": "⇑",
		"UpArrowDownArrow": "⇅",
		"updownarrow": "↕",
		"UpDownArrow": "↕",
		"Updownarrow": "⇕",
		"UpEquilibrium": "⥮",
		"upharpoonleft": "↿",
		"upharpoonright": "↾",
		"uplus": "⊎",
		"UpperLeftArrow": "↖",
		"UpperRightArrow": "↗",
		"upsi": "υ",
		"Upsi": "ϒ",
		"upsih": "ϒ",
		"Upsilon": "Υ",
		"upsilon": "υ",
		"UpTeeArrow": "↥",
		"UpTee": "⊥",
		"upuparrows": "⇈",
		"urcorn": "⌝",
		"urcorner": "⌝",
		"urcrop": "⌎",
		"Uring": "Ů",
		"uring": "ů",
		"urtri": "◹",
		"Uscr": "𝒰",
		"uscr": "𝓊",
		"utdot": "⋰",
		"Utilde": "Ũ",
		"utilde": "ũ",
		"utri": "▵",
		"utrif": "▴",
		"uuarr": "⇈",
		"Uuml": "Ü",
		"uuml": "ü",
		"uwangle": "⦧",
		"vangrt": "⦜",
		"varepsilon": "ϵ",
		"varkappa": "ϰ",
		"varnothing": "∅",
		"varphi": "ϕ",
		"varpi": "ϖ",
		"varpropto": "∝",
		"varr": "↕",
		"vArr": "⇕",
		"varrho": "ϱ",
		"varsigma": "ς",
		"varsubsetneq": "⊊︀",
		"varsubsetneqq": "⫋︀",
		"varsupsetneq": "⊋︀",
		"varsupsetneqq": "⫌︀",
		"vartheta": "ϑ",
		"vartriangleleft": "⊲",
		"vartriangleright": "⊳",
		"vBar": "⫨",
		"Vbar": "⫫",
		"vBarv": "⫩",
		"Vcy": "В",
		"vcy": "в",
		"vdash": "⊢",
		"vDash": "⊨",
		"Vdash": "⊩",
		"VDash": "⊫",
		"Vdashl": "⫦",
		"veebar": "⊻",
		"vee": "∨",
		"Vee": "⋁",
		"veeeq": "≚",
		"vellip": "⋮",
		"verbar": "|",
		"Verbar": "‖",
		"vert": "|",
		"Vert": "‖",
		"VerticalBar": "∣",
		"VerticalLine": "|",
		"VerticalSeparator": "❘",
		"VerticalTilde": "≀",
		"VeryThinSpace": " ",
		"Vfr": "𝔙",
		"vfr": "𝔳",
		"vltri": "⊲",
		"vnsub": "⊂⃒",
		"vnsup": "⊃⃒",
		"Vopf": "𝕍",
		"vopf": "𝕧",
		"vprop": "∝",
		"vrtri": "⊳",
		"Vscr": "𝒱",
		"vscr": "𝓋",
		"vsubnE": "⫋︀",
		"vsubne": "⊊︀",
		"vsupnE": "⫌︀",
		"vsupne": "⊋︀",
		"Vvdash": "⊪",
		"vzigzag": "⦚",
		"Wcirc": "Ŵ",
		"wcirc": "ŵ",
		"wedbar": "⩟",
		"wedge": "∧",
		"Wedge": "⋀",
		"wedgeq": "≙",
		"weierp": "℘",
		"Wfr": "𝔚",
		"wfr": "𝔴",
		"Wopf": "𝕎",
		"wopf": "𝕨",
		"wp": "℘",
		"wr": "≀",
		"wreath": "≀",
		"Wscr": "𝒲",
		"wscr": "𝓌",
		"xcap": "⋂",
		"xcirc": "◯",
		"xcup": "⋃",
		"xdtri": "▽",
		"Xfr": "𝔛",
		"xfr": "𝔵",
		"xharr": "⟷",
		"xhArr": "⟺",
		"Xi": "Ξ",
		"xi": "ξ",
		"xlarr": "⟵",
		"xlArr": "⟸",
		"xmap": "⟼",
		"xnis": "⋻",
		"xodot": "⨀",
		"Xopf": "𝕏",
		"xopf": "𝕩",
		"xoplus": "⨁",
		"xotime": "⨂",
		"xrarr": "⟶",
		"xrArr": "⟹",
		"Xscr": "𝒳",
		"xscr": "𝓍",
		"xsqcup": "⨆",
		"xuplus": "⨄",
		"xutri": "△",
		"xvee": "⋁",
		"xwedge": "⋀",
		"Yacute": "Ý",
		"yacute": "ý",
		"YAcy": "Я",
		"yacy": "я",
		"Ycirc": "Ŷ",
		"ycirc": "ŷ",
		"Ycy": "Ы",
		"ycy": "ы",
		"yen": "¥",
		"Yfr": "𝔜",
		"yfr": "𝔶",
		"YIcy": "Ї",
		"yicy": "ї",
		"Yopf": "𝕐",
		"yopf": "𝕪",
		"Yscr": "𝒴",
		"yscr": "𝓎",
		"YUcy": "Ю",
		"yucy": "ю",
		"yuml": "ÿ",
		"Yuml": "Ÿ",
		"Zacute": "Ź",
		"zacute": "ź",
		"Zcaron": "Ž",
		"zcaron": "ž",
		"Zcy": "З",
		"zcy": "з",
		"Zdot": "Ż",
		"zdot": "ż",
		"zeetrf": "ℨ",
		"ZeroWidthSpace": "​",
		"Zeta": "Ζ",
		"zeta": "ζ",
		"zfr": "𝔷",
		"Zfr": "ℨ",
		"ZHcy": "Ж",
		"zhcy": "ж",
		"zigrarr": "⇝",
		"zopf": "𝕫",
		"Zopf": "ℤ",
		"Zscr": "𝒵",
		"zscr": "𝓏",
		"zwj": "‍",
		"zwnj": "‌"
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var entityMap = __webpack_require__(48),
	    legacyMap = __webpack_require__(50),
	    xmlMap = __webpack_require__(47),
	    decodeCodePoint = __webpack_require__(51);

	var decodeXMLStrict = getStrictDecoder(xmlMap),
	    decodeHTMLStrict = getStrictDecoder(entityMap);

	function getStrictDecoder(map) {
		var keys = Object.keys(map).join("|"),
		    replace = getReplacer(map);

		keys += "|#[xX][\\da-fA-F]+|#\\d+";

		var re = new RegExp("&(?:" + keys + ");", "g");

		return function (str) {
			return String(str).replace(re, replace);
		};
	}

	var decodeHTML = function () {
		var legacy = Object.keys(legacyMap).sort(sorter);

		var keys = Object.keys(entityMap).sort(sorter);

		for (var i = 0, j = 0; i < keys.length; i++) {
			if (legacy[j] === keys[i]) {
				keys[i] += ";?";
				j++;
			} else {
				keys[i] += ";";
			}
		}

		var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g"),
		    replace = getReplacer(entityMap);

		function replacer(str) {
			if (str.substr(-1) !== ";") str += ";";
			return replace(str);
		}

		//TODO consider creating a merged map
		return function (str) {
			return String(str).replace(re, replacer);
		};
	}();

	function sorter(a, b) {
		return a < b ? 1 : -1;
	}

	function getReplacer(map) {
		return function replace(str) {
			if (str.charAt(1) === "#") {
				if (str.charAt(2) === "X" || str.charAt(2) === "x") {
					return decodeCodePoint(parseInt(str.substr(3), 16));
				}
				return decodeCodePoint(parseInt(str.substr(2), 10));
			}
			return map[str.slice(1, -1)];
		};
	}

	module.exports = {
		XML: decodeXMLStrict,
		HTML: decodeHTML,
		HTMLStrict: decodeHTMLStrict
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = {
		"Aacute": "Á",
		"aacute": "á",
		"Acirc": "Â",
		"acirc": "â",
		"acute": "´",
		"AElig": "Æ",
		"aelig": "æ",
		"Agrave": "À",
		"agrave": "à",
		"amp": "&",
		"AMP": "&",
		"Aring": "Å",
		"aring": "å",
		"Atilde": "Ã",
		"atilde": "ã",
		"Auml": "Ä",
		"auml": "ä",
		"brvbar": "¦",
		"Ccedil": "Ç",
		"ccedil": "ç",
		"cedil": "¸",
		"cent": "¢",
		"copy": "©",
		"COPY": "©",
		"curren": "¤",
		"deg": "°",
		"divide": "÷",
		"Eacute": "É",
		"eacute": "é",
		"Ecirc": "Ê",
		"ecirc": "ê",
		"Egrave": "È",
		"egrave": "è",
		"ETH": "Ð",
		"eth": "ð",
		"Euml": "Ë",
		"euml": "ë",
		"frac12": "½",
		"frac14": "¼",
		"frac34": "¾",
		"gt": ">",
		"GT": ">",
		"Iacute": "Í",
		"iacute": "í",
		"Icirc": "Î",
		"icirc": "î",
		"iexcl": "¡",
		"Igrave": "Ì",
		"igrave": "ì",
		"iquest": "¿",
		"Iuml": "Ï",
		"iuml": "ï",
		"laquo": "«",
		"lt": "<",
		"LT": "<",
		"macr": "¯",
		"micro": "µ",
		"middot": "·",
		"nbsp": " ",
		"not": "¬",
		"Ntilde": "Ñ",
		"ntilde": "ñ",
		"Oacute": "Ó",
		"oacute": "ó",
		"Ocirc": "Ô",
		"ocirc": "ô",
		"Ograve": "Ò",
		"ograve": "ò",
		"ordf": "ª",
		"ordm": "º",
		"Oslash": "Ø",
		"oslash": "ø",
		"Otilde": "Õ",
		"otilde": "õ",
		"Ouml": "Ö",
		"ouml": "ö",
		"para": "¶",
		"plusmn": "±",
		"pound": "£",
		"quot": "\"",
		"QUOT": "\"",
		"raquo": "»",
		"reg": "®",
		"REG": "®",
		"sect": "§",
		"shy": "­",
		"sup1": "¹",
		"sup2": "²",
		"sup3": "³",
		"szlig": "ß",
		"THORN": "Þ",
		"thorn": "þ",
		"times": "×",
		"Uacute": "Ú",
		"uacute": "ú",
		"Ucirc": "Û",
		"ucirc": "û",
		"Ugrave": "Ù",
		"ugrave": "ù",
		"uml": "¨",
		"Uuml": "Ü",
		"uuml": "ü",
		"Yacute": "Ý",
		"yacute": "ý",
		"yen": "¥",
		"yuml": "ÿ"
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var decodeMap = __webpack_require__(52);

	module.exports = decodeCodePoint;

	// modified version of https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
	function decodeCodePoint(codePoint) {

		if (codePoint >= 0xD800 && codePoint <= 0xDFFF || codePoint > 0x10FFFF) {
			return "�";
		}

		if (codePoint in decodeMap) {
			codePoint = decodeMap[codePoint];
		}

		var output = "";

		if (codePoint > 0xFFFF) {
			codePoint -= 0x10000;
			output += String.fromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
			codePoint = 0xDC00 | codePoint & 0x3FF;
		}

		output += String.fromCharCode(codePoint);
		return output;
	}

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = {
		"0": 65533,
		"128": 8364,
		"130": 8218,
		"131": 402,
		"132": 8222,
		"133": 8230,
		"134": 8224,
		"135": 8225,
		"136": 710,
		"137": 8240,
		"138": 352,
		"139": 8249,
		"140": 338,
		"142": 381,
		"145": 8216,
		"146": 8217,
		"147": 8220,
		"148": 8221,
		"149": 8226,
		"150": 8211,
		"151": 8212,
		"152": 732,
		"153": 8482,
		"154": 353,
		"155": 8250,
		"156": 339,
		"158": 382,
		"159": 376
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Node = __webpack_require__(40);
	var common = __webpack_require__(42);
	var normalizeReference = __webpack_require__(54);

	var normalizeURI = common.normalizeURI;
	var unescapeString = common.unescapeString;
	var fromCodePoint = __webpack_require__(55);
	var decodeHTML = __webpack_require__(45).decodeHTML;
	__webpack_require__(56); // Polyfill for String.prototype.repeat

	// Constants for character codes:

	var C_NEWLINE = 10;
	var C_ASTERISK = 42;
	var C_UNDERSCORE = 95;
	var C_BACKTICK = 96;
	var C_OPEN_BRACKET = 91;
	var C_CLOSE_BRACKET = 93;
	var C_LESSTHAN = 60;
	var C_BANG = 33;
	var C_BACKSLASH = 92;
	var C_AMPERSAND = 38;
	var C_OPEN_PAREN = 40;
	var C_CLOSE_PAREN = 41;
	var C_COLON = 58;
	var C_SINGLEQUOTE = 39;
	var C_DOUBLEQUOTE = 34;

	// Some regexps used in inline parser:

	var ESCAPABLE = common.ESCAPABLE;
	var ESCAPED_CHAR = '\\\\' + ESCAPABLE;
	var REG_CHAR = '[^\\\\()\\x00-\\x20]';
	var IN_PARENS_NOSP = '\\((' + REG_CHAR + '|' + ESCAPED_CHAR + '|\\\\)*\\)';

	var ENTITY = common.ENTITY;
	var reHtmlTag = common.reHtmlTag;

	var rePunctuation = new RegExp(/^[\u2000-\u206F\u2E00-\u2E7F\\'!"#\$%&\(\)\*\+,\-\.\/:;<=>\?@\[\]\^_`\{\|\}~]/);

	var reLinkTitle = new RegExp('^(?:"(' + ESCAPED_CHAR + '|[^"\\x00])*"' + '|' + '\'(' + ESCAPED_CHAR + '|[^\'\\x00])*\'' + '|' + '\\((' + ESCAPED_CHAR + '|[^)\\x00])*\\))');

	var reLinkDestinationBraces = new RegExp('^(?:[<](?:[^ <>\\t\\n\\\\\\x00]' + '|' + ESCAPED_CHAR + '|' + '\\\\)*[>])');

	var reLinkDestination = new RegExp('^(?:' + REG_CHAR + '+|' + ESCAPED_CHAR + '|\\\\|' + IN_PARENS_NOSP + ')*');

	var reEscapable = new RegExp('^' + ESCAPABLE);

	var reEntityHere = new RegExp('^' + ENTITY, 'i');

	var reTicks = /`+/;

	var reTicksHere = /^`+/;

	var reEllipses = /\.\.\./g;

	var reDash = /--+/g;

	var reEmailAutolink = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;

	var reAutolink = /^<[A-Za-z][A-Za-z0-9.+-]{1,31}:[^<>\x00-\x20]*>/i;

	var reSpnl = /^ *(?:\n *)?/;

	var reWhitespaceChar = /^\s/;

	var reWhitespace = /\s+/g;

	var reFinalSpace = / *$/;

	var reInitialSpace = /^ */;

	var reSpaceAtEndOfLine = /^ *(?:\n|$)/;

	var reLinkLabel = new RegExp('^\\[(?:[^\\\\\\[\\]]|' + ESCAPED_CHAR + '|\\\\){0,1000}\\]');

	// Matches a string of non-special characters.
	var reMain = /^[^\n`\[\]\\!<&*_'"]+/m;

	var text = function text(s) {
	    var node = new Node('Text');
	    node._literal = s;
	    return node;
	};

	// INLINE PARSER

	// These are methods of an InlineParser object, defined below.
	// An InlineParser keeps track of a subject (a string to be
	// parsed) and a position in that subject.

	// If re matches at current position in the subject, advance
	// position in subject and return the match; otherwise return null.
	var match = function match(re) {
	    var m = re.exec(this.subject.slice(this.pos));
	    if (m === null) {
	        return null;
	    } else {
	        this.pos += m.index + m[0].length;
	        return m[0];
	    }
	};

	// Returns the code for the character at the current subject position, or -1
	// there are no more characters.
	var peek = function peek() {
	    if (this.pos < this.subject.length) {
	        return this.subject.charCodeAt(this.pos);
	    } else {
	        return -1;
	    }
	};

	// Parse zero or more space characters, including at most one newline
	var spnl = function spnl() {
	    this.match(reSpnl);
	    return true;
	};

	// All of the parsers below try to match something at the current position
	// in the subject.  If they succeed in matching anything, they
	// return the inline matched, advancing the subject.

	// Attempt to parse backticks, adding either a backtick code span or a
	// literal sequence of backticks.
	var parseBackticks = function parseBackticks(block) {
	    var ticks = this.match(reTicksHere);
	    if (ticks === null) {
	        return false;
	    }
	    var afterOpenTicks = this.pos;
	    var matched;
	    var node;
	    while ((matched = this.match(reTicks)) !== null) {
	        if (matched === ticks) {
	            node = new Node('Code');
	            node._literal = this.subject.slice(afterOpenTicks, this.pos - ticks.length).trim().replace(reWhitespace, ' ');
	            block.appendChild(node);
	            return true;
	        }
	    }
	    // If we got here, we didn't match a closing backtick sequence.
	    this.pos = afterOpenTicks;
	    block.appendChild(text(ticks));
	    return true;
	};

	// Parse a backslash-escaped special character, adding either the escaped
	// character, a hard line break (if the backslash is followed by a newline),
	// or a literal backslash to the block's children.  Assumes current character
	// is a backslash.
	var parseBackslash = function parseBackslash(block) {
	    var subj = this.subject;
	    var node;
	    this.pos += 1;
	    if (this.peek() === C_NEWLINE) {
	        this.pos += 1;
	        node = new Node('Hardbreak');
	        block.appendChild(node);
	    } else if (reEscapable.test(subj.charAt(this.pos))) {
	        block.appendChild(text(subj.charAt(this.pos)));
	        this.pos += 1;
	    } else {
	        block.appendChild(text('\\'));
	    }
	    return true;
	};

	// Attempt to parse an autolink (URL or email in pointy brackets).
	var parseAutolink = function parseAutolink(block) {
	    var m;
	    var dest;
	    var node;
	    if (m = this.match(reEmailAutolink)) {
	        dest = m.slice(1, m.length - 1);
	        node = new Node('Link');
	        node._destination = normalizeURI('mailto:' + dest);
	        node._title = '';
	        node.appendChild(text(dest));
	        block.appendChild(node);
	        return true;
	    } else if (m = this.match(reAutolink)) {
	        dest = m.slice(1, m.length - 1);
	        node = new Node('Link');
	        node._destination = normalizeURI(dest);
	        node._title = '';
	        node.appendChild(text(dest));
	        block.appendChild(node);
	        return true;
	    } else {
	        return false;
	    }
	};

	// Attempt to parse a raw HTML tag.
	var parseHtmlTag = function parseHtmlTag(block) {
	    var m = this.match(reHtmlTag);
	    if (m === null) {
	        return false;
	    } else {
	        var node = new Node('HtmlInline');
	        node._literal = m;
	        block.appendChild(node);
	        return true;
	    }
	};

	// Scan a sequence of characters with code cc, and return information about
	// the number of delimiters and whether they are positioned such that
	// they can open and/or close emphasis or strong emphasis.  A utility
	// function for strong/emph parsing.
	var scanDelims = function scanDelims(cc) {
	    var numdelims = 0;
	    var char_before, char_after, cc_after;
	    var startpos = this.pos;
	    var left_flanking, right_flanking, can_open, can_close;
	    var after_is_whitespace, after_is_punctuation, before_is_whitespace, before_is_punctuation;

	    if (cc === C_SINGLEQUOTE || cc === C_DOUBLEQUOTE) {
	        numdelims++;
	        this.pos++;
	    } else {
	        while (this.peek() === cc) {
	            numdelims++;
	            this.pos++;
	        }
	    }

	    if (numdelims === 0) {
	        return null;
	    }

	    char_before = startpos === 0 ? '\n' : this.subject.charAt(startpos - 1);

	    cc_after = this.peek();
	    if (cc_after === -1) {
	        char_after = '\n';
	    } else {
	        char_after = fromCodePoint(cc_after);
	    }

	    after_is_whitespace = reWhitespaceChar.test(char_after);
	    after_is_punctuation = rePunctuation.test(char_after);
	    before_is_whitespace = reWhitespaceChar.test(char_before);
	    before_is_punctuation = rePunctuation.test(char_before);

	    left_flanking = !after_is_whitespace && !(after_is_punctuation && !before_is_whitespace && !before_is_punctuation);
	    right_flanking = !before_is_whitespace && !(before_is_punctuation && !after_is_whitespace && !after_is_punctuation);
	    if (cc === C_UNDERSCORE) {
	        can_open = left_flanking && (!right_flanking || before_is_punctuation);
	        can_close = right_flanking && (!left_flanking || after_is_punctuation);
	    } else if (cc === C_SINGLEQUOTE || cc === C_DOUBLEQUOTE) {
	        can_open = left_flanking && !right_flanking;
	        can_close = right_flanking;
	    } else {
	        can_open = left_flanking;
	        can_close = right_flanking;
	    }
	    this.pos = startpos;
	    return { numdelims: numdelims,
	        can_open: can_open,
	        can_close: can_close };
	};

	// Handle a delimiter marker for emphasis or a quote.
	var handleDelim = function handleDelim(cc, block) {
	    var res = this.scanDelims(cc);
	    if (!res) {
	        return false;
	    }
	    var numdelims = res.numdelims;
	    var startpos = this.pos;
	    var contents;

	    this.pos += numdelims;
	    if (cc === C_SINGLEQUOTE) {
	        contents = '’';
	    } else if (cc === C_DOUBLEQUOTE) {
	        contents = '“';
	    } else {
	        contents = this.subject.slice(startpos, this.pos);
	    }
	    var node = text(contents);
	    block.appendChild(node);

	    // Add entry to stack for this opener
	    this.delimiters = { cc: cc,
	        numdelims: numdelims,
	        node: node,
	        previous: this.delimiters,
	        next: null,
	        can_open: res.can_open,
	        can_close: res.can_close,
	        active: true };
	    if (this.delimiters.previous !== null) {
	        this.delimiters.previous.next = this.delimiters;
	    }

	    return true;
	};

	var removeDelimiter = function removeDelimiter(delim) {
	    if (delim.previous !== null) {
	        delim.previous.next = delim.next;
	    }
	    if (delim.next === null) {
	        // top of stack
	        this.delimiters = delim.previous;
	    } else {
	        delim.next.previous = delim.previous;
	    }
	};

	var removeDelimitersBetween = function removeDelimitersBetween(bottom, top) {
	    if (bottom.next !== top) {
	        bottom.next = top;
	        top.previous = bottom;
	    }
	};

	var processEmphasis = function processEmphasis(stack_bottom) {
	    var opener, closer, old_closer;
	    var opener_inl, closer_inl;
	    var tempstack;
	    var use_delims;
	    var tmp, next;
	    var opener_found;
	    var openers_bottom = [];

	    openers_bottom[C_UNDERSCORE] = stack_bottom;
	    openers_bottom[C_ASTERISK] = stack_bottom;
	    openers_bottom[C_SINGLEQUOTE] = stack_bottom;
	    openers_bottom[C_DOUBLEQUOTE] = stack_bottom;

	    // find first closer above stack_bottom:
	    closer = this.delimiters;
	    while (closer !== null && closer.previous !== stack_bottom) {
	        closer = closer.previous;
	    }
	    // move forward, looking for closers, and handling each
	    while (closer !== null) {
	        var closercc = closer.cc;
	        if (!(closer.can_close && (closercc === C_UNDERSCORE || closercc === C_ASTERISK || closercc === C_SINGLEQUOTE || closercc === C_DOUBLEQUOTE))) {
	            closer = closer.next;
	        } else {
	            // found emphasis closer. now look back for first matching opener:
	            opener = closer.previous;
	            opener_found = false;
	            while (opener !== null && opener !== stack_bottom && opener !== openers_bottom[closercc]) {
	                if (opener.cc === closer.cc && opener.can_open) {
	                    opener_found = true;
	                    break;
	                }
	                opener = opener.previous;
	            }
	            old_closer = closer;

	            if (closercc === C_ASTERISK || closercc === C_UNDERSCORE) {
	                if (!opener_found) {
	                    closer = closer.next;
	                } else {
	                    // calculate actual number of delimiters used from closer
	                    if (closer.numdelims < 3 || opener.numdelims < 3) {
	                        use_delims = closer.numdelims <= opener.numdelims ? closer.numdelims : opener.numdelims;
	                    } else {
	                        use_delims = closer.numdelims % 2 === 0 ? 2 : 1;
	                    }

	                    opener_inl = opener.node;
	                    closer_inl = closer.node;

	                    // remove used delimiters from stack elts and inlines
	                    opener.numdelims -= use_delims;
	                    closer.numdelims -= use_delims;
	                    opener_inl._literal = opener_inl._literal.slice(0, opener_inl._literal.length - use_delims);
	                    closer_inl._literal = closer_inl._literal.slice(0, closer_inl._literal.length - use_delims);

	                    // build contents for new emph element
	                    var emph = new Node(use_delims === 1 ? 'Emph' : 'Strong');

	                    tmp = opener_inl._next;
	                    while (tmp && tmp !== closer_inl) {
	                        next = tmp._next;
	                        tmp.unlink();
	                        emph.appendChild(tmp);
	                        tmp = next;
	                    }

	                    opener_inl.insertAfter(emph);

	                    // remove elts between opener and closer in delimiters stack
	                    removeDelimitersBetween(opener, closer);

	                    // if opener has 0 delims, remove it and the inline
	                    if (opener.numdelims === 0) {
	                        opener_inl.unlink();
	                        this.removeDelimiter(opener);
	                    }

	                    if (closer.numdelims === 0) {
	                        closer_inl.unlink();
	                        tempstack = closer.next;
	                        this.removeDelimiter(closer);
	                        closer = tempstack;
	                    }
	                }
	            } else if (closercc === C_SINGLEQUOTE) {
	                closer.node._literal = '’';
	                if (opener_found) {
	                    opener.node._literal = '‘';
	                }
	                closer = closer.next;
	            } else if (closercc === C_DOUBLEQUOTE) {
	                closer.node._literal = '”';
	                if (opener_found) {
	                    opener.node.literal = '“';
	                }
	                closer = closer.next;
	            }
	            if (!opener_found) {
	                // Set lower bound for future searches for openers:
	                openers_bottom[closercc] = old_closer.previous;
	                if (!old_closer.can_open) {
	                    // We can remove a closer that can't be an opener,
	                    // once we've seen there's no matching opener:
	                    this.removeDelimiter(old_closer);
	                }
	            }
	        }
	    }

	    // remove all delimiters
	    while (this.delimiters !== null && this.delimiters !== stack_bottom) {
	        this.removeDelimiter(this.delimiters);
	    }
	};

	// Attempt to parse link title (sans quotes), returning the string
	// or null if no match.
	var parseLinkTitle = function parseLinkTitle() {
	    var title = this.match(reLinkTitle);
	    if (title === null) {
	        return null;
	    } else {
	        // chop off quotes from title and unescape:
	        return unescapeString(title.substr(1, title.length - 2));
	    }
	};

	// Attempt to parse link destination, returning the string or
	// null if no match.
	var parseLinkDestination = function parseLinkDestination() {
	    var res = this.match(reLinkDestinationBraces);
	    if (res === null) {
	        res = this.match(reLinkDestination);
	        if (res === null) {
	            return null;
	        } else {
	            return normalizeURI(unescapeString(res));
	        }
	    } else {
	        // chop off surrounding <..>:
	        return normalizeURI(unescapeString(res.substr(1, res.length - 2)));
	    }
	};

	// Attempt to parse a link label, returning number of characters parsed.
	var parseLinkLabel = function parseLinkLabel() {
	    var m = this.match(reLinkLabel);
	    if (m === null || m.length > 1001) {
	        return 0;
	    } else {
	        return m.length;
	    }
	};

	// Add open bracket to delimiter stack and add a text node to block's children.
	var parseOpenBracket = function parseOpenBracket(block) {
	    var startpos = this.pos;
	    this.pos += 1;

	    var node = text('[');
	    block.appendChild(node);

	    // Add entry to stack for this opener
	    this.delimiters = { cc: C_OPEN_BRACKET,
	        numdelims: 1,
	        node: node,
	        previous: this.delimiters,
	        next: null,
	        can_open: true,
	        can_close: false,
	        index: startpos,
	        active: true };
	    if (this.delimiters.previous !== null) {
	        this.delimiters.previous.next = this.delimiters;
	    }

	    return true;
	};

	// IF next character is [, and ! delimiter to delimiter stack and
	// add a text node to block's children.  Otherwise just add a text node.
	var parseBang = function parseBang(block) {
	    var startpos = this.pos;
	    this.pos += 1;
	    if (this.peek() === C_OPEN_BRACKET) {
	        this.pos += 1;

	        var node = text('![');
	        block.appendChild(node);

	        // Add entry to stack for this opener
	        this.delimiters = { cc: C_BANG,
	            numdelims: 1,
	            node: node,
	            previous: this.delimiters,
	            next: null,
	            can_open: true,
	            can_close: false,
	            index: startpos + 1,
	            active: true };
	        if (this.delimiters.previous !== null) {
	            this.delimiters.previous.next = this.delimiters;
	        }
	    } else {
	        block.appendChild(text('!'));
	    }
	    return true;
	};

	// Try to match close bracket against an opening in the delimiter
	// stack.  Add either a link or image, or a plain [ character,
	// to block's children.  If there is a matching delimiter,
	// remove it from the delimiter stack.
	var parseCloseBracket = function parseCloseBracket(block) {
	    var startpos;
	    var is_image;
	    var dest;
	    var title;
	    var matched = false;
	    var reflabel;
	    var opener;

	    this.pos += 1;
	    startpos = this.pos;

	    // look through stack of delimiters for a [ or ![
	    opener = this.delimiters;

	    while (opener !== null) {
	        if (opener.cc === C_OPEN_BRACKET || opener.cc === C_BANG) {
	            break;
	        }
	        opener = opener.previous;
	    }

	    if (opener === null) {
	        // no matched opener, just return a literal
	        block.appendChild(text(']'));
	        return true;
	    }

	    if (!opener.active) {
	        // no matched opener, just return a literal
	        block.appendChild(text(']'));
	        // take opener off emphasis stack
	        this.removeDelimiter(opener);
	        return true;
	    }

	    // If we got here, open is a potential opener
	    is_image = opener.cc === C_BANG;

	    // Check to see if we have a link/image

	    // Inline link?
	    if (this.peek() === C_OPEN_PAREN) {
	        this.pos++;
	        if (this.spnl() && (dest = this.parseLinkDestination()) !== null && this.spnl() && (
	        // make sure there's a space before the title:
	        reWhitespaceChar.test(this.subject.charAt(this.pos - 1)) && (title = this.parseLinkTitle()) || true) && this.spnl() && this.peek() === C_CLOSE_PAREN) {
	            this.pos += 1;
	            matched = true;
	        }
	    } else {

	        // Next, see if there's a link label
	        var savepos = this.pos;
	        var beforelabel = this.pos;
	        var n = this.parseLinkLabel();
	        if (n === 0 || n === 2) {
	            // empty or missing second label
	            reflabel = this.subject.slice(opener.index, startpos);
	        } else {
	            reflabel = this.subject.slice(beforelabel, beforelabel + n);
	        }
	        if (n === 0) {
	            // If shortcut reference link, rewind before spaces we skipped.
	            this.pos = savepos;
	        }

	        // lookup rawlabel in refmap
	        var link = this.refmap[normalizeReference(reflabel)];
	        if (link) {
	            dest = link.destination;
	            title = link.title;
	            matched = true;
	        }
	    }

	    if (matched) {
	        var node = new Node(is_image ? 'Image' : 'Link');
	        node._destination = dest;
	        node._title = title || '';

	        var tmp, next;
	        tmp = opener.node._next;
	        while (tmp) {
	            next = tmp._next;
	            tmp.unlink();
	            node.appendChild(tmp);
	            tmp = next;
	        }
	        block.appendChild(node);
	        this.processEmphasis(opener.previous);

	        opener.node.unlink();

	        // processEmphasis will remove this and later delimiters.
	        // Now, for a link, we also deactivate earlier link openers.
	        // (no links in links)
	        if (!is_image) {
	            opener = this.delimiters;
	            while (opener !== null) {
	                if (opener.cc === C_OPEN_BRACKET) {
	                    opener.active = false; // deactivate this opener
	                }
	                opener = opener.previous;
	            }
	        }

	        return true;
	    } else {
	        // no match

	        this.removeDelimiter(opener); // remove this opener from stack
	        this.pos = startpos;
	        block.appendChild(text(']'));
	        return true;
	    }
	};

	// Attempt to parse an entity.
	var parseEntity = function parseEntity(block) {
	    var m;
	    if (m = this.match(reEntityHere)) {
	        block.appendChild(text(decodeHTML(m)));
	        return true;
	    } else {
	        return false;
	    }
	};

	// Parse a run of ordinary characters, or a single character with
	// a special meaning in markdown, as a plain string.
	var parseString = function parseString(block) {
	    var m;
	    if (m = this.match(reMain)) {
	        if (this.options.smart) {
	            block.appendChild(text(m.replace(reEllipses, '…').replace(reDash, function (chars) {
	                var enCount = 0;
	                var emCount = 0;
	                if (chars.length % 3 === 0) {
	                    // If divisible by 3, use all em dashes
	                    emCount = chars.length / 3;
	                } else if (chars.length % 2 === 0) {
	                    // If divisible by 2, use all en dashes
	                    enCount = chars.length / 2;
	                } else if (chars.length % 3 === 2) {
	                    // If 2 extra dashes, use en dash for last 2; em dashes for rest
	                    enCount = 1;
	                    emCount = (chars.length - 2) / 3;
	                } else {
	                    // Use en dashes for last 4 hyphens; em dashes for rest
	                    enCount = 2;
	                    emCount = (chars.length - 4) / 3;
	                }
	                return '—'.repeat(emCount) + '–'.repeat(enCount);
	            })));
	        } else {
	            block.appendChild(text(m));
	        }
	        return true;
	    } else {
	        return false;
	    }
	};

	// Parse a newline.  If it was preceded by two spaces, return a hard
	// line break; otherwise a soft line break.
	var parseNewline = function parseNewline(block) {
	    this.pos += 1; // assume we're at a \n
	    // check previous node for trailing spaces
	    var lastc = block._lastChild;
	    if (lastc && lastc.type === 'Text' && lastc._literal[lastc._literal.length - 1] === ' ') {
	        var hardbreak = lastc._literal[lastc._literal.length - 2] === ' ';
	        lastc._literal = lastc._literal.replace(reFinalSpace, '');
	        block.appendChild(new Node(hardbreak ? 'Hardbreak' : 'Softbreak'));
	    } else {
	        block.appendChild(new Node('Softbreak'));
	    }
	    this.match(reInitialSpace); // gobble leading spaces in next line
	    return true;
	};

	// Attempt to parse a link reference, modifying refmap.
	var parseReference = function parseReference(s, refmap) {
	    this.subject = s;
	    this.pos = 0;
	    var rawlabel;
	    var dest;
	    var title;
	    var matchChars;
	    var startpos = this.pos;

	    // label:
	    matchChars = this.parseLinkLabel();
	    if (matchChars === 0) {
	        return 0;
	    } else {
	        rawlabel = this.subject.substr(0, matchChars);
	    }

	    // colon:
	    if (this.peek() === C_COLON) {
	        this.pos++;
	    } else {
	        this.pos = startpos;
	        return 0;
	    }

	    //  link url
	    this.spnl();

	    dest = this.parseLinkDestination();
	    if (dest === null || dest.length === 0) {
	        this.pos = startpos;
	        return 0;
	    }

	    var beforetitle = this.pos;
	    this.spnl();
	    title = this.parseLinkTitle();
	    if (title === null) {
	        title = '';
	        // rewind before spaces
	        this.pos = beforetitle;
	    }

	    // make sure we're at line end:
	    var atLineEnd = true;
	    if (this.match(reSpaceAtEndOfLine) === null) {
	        if (title === '') {
	            atLineEnd = false;
	        } else {
	            // the potential title we found is not at the line end,
	            // but it could still be a legal link reference if we
	            // discard the title
	            title = '';
	            // rewind before spaces
	            this.pos = beforetitle;
	            // and instead check if the link URL is at the line end
	            atLineEnd = this.match(reSpaceAtEndOfLine) !== null;
	        }
	    }

	    if (!atLineEnd) {
	        this.pos = startpos;
	        return 0;
	    }

	    var normlabel = normalizeReference(rawlabel);
	    if (normlabel === '') {
	        // label must contain non-whitespace characters
	        this.pos = startpos;
	        return 0;
	    }

	    if (!refmap[normlabel]) {
	        refmap[normlabel] = { destination: dest, title: title };
	    }
	    return this.pos - startpos;
	};

	// Parse the next inline element in subject, advancing subject position.
	// On success, add the result to block's children and return true.
	// On failure, return false.
	var parseInline = function parseInline(block) {
	    var res = false;
	    var c = this.peek();
	    if (c === -1) {
	        return false;
	    }
	    switch (c) {
	        case C_NEWLINE:
	            res = this.parseNewline(block);
	            break;
	        case C_BACKSLASH:
	            res = this.parseBackslash(block);
	            break;
	        case C_BACKTICK:
	            res = this.parseBackticks(block);
	            break;
	        case C_ASTERISK:
	        case C_UNDERSCORE:
	            res = this.handleDelim(c, block);
	            break;
	        case C_SINGLEQUOTE:
	        case C_DOUBLEQUOTE:
	            res = this.options.smart && this.handleDelim(c, block);
	            break;
	        case C_OPEN_BRACKET:
	            res = this.parseOpenBracket(block);
	            break;
	        case C_BANG:
	            res = this.parseBang(block);
	            break;
	        case C_CLOSE_BRACKET:
	            res = this.parseCloseBracket(block);
	            break;
	        case C_LESSTHAN:
	            res = this.parseAutolink(block) || this.parseHtmlTag(block);
	            break;
	        case C_AMPERSAND:
	            res = this.parseEntity(block);
	            break;
	        default:
	            res = this.parseString(block);
	            break;
	    }
	    if (!res) {
	        this.pos += 1;
	        block.appendChild(text(fromCodePoint(c)));
	    }

	    return true;
	};

	// Parse string content in block into inline children,
	// using refmap to resolve references.
	var parseInlines = function parseInlines(block) {
	    this.subject = block._string_content.trim();
	    this.pos = 0;
	    this.delimiters = null;
	    while (this.parseInline(block)) {}
	    block._string_content = null; // allow raw string to be garbage collected
	    this.processEmphasis(null);
	};

	// The InlineParser object.
	function InlineParser(options) {
	    return {
	        subject: '',
	        delimiters: null, // used by handleDelim method
	        pos: 0,
	        refmap: {},
	        match: match,
	        peek: peek,
	        spnl: spnl,
	        parseBackticks: parseBackticks,
	        parseBackslash: parseBackslash,
	        parseAutolink: parseAutolink,
	        parseHtmlTag: parseHtmlTag,
	        scanDelims: scanDelims,
	        handleDelim: handleDelim,
	        parseLinkTitle: parseLinkTitle,
	        parseLinkDestination: parseLinkDestination,
	        parseLinkLabel: parseLinkLabel,
	        parseOpenBracket: parseOpenBracket,
	        parseCloseBracket: parseCloseBracket,
	        parseBang: parseBang,
	        parseEntity: parseEntity,
	        parseString: parseString,
	        parseNewline: parseNewline,
	        parseReference: parseReference,
	        parseInline: parseInline,
	        processEmphasis: processEmphasis,
	        removeDelimiter: removeDelimiter,
	        options: options || {},
	        parse: parseInlines
	    };
	}

	module.exports = InlineParser;

/***/ },
/* 54 */
/***/ function(module, exports) {

	"use strict";

	/* The bulk of this code derives from https://github.com/dmoscrop/fold-case
	But in addition to case-folding, we also normalize whitespace.

	fold-case is Copyright Mathias Bynens <https://mathiasbynens.be/>

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/

	/*eslint-disable  key-spacing, comma-spacing */

	var regex = /[ \t\r\n]+|[A-Z\xB5\xC0-\xD6\xD8-\xDF\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u0149\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u017F\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C5\u01C7\u01C8\u01CA\u01CB\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F0-\u01F2\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0345\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03AB\u03B0\u03C2\u03CF-\u03D1\u03D5\u03D6\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F0\u03F1\u03F4\u03F5\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u0587\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E96-\u1E9B\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F50\u1F52\u1F54\u1F56\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1F80-\u1FAF\u1FB2-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD2\u1FD3\u1FD6-\u1FDB\u1FE2-\u1FE4\u1FE6-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2126\u212A\u212B\u2132\u2160-\u216F\u2183\u24B6-\u24CF\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0\uA7B1\uFB00-\uFB06\uFB13-\uFB17\uFF21-\uFF3A]|\uD801[\uDC00-\uDC27]|\uD806[\uDCA0-\uDCBF]/g;

	var map = { 'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd', 'E': 'e', 'F': 'f', 'G': 'g', 'H': 'h', 'I': 'i', 'J': 'j', 'K': 'k', 'L': 'l', 'M': 'm', 'N': 'n', 'O': 'o', 'P': 'p', 'Q': 'q', 'R': 'r', 'S': 's', 'T': 't', 'U': 'u', 'V': 'v', 'W': 'w', 'X': 'x', 'Y': 'y', 'Z': 'z', '\xB5': 'μ', '\xC0': '\xE0', '\xC1': '\xE1', '\xC2': '\xE2', '\xC3': '\xE3', '\xC4': '\xE4', '\xC5': '\xE5', '\xC6': '\xE6', '\xC7': '\xE7', '\xC8': '\xE8', '\xC9': '\xE9', '\xCA': '\xEA', '\xCB': '\xEB', '\xCC': '\xEC', '\xCD': '\xED', '\xCE': '\xEE', '\xCF': '\xEF', '\xD0': '\xF0', '\xD1': '\xF1', '\xD2': '\xF2', '\xD3': '\xF3', '\xD4': '\xF4', '\xD5': '\xF5', '\xD6': '\xF6', '\xD8': '\xF8', '\xD9': '\xF9', '\xDA': '\xFA', '\xDB': '\xFB', '\xDC': '\xFC', '\xDD': '\xFD', '\xDE': '\xFE', 'Ā': 'ā', 'Ă': 'ă', 'Ą': 'ą', 'Ć': 'ć', 'Ĉ': 'ĉ', 'Ċ': 'ċ', 'Č': 'č', 'Ď': 'ď', 'Đ': 'đ', 'Ē': 'ē', 'Ĕ': 'ĕ', 'Ė': 'ė', 'Ę': 'ę', 'Ě': 'ě', 'Ĝ': 'ĝ', 'Ğ': 'ğ', 'Ġ': 'ġ', 'Ģ': 'ģ', 'Ĥ': 'ĥ', 'Ħ': 'ħ', 'Ĩ': 'ĩ', 'Ī': 'ī', 'Ĭ': 'ĭ', 'Į': 'į', 'Ĳ': 'ĳ', 'Ĵ': 'ĵ', 'Ķ': 'ķ', 'Ĺ': 'ĺ', 'Ļ': 'ļ', 'Ľ': 'ľ', 'Ŀ': 'ŀ', 'Ł': 'ł', 'Ń': 'ń', 'Ņ': 'ņ', 'Ň': 'ň', 'Ŋ': 'ŋ', 'Ō': 'ō', 'Ŏ': 'ŏ', 'Ő': 'ő', 'Œ': 'œ', 'Ŕ': 'ŕ', 'Ŗ': 'ŗ', 'Ř': 'ř', 'Ś': 'ś', 'Ŝ': 'ŝ', 'Ş': 'ş', 'Š': 'š', 'Ţ': 'ţ', 'Ť': 'ť', 'Ŧ': 'ŧ', 'Ũ': 'ũ', 'Ū': 'ū', 'Ŭ': 'ŭ', 'Ů': 'ů', 'Ű': 'ű', 'Ų': 'ų', 'Ŵ': 'ŵ', 'Ŷ': 'ŷ', 'Ÿ': '\xFF', 'Ź': 'ź', 'Ż': 'ż', 'Ž': 'ž', 'ſ': 's', 'Ɓ': 'ɓ', 'Ƃ': 'ƃ', 'Ƅ': 'ƅ', 'Ɔ': 'ɔ', 'Ƈ': 'ƈ', 'Ɖ': 'ɖ', 'Ɗ': 'ɗ', 'Ƌ': 'ƌ', 'Ǝ': 'ǝ', 'Ə': 'ə', 'Ɛ': 'ɛ', 'Ƒ': 'ƒ', 'Ɠ': 'ɠ', 'Ɣ': 'ɣ', 'Ɩ': 'ɩ', 'Ɨ': 'ɨ', 'Ƙ': 'ƙ', 'Ɯ': 'ɯ', 'Ɲ': 'ɲ', 'Ɵ': 'ɵ', 'Ơ': 'ơ', 'Ƣ': 'ƣ', 'Ƥ': 'ƥ', 'Ʀ': 'ʀ', 'Ƨ': 'ƨ', 'Ʃ': 'ʃ', 'Ƭ': 'ƭ', 'Ʈ': 'ʈ', 'Ư': 'ư', 'Ʊ': 'ʊ', 'Ʋ': 'ʋ', 'Ƴ': 'ƴ', 'Ƶ': 'ƶ', 'Ʒ': 'ʒ', 'Ƹ': 'ƹ', 'Ƽ': 'ƽ', 'Ǆ': 'ǆ', 'ǅ': 'ǆ', 'Ǉ': 'ǉ', 'ǈ': 'ǉ', 'Ǌ': 'ǌ', 'ǋ': 'ǌ', 'Ǎ': 'ǎ', 'Ǐ': 'ǐ', 'Ǒ': 'ǒ', 'Ǔ': 'ǔ', 'Ǖ': 'ǖ', 'Ǘ': 'ǘ', 'Ǚ': 'ǚ', 'Ǜ': 'ǜ', 'Ǟ': 'ǟ', 'Ǡ': 'ǡ', 'Ǣ': 'ǣ', 'Ǥ': 'ǥ', 'Ǧ': 'ǧ', 'Ǩ': 'ǩ', 'Ǫ': 'ǫ', 'Ǭ': 'ǭ', 'Ǯ': 'ǯ', 'Ǳ': 'ǳ', 'ǲ': 'ǳ', 'Ǵ': 'ǵ', 'Ƕ': 'ƕ', 'Ƿ': 'ƿ', 'Ǹ': 'ǹ', 'Ǻ': 'ǻ', 'Ǽ': 'ǽ', 'Ǿ': 'ǿ', 'Ȁ': 'ȁ', 'Ȃ': 'ȃ', 'Ȅ': 'ȅ', 'Ȇ': 'ȇ', 'Ȉ': 'ȉ', 'Ȋ': 'ȋ', 'Ȍ': 'ȍ', 'Ȏ': 'ȏ', 'Ȑ': 'ȑ', 'Ȓ': 'ȓ', 'Ȕ': 'ȕ', 'Ȗ': 'ȗ', 'Ș': 'ș', 'Ț': 'ț', 'Ȝ': 'ȝ', 'Ȟ': 'ȟ', 'Ƞ': 'ƞ', 'Ȣ': 'ȣ', 'Ȥ': 'ȥ', 'Ȧ': 'ȧ', 'Ȩ': 'ȩ', 'Ȫ': 'ȫ', 'Ȭ': 'ȭ', 'Ȯ': 'ȯ', 'Ȱ': 'ȱ', 'Ȳ': 'ȳ', 'Ⱥ': 'ⱥ', 'Ȼ': 'ȼ', 'Ƚ': 'ƚ', 'Ⱦ': 'ⱦ', 'Ɂ': 'ɂ', 'Ƀ': 'ƀ', 'Ʉ': 'ʉ', 'Ʌ': 'ʌ', 'Ɇ': 'ɇ', 'Ɉ': 'ɉ', 'Ɋ': 'ɋ', 'Ɍ': 'ɍ', 'Ɏ': 'ɏ', 'ͅ': 'ι', 'Ͱ': 'ͱ', 'Ͳ': 'ͳ', 'Ͷ': 'ͷ', 'Ϳ': 'ϳ', 'Ά': 'ά', 'Έ': 'έ', 'Ή': 'ή', 'Ί': 'ί', 'Ό': 'ό', 'Ύ': 'ύ', 'Ώ': 'ώ', 'Α': 'α', 'Β': 'β', 'Γ': 'γ', 'Δ': 'δ', 'Ε': 'ε', 'Ζ': 'ζ', 'Η': 'η', 'Θ': 'θ', 'Ι': 'ι', 'Κ': 'κ', 'Λ': 'λ', 'Μ': 'μ', 'Ν': 'ν', 'Ξ': 'ξ', 'Ο': 'ο', 'Π': 'π', 'Ρ': 'ρ', 'Σ': 'σ', 'Τ': 'τ', 'Υ': 'υ', 'Φ': 'φ', 'Χ': 'χ', 'Ψ': 'ψ', 'Ω': 'ω', 'Ϊ': 'ϊ', 'Ϋ': 'ϋ', 'ς': 'σ', 'Ϗ': 'ϗ', 'ϐ': 'β', 'ϑ': 'θ', 'ϕ': 'φ', 'ϖ': 'π', 'Ϙ': 'ϙ', 'Ϛ': 'ϛ', 'Ϝ': 'ϝ', 'Ϟ': 'ϟ', 'Ϡ': 'ϡ', 'Ϣ': 'ϣ', 'Ϥ': 'ϥ', 'Ϧ': 'ϧ', 'Ϩ': 'ϩ', 'Ϫ': 'ϫ', 'Ϭ': 'ϭ', 'Ϯ': 'ϯ', 'ϰ': 'κ', 'ϱ': 'ρ', 'ϴ': 'θ', 'ϵ': 'ε', 'Ϸ': 'ϸ', 'Ϲ': 'ϲ', 'Ϻ': 'ϻ', 'Ͻ': 'ͻ', 'Ͼ': 'ͼ', 'Ͽ': 'ͽ', 'Ѐ': 'ѐ', 'Ё': 'ё', 'Ђ': 'ђ', 'Ѓ': 'ѓ', 'Є': 'є', 'Ѕ': 'ѕ', 'І': 'і', 'Ї': 'ї', 'Ј': 'ј', 'Љ': 'љ', 'Њ': 'њ', 'Ћ': 'ћ', 'Ќ': 'ќ', 'Ѝ': 'ѝ', 'Ў': 'ў', 'Џ': 'џ', 'А': 'а', 'Б': 'б', 'В': 'в', 'Г': 'г', 'Д': 'д', 'Е': 'е', 'Ж': 'ж', 'З': 'з', 'И': 'и', 'Й': 'й', 'К': 'к', 'Л': 'л', 'М': 'м', 'Н': 'н', 'О': 'о', 'П': 'п', 'Р': 'р', 'С': 'с', 'Т': 'т', 'У': 'у', 'Ф': 'ф', 'Х': 'х', 'Ц': 'ц', 'Ч': 'ч', 'Ш': 'ш', 'Щ': 'щ', 'Ъ': 'ъ', 'Ы': 'ы', 'Ь': 'ь', 'Э': 'э', 'Ю': 'ю', 'Я': 'я', 'Ѡ': 'ѡ', 'Ѣ': 'ѣ', 'Ѥ': 'ѥ', 'Ѧ': 'ѧ', 'Ѩ': 'ѩ', 'Ѫ': 'ѫ', 'Ѭ': 'ѭ', 'Ѯ': 'ѯ', 'Ѱ': 'ѱ', 'Ѳ': 'ѳ', 'Ѵ': 'ѵ', 'Ѷ': 'ѷ', 'Ѹ': 'ѹ', 'Ѻ': 'ѻ', 'Ѽ': 'ѽ', 'Ѿ': 'ѿ', 'Ҁ': 'ҁ', 'Ҋ': 'ҋ', 'Ҍ': 'ҍ', 'Ҏ': 'ҏ', 'Ґ': 'ґ', 'Ғ': 'ғ', 'Ҕ': 'ҕ', 'Җ': 'җ', 'Ҙ': 'ҙ', 'Қ': 'қ', 'Ҝ': 'ҝ', 'Ҟ': 'ҟ', 'Ҡ': 'ҡ', 'Ң': 'ң', 'Ҥ': 'ҥ', 'Ҧ': 'ҧ', 'Ҩ': 'ҩ', 'Ҫ': 'ҫ', 'Ҭ': 'ҭ', 'Ү': 'ү', 'Ұ': 'ұ', 'Ҳ': 'ҳ', 'Ҵ': 'ҵ', 'Ҷ': 'ҷ', 'Ҹ': 'ҹ', 'Һ': 'һ', 'Ҽ': 'ҽ', 'Ҿ': 'ҿ', 'Ӏ': 'ӏ', 'Ӂ': 'ӂ', 'Ӄ': 'ӄ', 'Ӆ': 'ӆ', 'Ӈ': 'ӈ', 'Ӊ': 'ӊ', 'Ӌ': 'ӌ', 'Ӎ': 'ӎ', 'Ӑ': 'ӑ', 'Ӓ': 'ӓ', 'Ӕ': 'ӕ', 'Ӗ': 'ӗ', 'Ә': 'ә', 'Ӛ': 'ӛ', 'Ӝ': 'ӝ', 'Ӟ': 'ӟ', 'Ӡ': 'ӡ', 'Ӣ': 'ӣ', 'Ӥ': 'ӥ', 'Ӧ': 'ӧ', 'Ө': 'ө', 'Ӫ': 'ӫ', 'Ӭ': 'ӭ', 'Ӯ': 'ӯ', 'Ӱ': 'ӱ', 'Ӳ': 'ӳ', 'Ӵ': 'ӵ', 'Ӷ': 'ӷ', 'Ӹ': 'ӹ', 'Ӻ': 'ӻ', 'Ӽ': 'ӽ', 'Ӿ': 'ӿ', 'Ԁ': 'ԁ', 'Ԃ': 'ԃ', 'Ԅ': 'ԅ', 'Ԇ': 'ԇ', 'Ԉ': 'ԉ', 'Ԋ': 'ԋ', 'Ԍ': 'ԍ', 'Ԏ': 'ԏ', 'Ԑ': 'ԑ', 'Ԓ': 'ԓ', 'Ԕ': 'ԕ', 'Ԗ': 'ԗ', 'Ԙ': 'ԙ', 'Ԛ': 'ԛ', 'Ԝ': 'ԝ', 'Ԟ': 'ԟ', 'Ԡ': 'ԡ', 'Ԣ': 'ԣ', 'Ԥ': 'ԥ', 'Ԧ': 'ԧ', 'Ԩ': 'ԩ', 'Ԫ': 'ԫ', 'Ԭ': 'ԭ', 'Ԯ': 'ԯ', 'Ա': 'ա', 'Բ': 'բ', 'Գ': 'գ', 'Դ': 'դ', 'Ե': 'ե', 'Զ': 'զ', 'Է': 'է', 'Ը': 'ը', 'Թ': 'թ', 'Ժ': 'ժ', 'Ի': 'ի', 'Լ': 'լ', 'Խ': 'խ', 'Ծ': 'ծ', 'Կ': 'կ', 'Հ': 'հ', 'Ձ': 'ձ', 'Ղ': 'ղ', 'Ճ': 'ճ', 'Մ': 'մ', 'Յ': 'յ', 'Ն': 'ն', 'Շ': 'շ', 'Ո': 'ո', 'Չ': 'չ', 'Պ': 'պ', 'Ջ': 'ջ', 'Ռ': 'ռ', 'Ս': 'ս', 'Վ': 'վ', 'Տ': 'տ', 'Ր': 'ր', 'Ց': 'ց', 'Ւ': 'ւ', 'Փ': 'փ', 'Ք': 'ք', 'Օ': 'օ', 'Ֆ': 'ֆ', 'Ⴀ': 'ⴀ', 'Ⴁ': 'ⴁ', 'Ⴂ': 'ⴂ', 'Ⴃ': 'ⴃ', 'Ⴄ': 'ⴄ', 'Ⴅ': 'ⴅ', 'Ⴆ': 'ⴆ', 'Ⴇ': 'ⴇ', 'Ⴈ': 'ⴈ', 'Ⴉ': 'ⴉ', 'Ⴊ': 'ⴊ', 'Ⴋ': 'ⴋ', 'Ⴌ': 'ⴌ', 'Ⴍ': 'ⴍ', 'Ⴎ': 'ⴎ', 'Ⴏ': 'ⴏ', 'Ⴐ': 'ⴐ', 'Ⴑ': 'ⴑ', 'Ⴒ': 'ⴒ', 'Ⴓ': 'ⴓ', 'Ⴔ': 'ⴔ', 'Ⴕ': 'ⴕ', 'Ⴖ': 'ⴖ', 'Ⴗ': 'ⴗ', 'Ⴘ': 'ⴘ', 'Ⴙ': 'ⴙ', 'Ⴚ': 'ⴚ', 'Ⴛ': 'ⴛ', 'Ⴜ': 'ⴜ', 'Ⴝ': 'ⴝ', 'Ⴞ': 'ⴞ', 'Ⴟ': 'ⴟ', 'Ⴠ': 'ⴠ', 'Ⴡ': 'ⴡ', 'Ⴢ': 'ⴢ', 'Ⴣ': 'ⴣ', 'Ⴤ': 'ⴤ', 'Ⴥ': 'ⴥ', 'Ⴧ': 'ⴧ', 'Ⴭ': 'ⴭ', 'Ḁ': 'ḁ', 'Ḃ': 'ḃ', 'Ḅ': 'ḅ', 'Ḇ': 'ḇ', 'Ḉ': 'ḉ', 'Ḋ': 'ḋ', 'Ḍ': 'ḍ', 'Ḏ': 'ḏ', 'Ḑ': 'ḑ', 'Ḓ': 'ḓ', 'Ḕ': 'ḕ', 'Ḗ': 'ḗ', 'Ḙ': 'ḙ', 'Ḛ': 'ḛ', 'Ḝ': 'ḝ', 'Ḟ': 'ḟ', 'Ḡ': 'ḡ', 'Ḣ': 'ḣ', 'Ḥ': 'ḥ', 'Ḧ': 'ḧ', 'Ḩ': 'ḩ', 'Ḫ': 'ḫ', 'Ḭ': 'ḭ', 'Ḯ': 'ḯ', 'Ḱ': 'ḱ', 'Ḳ': 'ḳ', 'Ḵ': 'ḵ', 'Ḷ': 'ḷ', 'Ḹ': 'ḹ', 'Ḻ': 'ḻ', 'Ḽ': 'ḽ', 'Ḿ': 'ḿ', 'Ṁ': 'ṁ', 'Ṃ': 'ṃ', 'Ṅ': 'ṅ', 'Ṇ': 'ṇ', 'Ṉ': 'ṉ', 'Ṋ': 'ṋ', 'Ṍ': 'ṍ', 'Ṏ': 'ṏ', 'Ṑ': 'ṑ', 'Ṓ': 'ṓ', 'Ṕ': 'ṕ', 'Ṗ': 'ṗ', 'Ṙ': 'ṙ', 'Ṛ': 'ṛ', 'Ṝ': 'ṝ', 'Ṟ': 'ṟ', 'Ṡ': 'ṡ', 'Ṣ': 'ṣ', 'Ṥ': 'ṥ', 'Ṧ': 'ṧ', 'Ṩ': 'ṩ', 'Ṫ': 'ṫ', 'Ṭ': 'ṭ', 'Ṯ': 'ṯ', 'Ṱ': 'ṱ', 'Ṳ': 'ṳ', 'Ṵ': 'ṵ', 'Ṷ': 'ṷ', 'Ṹ': 'ṹ', 'Ṻ': 'ṻ', 'Ṽ': 'ṽ', 'Ṿ': 'ṿ', 'Ẁ': 'ẁ', 'Ẃ': 'ẃ', 'Ẅ': 'ẅ', 'Ẇ': 'ẇ', 'Ẉ': 'ẉ', 'Ẋ': 'ẋ', 'Ẍ': 'ẍ', 'Ẏ': 'ẏ', 'Ẑ': 'ẑ', 'Ẓ': 'ẓ', 'Ẕ': 'ẕ', 'ẛ': 'ṡ', 'Ạ': 'ạ', 'Ả': 'ả', 'Ấ': 'ấ', 'Ầ': 'ầ', 'Ẩ': 'ẩ', 'Ẫ': 'ẫ', 'Ậ': 'ậ', 'Ắ': 'ắ', 'Ằ': 'ằ', 'Ẳ': 'ẳ', 'Ẵ': 'ẵ', 'Ặ': 'ặ', 'Ẹ': 'ẹ', 'Ẻ': 'ẻ', 'Ẽ': 'ẽ', 'Ế': 'ế', 'Ề': 'ề', 'Ể': 'ể', 'Ễ': 'ễ', 'Ệ': 'ệ', 'Ỉ': 'ỉ', 'Ị': 'ị', 'Ọ': 'ọ', 'Ỏ': 'ỏ', 'Ố': 'ố', 'Ồ': 'ồ', 'Ổ': 'ổ', 'Ỗ': 'ỗ', 'Ộ': 'ộ', 'Ớ': 'ớ', 'Ờ': 'ờ', 'Ở': 'ở', 'Ỡ': 'ỡ', 'Ợ': 'ợ', 'Ụ': 'ụ', 'Ủ': 'ủ', 'Ứ': 'ứ', 'Ừ': 'ừ', 'Ử': 'ử', 'Ữ': 'ữ', 'Ự': 'ự', 'Ỳ': 'ỳ', 'Ỵ': 'ỵ', 'Ỷ': 'ỷ', 'Ỹ': 'ỹ', 'Ỻ': 'ỻ', 'Ỽ': 'ỽ', 'Ỿ': 'ỿ', 'Ἀ': 'ἀ', 'Ἁ': 'ἁ', 'Ἂ': 'ἂ', 'Ἃ': 'ἃ', 'Ἄ': 'ἄ', 'Ἅ': 'ἅ', 'Ἆ': 'ἆ', 'Ἇ': 'ἇ', 'Ἐ': 'ἐ', 'Ἑ': 'ἑ', 'Ἒ': 'ἒ', 'Ἓ': 'ἓ', 'Ἔ': 'ἔ', 'Ἕ': 'ἕ', 'Ἠ': 'ἠ', 'Ἡ': 'ἡ', 'Ἢ': 'ἢ', 'Ἣ': 'ἣ', 'Ἤ': 'ἤ', 'Ἥ': 'ἥ', 'Ἦ': 'ἦ', 'Ἧ': 'ἧ', 'Ἰ': 'ἰ', 'Ἱ': 'ἱ', 'Ἲ': 'ἲ', 'Ἳ': 'ἳ', 'Ἴ': 'ἴ', 'Ἵ': 'ἵ', 'Ἶ': 'ἶ', 'Ἷ': 'ἷ', 'Ὀ': 'ὀ', 'Ὁ': 'ὁ', 'Ὂ': 'ὂ', 'Ὃ': 'ὃ', 'Ὄ': 'ὄ', 'Ὅ': 'ὅ', 'Ὑ': 'ὑ', 'Ὓ': 'ὓ', 'Ὕ': 'ὕ', 'Ὗ': 'ὗ', 'Ὠ': 'ὠ', 'Ὡ': 'ὡ', 'Ὢ': 'ὢ', 'Ὣ': 'ὣ', 'Ὤ': 'ὤ', 'Ὥ': 'ὥ', 'Ὦ': 'ὦ', 'Ὧ': 'ὧ', 'Ᾰ': 'ᾰ', 'Ᾱ': 'ᾱ', 'Ὰ': 'ὰ', 'Ά': 'ά', 'ι': 'ι', 'Ὲ': 'ὲ', 'Έ': 'έ', 'Ὴ': 'ὴ', 'Ή': 'ή', 'Ῐ': 'ῐ', 'Ῑ': 'ῑ', 'Ὶ': 'ὶ', 'Ί': 'ί', 'Ῠ': 'ῠ', 'Ῡ': 'ῡ', 'Ὺ': 'ὺ', 'Ύ': 'ύ', 'Ῥ': 'ῥ', 'Ὸ': 'ὸ', 'Ό': 'ό', 'Ὼ': 'ὼ', 'Ώ': 'ώ', 'Ω': 'ω', 'K': 'k', 'Å': '\xE5', 'Ⅎ': 'ⅎ', 'Ⅰ': 'ⅰ', 'Ⅱ': 'ⅱ', 'Ⅲ': 'ⅲ', 'Ⅳ': 'ⅳ', 'Ⅴ': 'ⅴ', 'Ⅵ': 'ⅵ', 'Ⅶ': 'ⅶ', 'Ⅷ': 'ⅷ', 'Ⅸ': 'ⅸ', 'Ⅹ': 'ⅹ', 'Ⅺ': 'ⅺ', 'Ⅻ': 'ⅻ', 'Ⅼ': 'ⅼ', 'Ⅽ': 'ⅽ', 'Ⅾ': 'ⅾ', 'Ⅿ': 'ⅿ', 'Ↄ': 'ↄ', 'Ⓐ': 'ⓐ', 'Ⓑ': 'ⓑ', 'Ⓒ': 'ⓒ', 'Ⓓ': 'ⓓ', 'Ⓔ': 'ⓔ', 'Ⓕ': 'ⓕ', 'Ⓖ': 'ⓖ', 'Ⓗ': 'ⓗ', 'Ⓘ': 'ⓘ', 'Ⓙ': 'ⓙ', 'Ⓚ': 'ⓚ', 'Ⓛ': 'ⓛ', 'Ⓜ': 'ⓜ', 'Ⓝ': 'ⓝ', 'Ⓞ': 'ⓞ', 'Ⓟ': 'ⓟ', 'Ⓠ': 'ⓠ', 'Ⓡ': 'ⓡ', 'Ⓢ': 'ⓢ', 'Ⓣ': 'ⓣ', 'Ⓤ': 'ⓤ', 'Ⓥ': 'ⓥ', 'Ⓦ': 'ⓦ', 'Ⓧ': 'ⓧ', 'Ⓨ': 'ⓨ', 'Ⓩ': 'ⓩ', 'Ⰰ': 'ⰰ', 'Ⰱ': 'ⰱ', 'Ⰲ': 'ⰲ', 'Ⰳ': 'ⰳ', 'Ⰴ': 'ⰴ', 'Ⰵ': 'ⰵ', 'Ⰶ': 'ⰶ', 'Ⰷ': 'ⰷ', 'Ⰸ': 'ⰸ', 'Ⰹ': 'ⰹ', 'Ⰺ': 'ⰺ', 'Ⰻ': 'ⰻ', 'Ⰼ': 'ⰼ', 'Ⰽ': 'ⰽ', 'Ⰾ': 'ⰾ', 'Ⰿ': 'ⰿ', 'Ⱀ': 'ⱀ', 'Ⱁ': 'ⱁ', 'Ⱂ': 'ⱂ', 'Ⱃ': 'ⱃ', 'Ⱄ': 'ⱄ', 'Ⱅ': 'ⱅ', 'Ⱆ': 'ⱆ', 'Ⱇ': 'ⱇ', 'Ⱈ': 'ⱈ', 'Ⱉ': 'ⱉ', 'Ⱊ': 'ⱊ', 'Ⱋ': 'ⱋ', 'Ⱌ': 'ⱌ', 'Ⱍ': 'ⱍ', 'Ⱎ': 'ⱎ', 'Ⱏ': 'ⱏ', 'Ⱐ': 'ⱐ', 'Ⱑ': 'ⱑ', 'Ⱒ': 'ⱒ', 'Ⱓ': 'ⱓ', 'Ⱔ': 'ⱔ', 'Ⱕ': 'ⱕ', 'Ⱖ': 'ⱖ', 'Ⱗ': 'ⱗ', 'Ⱘ': 'ⱘ', 'Ⱙ': 'ⱙ', 'Ⱚ': 'ⱚ', 'Ⱛ': 'ⱛ', 'Ⱜ': 'ⱜ', 'Ⱝ': 'ⱝ', 'Ⱞ': 'ⱞ', 'Ⱡ': 'ⱡ', 'Ɫ': 'ɫ', 'Ᵽ': 'ᵽ', 'Ɽ': 'ɽ', 'Ⱨ': 'ⱨ', 'Ⱪ': 'ⱪ', 'Ⱬ': 'ⱬ', 'Ɑ': 'ɑ', 'Ɱ': 'ɱ', 'Ɐ': 'ɐ', 'Ɒ': 'ɒ', 'Ⱳ': 'ⱳ', 'Ⱶ': 'ⱶ', 'Ȿ': 'ȿ', 'Ɀ': 'ɀ', 'Ⲁ': 'ⲁ', 'Ⲃ': 'ⲃ', 'Ⲅ': 'ⲅ', 'Ⲇ': 'ⲇ', 'Ⲉ': 'ⲉ', 'Ⲋ': 'ⲋ', 'Ⲍ': 'ⲍ', 'Ⲏ': 'ⲏ', 'Ⲑ': 'ⲑ', 'Ⲓ': 'ⲓ', 'Ⲕ': 'ⲕ', 'Ⲗ': 'ⲗ', 'Ⲙ': 'ⲙ', 'Ⲛ': 'ⲛ', 'Ⲝ': 'ⲝ', 'Ⲟ': 'ⲟ', 'Ⲡ': 'ⲡ', 'Ⲣ': 'ⲣ', 'Ⲥ': 'ⲥ', 'Ⲧ': 'ⲧ', 'Ⲩ': 'ⲩ', 'Ⲫ': 'ⲫ', 'Ⲭ': 'ⲭ', 'Ⲯ': 'ⲯ', 'Ⲱ': 'ⲱ', 'Ⲳ': 'ⲳ', 'Ⲵ': 'ⲵ', 'Ⲷ': 'ⲷ', 'Ⲹ': 'ⲹ', 'Ⲻ': 'ⲻ', 'Ⲽ': 'ⲽ', 'Ⲿ': 'ⲿ', 'Ⳁ': 'ⳁ', 'Ⳃ': 'ⳃ', 'Ⳅ': 'ⳅ', 'Ⳇ': 'ⳇ', 'Ⳉ': 'ⳉ', 'Ⳋ': 'ⳋ', 'Ⳍ': 'ⳍ', 'Ⳏ': 'ⳏ', 'Ⳑ': 'ⳑ', 'Ⳓ': 'ⳓ', 'Ⳕ': 'ⳕ', 'Ⳗ': 'ⳗ', 'Ⳙ': 'ⳙ', 'Ⳛ': 'ⳛ', 'Ⳝ': 'ⳝ', 'Ⳟ': 'ⳟ', 'Ⳡ': 'ⳡ', 'Ⳣ': 'ⳣ', 'Ⳬ': 'ⳬ', 'Ⳮ': 'ⳮ', 'Ⳳ': 'ⳳ', 'Ꙁ': 'ꙁ', 'Ꙃ': 'ꙃ', 'Ꙅ': 'ꙅ', 'Ꙇ': 'ꙇ', 'Ꙉ': 'ꙉ', 'Ꙋ': 'ꙋ', 'Ꙍ': 'ꙍ', 'Ꙏ': 'ꙏ', 'Ꙑ': 'ꙑ', 'Ꙓ': 'ꙓ', 'Ꙕ': 'ꙕ', 'Ꙗ': 'ꙗ', 'Ꙙ': 'ꙙ', 'Ꙛ': 'ꙛ', 'Ꙝ': 'ꙝ', 'Ꙟ': 'ꙟ', 'Ꙡ': 'ꙡ', 'Ꙣ': 'ꙣ', 'Ꙥ': 'ꙥ', 'Ꙧ': 'ꙧ', 'Ꙩ': 'ꙩ', 'Ꙫ': 'ꙫ', 'Ꙭ': 'ꙭ', 'Ꚁ': 'ꚁ', 'Ꚃ': 'ꚃ', 'Ꚅ': 'ꚅ', 'Ꚇ': 'ꚇ', 'Ꚉ': 'ꚉ', 'Ꚋ': 'ꚋ', 'Ꚍ': 'ꚍ', 'Ꚏ': 'ꚏ', 'Ꚑ': 'ꚑ', 'Ꚓ': 'ꚓ', 'Ꚕ': 'ꚕ', 'Ꚗ': 'ꚗ', 'Ꚙ': 'ꚙ', 'Ꚛ': 'ꚛ', 'Ꜣ': 'ꜣ', 'Ꜥ': 'ꜥ', 'Ꜧ': 'ꜧ', 'Ꜩ': 'ꜩ', 'Ꜫ': 'ꜫ', 'Ꜭ': 'ꜭ', 'Ꜯ': 'ꜯ', 'Ꜳ': 'ꜳ', 'Ꜵ': 'ꜵ', 'Ꜷ': 'ꜷ', 'Ꜹ': 'ꜹ', 'Ꜻ': 'ꜻ', 'Ꜽ': 'ꜽ', 'Ꜿ': 'ꜿ', 'Ꝁ': 'ꝁ', 'Ꝃ': 'ꝃ', 'Ꝅ': 'ꝅ', 'Ꝇ': 'ꝇ', 'Ꝉ': 'ꝉ', 'Ꝋ': 'ꝋ', 'Ꝍ': 'ꝍ', 'Ꝏ': 'ꝏ', 'Ꝑ': 'ꝑ', 'Ꝓ': 'ꝓ', 'Ꝕ': 'ꝕ', 'Ꝗ': 'ꝗ', 'Ꝙ': 'ꝙ', 'Ꝛ': 'ꝛ', 'Ꝝ': 'ꝝ', 'Ꝟ': 'ꝟ', 'Ꝡ': 'ꝡ', 'Ꝣ': 'ꝣ', 'Ꝥ': 'ꝥ', 'Ꝧ': 'ꝧ', 'Ꝩ': 'ꝩ', 'Ꝫ': 'ꝫ', 'Ꝭ': 'ꝭ', 'Ꝯ': 'ꝯ', 'Ꝺ': 'ꝺ', 'Ꝼ': 'ꝼ', 'Ᵹ': 'ᵹ', 'Ꝿ': 'ꝿ', 'Ꞁ': 'ꞁ', 'Ꞃ': 'ꞃ', 'Ꞅ': 'ꞅ', 'Ꞇ': 'ꞇ', 'Ꞌ': 'ꞌ', 'Ɥ': 'ɥ', 'Ꞑ': 'ꞑ', 'Ꞓ': 'ꞓ', 'Ꞗ': 'ꞗ', 'Ꞙ': 'ꞙ', 'Ꞛ': 'ꞛ', 'Ꞝ': 'ꞝ', 'Ꞟ': 'ꞟ', 'Ꞡ': 'ꞡ', 'Ꞣ': 'ꞣ', 'Ꞥ': 'ꞥ', 'Ꞧ': 'ꞧ', 'Ꞩ': 'ꞩ', 'Ɦ': 'ɦ', 'Ɜ': 'ɜ', 'Ɡ': 'ɡ', 'Ɬ': 'ɬ', 'Ʞ': 'ʞ', 'Ʇ': 'ʇ', 'Ａ': 'ａ', 'Ｂ': 'ｂ', 'Ｃ': 'ｃ', 'Ｄ': 'ｄ', 'Ｅ': 'ｅ', 'Ｆ': 'ｆ', 'Ｇ': 'ｇ', 'Ｈ': 'ｈ', 'Ｉ': 'ｉ', 'Ｊ': 'ｊ', 'Ｋ': 'ｋ', 'Ｌ': 'ｌ', 'Ｍ': 'ｍ', 'Ｎ': 'ｎ', 'Ｏ': 'ｏ', 'Ｐ': 'ｐ', 'Ｑ': 'ｑ', 'Ｒ': 'ｒ', 'Ｓ': 'ｓ', 'Ｔ': 'ｔ', 'Ｕ': 'ｕ', 'Ｖ': 'ｖ', 'Ｗ': 'ｗ', 'Ｘ': 'ｘ', 'Ｙ': 'ｙ', 'Ｚ': 'ｚ', '𐐀': '𐐨', '𐐁': '𐐩', '𐐂': '𐐪', '𐐃': '𐐫', '𐐄': '𐐬', '𐐅': '𐐭', '𐐆': '𐐮', '𐐇': '𐐯', '𐐈': '𐐰', '𐐉': '𐐱', '𐐊': '𐐲', '𐐋': '𐐳', '𐐌': '𐐴', '𐐍': '𐐵', '𐐎': '𐐶', '𐐏': '𐐷', '𐐐': '𐐸', '𐐑': '𐐹', '𐐒': '𐐺', '𐐓': '𐐻', '𐐔': '𐐼', '𐐕': '𐐽', '𐐖': '𐐾', '𐐗': '𐐿', '𐐘': '𐑀', '𐐙': '𐑁', '𐐚': '𐑂', '𐐛': '𐑃', '𐐜': '𐑄', '𐐝': '𐑅', '𐐞': '𐑆', '𐐟': '𐑇', '𐐠': '𐑈', '𐐡': '𐑉', '𐐢': '𐑊', '𐐣': '𐑋', '𐐤': '𐑌', '𐐥': '𐑍', '𐐦': '𐑎', '𐐧': '𐑏', '𑢠': '𑣀', '𑢡': '𑣁', '𑢢': '𑣂', '𑢣': '𑣃', '𑢤': '𑣄', '𑢥': '𑣅', '𑢦': '𑣆', '𑢧': '𑣇', '𑢨': '𑣈', '𑢩': '𑣉', '𑢪': '𑣊', '𑢫': '𑣋', '𑢬': '𑣌', '𑢭': '𑣍', '𑢮': '𑣎', '𑢯': '𑣏', '𑢰': '𑣐', '𑢱': '𑣑', '𑢲': '𑣒', '𑢳': '𑣓', '𑢴': '𑣔', '𑢵': '𑣕', '𑢶': '𑣖', '𑢷': '𑣗', '𑢸': '𑣘', '𑢹': '𑣙', '𑢺': '𑣚', '𑢻': '𑣛', '𑢼': '𑣜', '𑢽': '𑣝', '𑢾': '𑣞', '𑢿': '𑣟', '\xDF': 'ss', 'İ': 'i̇', 'ŉ': 'ʼn', 'ǰ': 'ǰ', 'ΐ': 'ΐ', 'ΰ': 'ΰ', 'և': 'եւ', 'ẖ': 'ẖ', 'ẗ': 'ẗ', 'ẘ': 'ẘ', 'ẙ': 'ẙ', 'ẚ': 'aʾ', 'ẞ': 'ss', 'ὐ': 'ὐ', 'ὒ': 'ὒ', 'ὔ': 'ὔ', 'ὖ': 'ὖ', 'ᾀ': 'ἀι', 'ᾁ': 'ἁι', 'ᾂ': 'ἂι', 'ᾃ': 'ἃι', 'ᾄ': 'ἄι', 'ᾅ': 'ἅι', 'ᾆ': 'ἆι', 'ᾇ': 'ἇι', 'ᾈ': 'ἀι', 'ᾉ': 'ἁι', 'ᾊ': 'ἂι', 'ᾋ': 'ἃι', 'ᾌ': 'ἄι', 'ᾍ': 'ἅι', 'ᾎ': 'ἆι', 'ᾏ': 'ἇι', 'ᾐ': 'ἠι', 'ᾑ': 'ἡι', 'ᾒ': 'ἢι', 'ᾓ': 'ἣι', 'ᾔ': 'ἤι', 'ᾕ': 'ἥι', 'ᾖ': 'ἦι', 'ᾗ': 'ἧι', 'ᾘ': 'ἠι', 'ᾙ': 'ἡι', 'ᾚ': 'ἢι', 'ᾛ': 'ἣι', 'ᾜ': 'ἤι', 'ᾝ': 'ἥι', 'ᾞ': 'ἦι', 'ᾟ': 'ἧι', 'ᾠ': 'ὠι', 'ᾡ': 'ὡι', 'ᾢ': 'ὢι', 'ᾣ': 'ὣι', 'ᾤ': 'ὤι', 'ᾥ': 'ὥι', 'ᾦ': 'ὦι', 'ᾧ': 'ὧι', 'ᾨ': 'ὠι', 'ᾩ': 'ὡι', 'ᾪ': 'ὢι', 'ᾫ': 'ὣι', 'ᾬ': 'ὤι', 'ᾭ': 'ὥι', 'ᾮ': 'ὦι', 'ᾯ': 'ὧι', 'ᾲ': 'ὰι', 'ᾳ': 'αι', 'ᾴ': 'άι', 'ᾶ': 'ᾶ', 'ᾷ': 'ᾶι', 'ᾼ': 'αι', 'ῂ': 'ὴι', 'ῃ': 'ηι', 'ῄ': 'ήι', 'ῆ': 'ῆ', 'ῇ': 'ῆι', 'ῌ': 'ηι', 'ῒ': 'ῒ', 'ΐ': 'ΐ', 'ῖ': 'ῖ', 'ῗ': 'ῗ', 'ῢ': 'ῢ', 'ΰ': 'ΰ', 'ῤ': 'ῤ', 'ῦ': 'ῦ', 'ῧ': 'ῧ', 'ῲ': 'ὼι', 'ῳ': 'ωι', 'ῴ': 'ώι', 'ῶ': 'ῶ', 'ῷ': 'ῶι', 'ῼ': 'ωι', 'ﬀ': 'ff', 'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬅ': 'st', 'ﬆ': 'st', 'ﬓ': 'մն', 'ﬔ': 'մե', 'ﬕ': 'մի', 'ﬖ': 'վն', 'ﬗ': 'մխ' };

	// Normalize reference label: collapse internal whitespace
	// to single space, remove leading/trailing whitespace, case fold.
	module.exports = function (string) {
	    return string.slice(1, string.length - 1).trim().replace(regex, function ($0) {
	        // Note: there is no need to check `hasOwnProperty($0)` here.
	        // If character not found in lookup table, it must be whitespace.
	        return map[$0] || ' ';
	    });
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	"use strict";

	// derived from https://github.com/mathiasbynens/String.fromCodePoint
	/*! http://mths.be/fromcodepoint v0.2.1 by @mathias */

	if (String.fromCodePoint) {
	    module.exports = function (_) {
	        try {
	            return String.fromCodePoint(_);
	        } catch (e) {
	            if (e instanceof RangeError) {
	                return String.fromCharCode(0xFFFD);
	            }
	            throw e;
	        }
	    };
	} else {

	    var stringFromCharCode = String.fromCharCode;
	    var floor = Math.floor;
	    var fromCodePoint = function fromCodePoint() {
	        var MAX_SIZE = 0x4000;
	        var codeUnits = [];
	        var highSurrogate;
	        var lowSurrogate;
	        var index = -1;
	        var length = arguments.length;
	        if (!length) {
	            return '';
	        }
	        var result = '';
	        while (++index < length) {
	            var codePoint = Number(arguments[index]);
	            if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
	            codePoint < 0 || // not a valid Unicode code point
	            codePoint > 0x10FFFF || // not a valid Unicode code point
	            floor(codePoint) !== codePoint // not an integer
	            ) {
	                    return String.fromCharCode(0xFFFD);
	                }
	            if (codePoint <= 0xFFFF) {
	                // BMP code point
	                codeUnits.push(codePoint);
	            } else {
	                // Astral code point; split in surrogate halves
	                // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
	                codePoint -= 0x10000;
	                highSurrogate = (codePoint >> 10) + 0xD800;
	                lowSurrogate = codePoint % 0x400 + 0xDC00;
	                codeUnits.push(highSurrogate, lowSurrogate);
	            }
	            if (index + 1 === length || codeUnits.length > MAX_SIZE) {
	                result += stringFromCharCode.apply(null, codeUnits);
	                codeUnits.length = 0;
	            }
	        }
	        return result;
	    };
	    module.exports = fromCodePoint;
	}

/***/ },
/* 56 */
/***/ function(module, exports) {

	'use strict';

	/*! http://mths.be/repeat v0.2.0 by @mathias */
	if (!String.prototype.repeat) {
		(function () {
			'use strict'; // needed to support `apply`/`call` with `undefined`/`null`

			var defineProperty = function () {
				// IE 8 only supports `Object.defineProperty` on DOM elements
				try {
					var object = {};
					var $defineProperty = Object.defineProperty;
					var result = $defineProperty(object, object, object) && $defineProperty;
				} catch (error) {}
				return result;
			}();
			var repeat = function repeat(count) {
				if (this == null) {
					throw TypeError();
				}
				var string = String(this);
				// `ToInteger`
				var n = count ? Number(count) : 0;
				if (n != n) {
					// better `isNaN`
					n = 0;
				}
				// Account for out-of-bounds indices
				if (n < 0 || n == Infinity) {
					throw RangeError();
				}
				var result = '';
				while (n) {
					if (n % 2 == 1) {
						result += string;
					}
					if (n > 1) {
						string += string;
					}
					n >>= 1;
				}
				return result;
			};
			if (defineProperty) {
				defineProperty(String.prototype, 'repeat', {
					'value': repeat,
					'configurable': true,
					'writable': true
				});
			} else {
				String.prototype.repeat = repeat;
			}
		})();
	}

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var escapeXml = __webpack_require__(42).escapeXml;

	// Helper function to produce an HTML tag.
	var tag = function tag(name, attrs, selfclosing) {
	    var result = '<' + name;
	    if (attrs && attrs.length > 0) {
	        var i = 0;
	        var attrib;
	        while ((attrib = attrs[i]) !== undefined) {
	            result += ' ' + attrib[0] + '="' + attrib[1] + '"';
	            i++;
	        }
	    }
	    if (selfclosing) {
	        result += ' /';
	    }

	    result += '>';
	    return result;
	};

	var reHtmlTag = /\<[^>]*\>/;
	var reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
	var reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

	var potentiallyUnsafe = function potentiallyUnsafe(url) {
	    return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
	};

	var renderNodes = function renderNodes(block) {

	    var attrs;
	    var info_words;
	    var tagname;
	    var walker = block.walker();
	    var event, node, entering;
	    var buffer = "";
	    var lastOut = "\n";
	    var disableTags = 0;
	    var grandparent;
	    var out = function out(s) {
	        if (disableTags > 0) {
	            buffer += s.replace(reHtmlTag, '');
	        } else {
	            buffer += s;
	        }
	        lastOut = s;
	    };
	    var esc = this.escape;
	    var cr = function cr() {
	        if (lastOut !== '\n') {
	            buffer += '\n';
	            lastOut = '\n';
	        }
	    };

	    var options = this.options;

	    if (options.time) {
	        console.time("rendering");
	    }

	    while (event = walker.next()) {
	        entering = event.entering;
	        node = event.node;

	        attrs = [];
	        if (options.sourcepos) {
	            var pos = node.sourcepos;
	            if (pos) {
	                attrs.push(['data-sourcepos', String(pos[0][0]) + ':' + String(pos[0][1]) + '-' + String(pos[1][0]) + ':' + String(pos[1][1])]);
	            }
	        }

	        switch (node.type) {
	            case 'Text':
	                out(esc(node.literal, false));
	                break;

	            case 'Softbreak':
	                out(this.softbreak);
	                break;

	            case 'Hardbreak':
	                out(tag('br', [], true));
	                cr();
	                break;

	            case 'Emph':
	                out(tag(entering ? 'em' : '/em'));
	                break;

	            case 'Strong':
	                out(tag(entering ? 'strong' : '/strong'));
	                break;

	            case 'HtmlInline':
	                if (options.safe) {
	                    out('<!-- raw HTML omitted -->');
	                } else {
	                    out(node.literal);
	                }
	                break;

	            case 'CustomInline':
	                if (entering && node.onEnter) {
	                    out(node.onEnter);
	                } else if (!entering && node.onExit) {
	                    out(node.onExit);
	                }
	                break;

	            case 'Link':
	                if (entering) {
	                    if (!(options.safe && potentiallyUnsafe(node.destination))) {
	                        attrs.push(['href', esc(node.destination, true)]);
	                    }
	                    if (node.title) {
	                        attrs.push(['title', esc(node.title, true)]);
	                    }
	                    out(tag('a', attrs));
	                } else {
	                    out(tag('/a'));
	                }
	                break;

	            case 'Image':
	                if (entering) {
	                    if (disableTags === 0) {
	                        if (options.safe && potentiallyUnsafe(node.destination)) {
	                            out('<img src="" alt="');
	                        } else {
	                            out('<img src="' + esc(node.destination, true) + '" alt="');
	                        }
	                    }
	                    disableTags += 1;
	                } else {
	                    disableTags -= 1;
	                    if (disableTags === 0) {
	                        if (node.title) {
	                            out('" title="' + esc(node.title, true));
	                        }
	                        out('" />');
	                    }
	                }
	                break;

	            case 'Code':
	                out(tag('code') + esc(node.literal, false) + tag('/code'));
	                break;

	            case 'Document':
	                break;

	            case 'Paragraph':
	                grandparent = node.parent.parent;
	                if (grandparent !== null && grandparent.type === 'List') {
	                    if (grandparent.listTight) {
	                        break;
	                    }
	                }
	                if (entering) {
	                    cr();
	                    out(tag('p', attrs));
	                } else {
	                    out(tag('/p'));
	                    cr();
	                }
	                break;

	            case 'BlockQuote':
	                if (entering) {
	                    cr();
	                    out(tag('blockquote', attrs));
	                    cr();
	                } else {
	                    cr();
	                    out(tag('/blockquote'));
	                    cr();
	                }
	                break;

	            case 'Item':
	                if (entering) {
	                    out(tag('li', attrs));
	                } else {
	                    out(tag('/li'));
	                    cr();
	                }
	                break;

	            case 'List':
	                tagname = node.listType === 'Bullet' ? 'ul' : 'ol';
	                if (entering) {
	                    var start = node.listStart;
	                    if (start !== null && start !== 1) {
	                        attrs.push(['start', start.toString()]);
	                    }
	                    cr();
	                    out(tag(tagname, attrs));
	                    cr();
	                } else {
	                    cr();
	                    out(tag('/' + tagname));
	                    cr();
	                }
	                break;

	            case 'Heading':
	                tagname = 'h' + node.level;
	                if (entering) {
	                    cr();
	                    out(tag(tagname, attrs));
	                } else {
	                    out(tag('/' + tagname));
	                    cr();
	                }
	                break;

	            case 'CodeBlock':
	                info_words = node.info ? node.info.split(/\s+/) : [];
	                if (info_words.length > 0 && info_words[0].length > 0) {
	                    attrs.push(['class', 'language-' + esc(info_words[0], true)]);
	                }
	                cr();
	                out(tag('pre') + tag('code', attrs));
	                out(esc(node.literal, false));
	                out(tag('/code') + tag('/pre'));
	                cr();
	                break;

	            case 'HtmlBlock':
	                cr();
	                if (options.safe) {
	                    out('<!-- raw HTML omitted -->');
	                } else {
	                    out(node.literal);
	                }
	                cr();
	                break;

	            case 'CustomBlock':
	                cr();
	                if (entering && node.onEnter) {
	                    out(node.onEnter);
	                } else if (!entering && node.onExit) {
	                    out(node.onExit);
	                }
	                cr();
	                break;

	            case 'ThematicBreak':
	                cr();
	                out(tag('hr', attrs, true));
	                cr();
	                break;

	            default:
	                throw "Unknown node type " + node.type;
	        }
	    }
	    if (options.time) {
	        console.timeEnd("rendering");
	    }
	    return buffer;
	};

	// The HtmlRenderer object.
	function HtmlRenderer(options) {
	    return {
	        // default options:
	        softbreak: '\n', // by default, soft breaks are rendered as newlines in HTML
	        // set to "<br />" to make them hard breaks
	        // set to " " if you want to ignore line wrapping in source
	        escape: escapeXml,
	        options: options || {},
	        render: renderNodes
	    };
	}

	module.exports = HtmlRenderer;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var escapeXml = __webpack_require__(42).escapeXml;

	// Helper function to produce an XML tag.
	var tag = function tag(name, attrs, selfclosing) {
	    var result = '<' + name;
	    if (attrs && attrs.length > 0) {
	        var i = 0;
	        var attrib;
	        while ((attrib = attrs[i]) !== undefined) {
	            result += ' ' + attrib[0] + '="' + attrib[1] + '"';
	            i++;
	        }
	    }
	    if (selfclosing) {
	        result += ' /';
	    }

	    result += '>';
	    return result;
	};

	var reXMLTag = /\<[^>]*\>/;

	var toTagName = function toTagName(s) {
	    return s.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
	};

	var renderNodes = function renderNodes(block) {

	    var attrs;
	    var tagname;
	    var walker = block.walker();
	    var event, node, entering;
	    var buffer = "";
	    var lastOut = "\n";
	    var disableTags = 0;
	    var indentLevel = 0;
	    var indent = '  ';
	    var container;
	    var selfClosing;
	    var nodetype;

	    var out = function out(s) {
	        if (disableTags > 0) {
	            buffer += s.replace(reXMLTag, '');
	        } else {
	            buffer += s;
	        }
	        lastOut = s;
	    };
	    var esc = this.escape;
	    var cr = function cr() {
	        if (lastOut !== '\n') {
	            buffer += '\n';
	            lastOut = '\n';
	            for (var i = indentLevel; i > 0; i--) {
	                buffer += indent;
	            }
	        }
	    };

	    var options = this.options;

	    if (options.time) {
	        console.time("rendering");
	    }

	    buffer += '<?xml version="1.0" encoding="UTF-8"?>\n';
	    buffer += '<!DOCTYPE CommonMark SYSTEM "CommonMark.dtd">\n';

	    while (event = walker.next()) {
	        entering = event.entering;
	        node = event.node;
	        nodetype = node.type;

	        container = node.isContainer;
	        selfClosing = nodetype === 'ThematicBreak' || nodetype === 'Hardbreak' || nodetype === 'Softbreak';
	        tagname = toTagName(nodetype);

	        if (entering) {

	            attrs = [];

	            switch (nodetype) {
	                case 'Document':
	                    attrs.push(['xmlns', 'http://commonmark.org/xml/1.0']);
	                    break;
	                case 'List':
	                    if (node.listType !== null) {
	                        attrs.push(['type', node.listType.toLowerCase()]);
	                    }
	                    if (node.listStart !== null) {
	                        attrs.push(['start', String(node.listStart)]);
	                    }
	                    if (node.listTight !== null) {
	                        attrs.push(['tight', node.listTight ? 'true' : 'false']);
	                    }
	                    var delim = node.listDelimiter;
	                    if (delim !== null) {
	                        var delimword = '';
	                        if (delim === '.') {
	                            delimword = 'period';
	                        } else {
	                            delimword = 'paren';
	                        }
	                        attrs.push(['delimiter', delimword]);
	                    }
	                    break;
	                case 'CodeBlock':
	                    if (node.info) {
	                        attrs.push(['info', node.info]);
	                    }
	                    break;
	                case 'Heading':
	                    attrs.push(['level', String(node.level)]);
	                    break;
	                case 'Link':
	                case 'Image':
	                    attrs.push(['destination', node.destination]);
	                    attrs.push(['title', node.title]);
	                    break;
	                case 'CustomInline':
	                case 'CustomBlock':
	                    attrs.push(['on_enter', node.onEnter]);
	                    attrs.push(['on_exit', node.onExit]);
	                    break;
	                default:
	                    break;
	            }
	            if (options.sourcepos) {
	                var pos = node.sourcepos;
	                if (pos) {
	                    attrs.push(['sourcepos', String(pos[0][0]) + ':' + String(pos[0][1]) + '-' + String(pos[1][0]) + ':' + String(pos[1][1])]);
	                }
	            }

	            cr();
	            out(tag(tagname, attrs, selfClosing));
	            if (container) {
	                indentLevel += 1;
	            } else if (!container && !selfClosing) {
	                var lit = node.literal;
	                if (lit) {
	                    out(esc(lit));
	                }
	                out(tag('/' + tagname));
	            }
	        } else {
	            indentLevel -= 1;
	            cr();
	            out(tag('/' + tagname));
	        }
	    }
	    if (options.time) {
	        console.timeEnd("rendering");
	    }
	    buffer += '\n';
	    return buffer;
	};

	// The XmlRenderer object.
	function XmlRenderer(options) {
	    return {
	        // default options:
	        softbreak: '\n', // by default, soft breaks are rendered as newlines in HTML
	        // set to "<br />" to make them hard breaks
	        // set to " " if you want to ignore line wrapping in source
	        escape: escapeXml,
	        options: options || {},
	        render: renderNodes
	    };
	}

	module.exports = XmlRenderer;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(8);
	var assign = __webpack_require__(60);
	var isPlainObject = __webpack_require__(63);
	var xssFilters = __webpack_require__(64);

	var defaultRenderers = {
	    BlockQuote: 'blockquote',
	    Code: 'code',
	    Emph: 'em',
	    Hardbreak: 'br',
	    Image: 'img',
	    Item: 'li',
	    Link: 'a',
	    Paragraph: 'p',
	    Strong: 'strong',
	    ThematicBreak: 'hr',

	    HtmlBlock: HtmlRenderer,
	    HtmlInline: HtmlRenderer,

	    List: function List(props) {
	        var tag = props.type === 'Bullet' ? 'ul' : 'ol';
	        var attrs = { key: props.nodeKey };

	        if (props.start !== null && props.start !== 1) {
	            attrs.start = props.start.toString();
	        }

	        return createElement(tag, attrs, props.children);
	    },
	    CodeBlock: function Code(props) {
	        var className = props.language && 'language-' + props.language;
	        var code = createElement('code', { className: className }, props.literal);
	        return createElement('pre', { key: props.nodeKey }, code);
	    },
	    Heading: function Heading(props) {
	        return createElement('h' + props.level, props, props.children);
	    },

	    Text: null,
	    Softbreak: null
	};

	function HtmlRenderer(props) {
	    var nodeProps = props.escapeHtml ? {} : { dangerouslySetInnerHTML: { __html: props.literal } };
	    var children = props.escapeHtml ? [props.literal] : null;

	    if (props.escapeHtml || !props.skipHtml) {
	        return createElement(props.isBlock ? 'div' : 'span', nodeProps, children);
	    }
	}

	function isGrandChildOfList(node) {
	    var grandparent = node.parent.parent;
	    return grandparent && grandparent.type === 'List' && grandparent.listTight;
	}

	function addChild(node, child) {
	    var parent = node;
	    do {
	        parent = parent.parent;
	    } while (!parent.react);

	    parent.react.children.push(child);
	}

	function createElement(tagName, props, children) {
	    var nodeChildren = Array.isArray(children) && children.reduce(reduceChildren, []);
	    var args = [tagName, props].concat(nodeChildren || children);
	    return React.createElement.apply(React, args);
	}

	function reduceChildren(children, child) {
	    var lastIndex = children.length - 1;
	    if (typeof child === 'string' && typeof children[lastIndex] === 'string') {
	        children[lastIndex] += child;
	    } else {
	        children.push(child);
	    }

	    return children;
	}

	// For some nodes, we want to include more props than for others
	function getNodeProps(node, key, opts, undef) {
	    var props = { key: key };

	    // `sourcePos` is true if the user wants source information (line/column info from markdown source)
	    if (opts.sourcePos && node.sourcepos) {
	        var pos = node.sourcepos;
	        props['data-sourcepos'] = [pos[0][0], ':', pos[0][1], '-', pos[1][0], ':', pos[1][1]].map(String).join('');
	    }

	    switch (node.type) {
	        case 'HtmlInline':
	        case 'HtmlBlock':
	            props.isBlock = node.type === 'HtmlBlock';
	            props.escapeHtml = opts.escapeHtml;
	            props.skipHtml = opts.skipHtml;
	            break;
	        case 'CodeBlock':
	            var codeInfo = node.info ? node.info.split(/ +/) : [];
	            if (codeInfo.length > 0 && codeInfo[0].length > 0) {
	                props.language = codeInfo[0];
	            }
	            break;
	        case 'Code':
	            props.children = node.literal;
	            break;
	        case 'Heading':
	            props.level = node.level;
	            break;
	        case 'Softbreak':
	            props.softBreak = opts.softBreak;
	            break;
	        case 'Link':
	            props.href = opts.transformLinkUri ? opts.transformLinkUri(node.destination) : node.destination;
	            props.title = node.title || undef;
	            break;
	        case 'Image':
	            props.src = node.destination;
	            props.title = node.title || undef;

	            // Commonmark treats image description as children. We just want the text
	            props.alt = node.react.children.join('');
	            node.react.children = undef;
	            break;
	        case 'List':
	            props.start = node.listStart;
	            props.type = node.listType;
	            props.tight = node.listTight;
	            break;
	        default:
	    }

	    props.literal = node.literal;

	    var children = props.children || node.react && node.react.children;
	    if (Array.isArray(children)) {
	        props.children = children.reduce(reduceChildren, []) || null;
	    }

	    return props;
	}

	function renderNodes(block) {
	    var walker = block.walker();

	    // Softbreaks are usually treated as newlines, but in HTML we might want explicit linebreaks
	    var softBreak = this.softBreak === 'br' ? React.createElement('br') : this.softBreak;

	    var propOptions = {
	        sourcePos: this.sourcePos,
	        escapeHtml: this.escapeHtml,
	        skipHtml: this.skipHtml,
	        transformLinkUri: this.transformLinkUri,
	        softBreak: softBreak
	    };

	    var e, node, entering, leaving, doc, key, nodeProps;
	    while (e = walker.next()) {
	        entering = e.entering;
	        leaving = !entering;
	        node = e.node;
	        key = !e.node.prev ? 0 : e.node.prev.reactKey + 1;
	        nodeProps = null;

	        // Assigning a key to the node
	        node.reactKey = key;

	        // If we have not assigned a document yet, assume the current node is just that
	        if (!doc) {
	            doc = node;
	            node.react = { children: [] };
	            continue;
	        } else if (node === doc) {
	            // When we're leaving...
	            continue;
	        }

	        // In HTML, we don't want paragraphs inside of list items
	        if (node.type === 'Paragraph' && isGrandChildOfList(node)) {
	            continue;
	        }

	        // If we're skipping HTML nodes, don't keep processing
	        if (this.skipHtml && (node.type === 'HtmlBlock' || node.type === 'HtmlInline')) {
	            continue;
	        }

	        var isDocument = node === doc;
	        var disallowedByConfig = this.allowedTypes.indexOf(node.type) === -1;
	        var disallowedByUser = false;

	        // Do we have a user-defined function?
	        var isCompleteParent = node.isContainer && leaving;
	        if (this.allowNode && (isCompleteParent || !node.isContainer)) {
	            var nodeChildren = isCompleteParent ? node.react.children : [];

	            nodeProps = getNodeProps(node, key, propOptions);
	            disallowedByUser = !this.allowNode({
	                type: node.type,
	                renderer: this.renderers[node.type],
	                props: nodeProps,
	                children: nodeChildren
	            });
	        }

	        if (!isDocument && (disallowedByUser || disallowedByConfig)) {
	            if (!this.unwrapDisallowed && entering && node.isContainer) {
	                walker.resumeAt(node, false);
	            }

	            continue;
	        }

	        var renderer = this.renderers[node.type];
	        var isSimpleNode = node.type === 'Text' || node.type === 'Softbreak';
	        if (typeof renderer !== 'function' && !isSimpleNode && typeof renderer !== 'string') {
	            throw new Error('Renderer for type `' + node.type + '` not defined or is not renderable');
	        }

	        if (node.isContainer && entering) {
	            node.react = {
	                component: renderer,
	                props: {},
	                children: []
	            };
	        } else {
	            var childProps = nodeProps || getNodeProps(node, key, propOptions);
	            if (renderer) {
	                childProps = typeof renderer === 'string' ? childProps : assign(childProps, { nodeKey: childProps.key });

	                addChild(node, React.createElement(renderer, childProps));
	            } else if (node.type === 'Text') {
	                addChild(node, node.literal);
	            } else if (node.type === 'Softbreak') {
	                addChild(node, softBreak);
	            }
	        }
	    }

	    return doc.react.children;
	}

	function defaultLinkUriFilter(uri) {
	    var url = uri.replace(/file:\/\//g, 'x-file://');

	    // React does a pretty swell job of escaping attributes,
	    // so to prevent double-escaping, we need to decode
	    return decodeURI(xssFilters.uriInDoubleQuotedAttr(url));
	}

	function ReactRenderer(options) {
	    var opts = options || {};

	    if (opts.allowedTypes && opts.disallowedTypes) {
	        throw new Error('Only one of `allowedTypes` and `disallowedTypes` should be defined');
	    }

	    if (opts.allowedTypes && !Array.isArray(opts.allowedTypes)) {
	        throw new Error('`allowedTypes` must be an array');
	    }

	    if (opts.disallowedTypes && !Array.isArray(opts.disallowedTypes)) {
	        throw new Error('`disallowedTypes` must be an array');
	    }

	    if (opts.allowNode && typeof opts.allowNode !== 'function') {
	        throw new Error('`allowNode` must be a function');
	    }

	    var linkFilter = opts.transformLinkUri;
	    if (typeof linkFilter === 'undefined') {
	        linkFilter = defaultLinkUriFilter;
	    } else if (linkFilter && typeof linkFilter !== 'function') {
	        throw new Error('`transformLinkUri` must either be a function, or `null` to disable');
	    }

	    if (opts.renderers && !isPlainObject(opts.renderers)) {
	        throw new Error('`renderers` must be a plain object of `Type`: `Renderer` pairs');
	    }

	    var allowedTypes = opts.allowedTypes || ReactRenderer.types;
	    if (opts.disallowedTypes) {
	        allowedTypes = allowedTypes.filter(function filterDisallowed(type) {
	            return opts.disallowedTypes.indexOf(type) === -1;
	        });
	    }

	    return {
	        sourcePos: Boolean(opts.sourcePos),
	        softBreak: opts.softBreak || '\n',
	        renderers: assign({}, defaultRenderers, opts.renderers),
	        escapeHtml: Boolean(opts.escapeHtml),
	        skipHtml: Boolean(opts.skipHtml),
	        transformLinkUri: linkFilter,
	        allowNode: opts.allowNode,
	        allowedTypes: allowedTypes,
	        unwrapDisallowed: Boolean(opts.unwrapDisallowed),
	        render: renderNodes
	    };
	}

	ReactRenderer.types = Object.keys(defaultRenderers);
	ReactRenderer.renderers = defaultRenderers;
	ReactRenderer.uriTransformer = defaultLinkUriFilter;

	module.exports = ReactRenderer;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	var keys = __webpack_require__(61),
	    rest = __webpack_require__(62);

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
	var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
	    object[key] = value;
	  }
	}

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function (object) {
	    return object == null ? undefined : object[key];
	  };
	}

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : source[key];

	    assignValue(object, key, newValue);
	  }
	  return object;
	}

	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return rest(function (object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;

	    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a
	 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
	 * Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
	}

	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index === 'undefined' ? 'undefined' : _typeof(index);
	  if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
	    return eq(object[index], value);
	  }
	  return false;
	}

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

	  return value === proto;
	}

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var other = { 'user': 'fred' };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || value !== value && other !== other;
	}

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value)) && !isFunction(value);
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length,
	 *  else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Assigns own enumerable string keyed properties of source objects to the
	 * destination object. Source objects are applied from left to right.
	 * Subsequent sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object` and is loosely based on
	 * [`Object.assign`](https://mdn.io/Object/assign).
	 *
	 * @static
	 * @memberOf _
	 * @since 0.10.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @see _.assignIn
	 * @example
	 *
	 * function Foo() {
	 *   this.c = 3;
	 * }
	 *
	 * function Bar() {
	 *   this.e = 5;
	 * }
	 *
	 * Foo.prototype.d = 4;
	 * Bar.prototype.f = 6;
	 *
	 * _.assign({ 'a': 1 }, new Foo, new Bar);
	 * // => { 'a': 1, 'c': 3, 'e': 5 }
	 */
	var assign = createAssigner(function (object, source) {
	  if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
	    copyObject(source, keys(source), object);
	    return;
	  }
	  for (var key in source) {
	    if (hasOwnProperty.call(source, key)) {
	      assignValue(object, key, source[key]);
	    }
	  }
	});

	module.exports = assign;

/***/ },
/* 61 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    stringTag = '[object String]';

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf,
	    nativeKeys = Object.keys;

	/**
	 * The base implementation of `_.has` without support for deep paths.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHas(object, key) {
	  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
	  // that are composed entirely of index properties, return `false` for
	  // `hasOwnProperty` checks of them.
	  return hasOwnProperty.call(object, key) || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object' && key in object && getPrototype(object) === null;
	}

	/**
	 * The base implementation of `_.keys` which doesn't skip the constructor
	 * property of prototypes or treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  return nativeKeys(Object(object));
	}

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function (object) {
	    return object == null ? undefined : object[key];
	  };
	}

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a
	 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
	 * Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}

	/**
	 * Creates an array of index keys for `object` values of arrays,
	 * `arguments` objects, and strings, otherwise `null` is returned.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array|null} Returns index keys, else `null`.
	 */
	function indexKeys(object) {
	  var length = object ? object.length : undefined;
	  if (isLength(length) && (isArray(object) || isString(object) || isArguments(object))) {
	    return baseTimes(length, String);
	  }
	  return null;
	}

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
	}

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

	  return value === proto;
	}

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @type {Function}
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value)) && !isFunction(value);
	}

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length,
	 *  else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
	}

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
	}

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  var isProto = isPrototype(object);
	  if (!(isProto || isArrayLike(object))) {
	    return baseKeys(object);
	  }
	  var indexes = indexKeys(object),
	      skipIndexes = !!indexes,
	      result = indexes || [],
	      length = result.length;

	  for (var key in object) {
	    if (baseHas(object, key) && !(skipIndexes && (key == 'length' || isIndex(key, length))) && !(isProto && key == 'constructor')) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keys;

/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
	    MAX_INTEGER = 1.7976931348623157e+308,
	    NAN = 0 / 0;

	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    symbolTag = '[object Symbol]';

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  var length = args.length;
	  switch (length) {
	    case 0:
	      return func.call(thisArg);
	    case 1:
	      return func.call(thisArg, args[0]);
	    case 2:
	      return func.call(thisArg, args[0], args[1]);
	    case 3:
	      return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as
	 * an array.
	 *
	 * **Note:** This method is based on the
	 * [rest parameter](https://mdn.io/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.rest(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function rest(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? func.length - 1 : toInteger(start), 0);
	  return function () {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    switch (start) {
	      case 0:
	        return func.call(this, array);
	      case 1:
	        return func.call(this, args[0], array);
	      case 2:
	        return func.call(this, args[0], args[1], array);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = array;
	    return apply(func, this, otherArgs);
	  };
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
	}

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
	}

	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber(value);
	  if (value === INFINITY || value === -INFINITY) {
	    var sign = value < 0 ? -1 : 1;
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}

	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This function is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite(value),
	      remainder = result % 1;

	  return result === result ? remainder ? result - remainder : result : 0;
	}

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = isFunction(value.valueOf) ? value.valueOf() : value;
	    value = isObject(other) ? other + '' : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
	}

	module.exports = rest;

/***/ },
/* 63 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * lodash 4.0.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf;

	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
	}

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object,
	 *  else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
	}

	module.exports = isPlainObject;

/***/ },
/* 64 */
/***/ function(module, exports) {

	'use strict';

	/*
	Copyright (c) 2015, Yahoo! Inc. All rights reserved.
	Copyrights licensed under the New BSD License.
	See the accompanying LICENSE file for terms.

	Authors: Nera Liu <neraliu@yahoo-inc.com>
	         Adonis Fung <adon@yahoo-inc.com>
	         Albert Yu <albertyu@yahoo-inc.com>
	*/
	/*jshint node: true */

	exports._getPrivFilters = function () {

	    var LT = /</g,
	        QUOT = /"/g,
	        SQUOT = /'/g,
	        AMP = /&/g,
	        NULL = /\x00/g,
	        SPECIAL_ATTR_VALUE_UNQUOTED_CHARS = /(?:^$|[\x00\x09-\x0D "'`=<>])/g,
	        SPECIAL_HTML_CHARS = /[&<>"'`]/g,
	        SPECIAL_COMMENT_CHARS = /(?:\x00|^-*!?>|--!?>|--?!?$|\]>|\]$)/g;

	    // CSS sensitive chars: ()"'/,!*@{}:;
	    // By CSS: (Tab|NewLine|colon|semi|lpar|rpar|apos|sol|comma|excl|ast|midast);|(quot|QUOT)
	    // By URI_PROTOCOL: (Tab|NewLine);
	    var SENSITIVE_HTML_ENTITIES = /&(?:#([xX][0-9A-Fa-f]+|\d+);?|(Tab|NewLine|colon|semi|lpar|rpar|apos|sol|comma|excl|ast|midast|ensp|emsp|thinsp);|(nbsp|amp|AMP|lt|LT|gt|GT|quot|QUOT);?)/g,
	        SENSITIVE_NAMED_REF_MAP = { Tab: '\t', NewLine: '\n', colon: ':', semi: ';', lpar: '(', rpar: ')', apos: '\'', sol: '/', comma: ',', excl: '!', ast: '*', midast: '*', ensp: ' ', emsp: ' ', thinsp: ' ', nbsp: '\xA0', amp: '&', lt: '<', gt: '>', quot: '"', QUOT: '"' };

	    // var CSS_VALID_VALUE =
	    //     /^(?:
	    //     (?!-*expression)#?[-\w]+
	    //     |[+-]?(?:\d+|\d*\.\d+)(?:em|ex|ch|rem|px|mm|cm|in|pt|pc|%|vh|vw|vmin|vmax)?
	    //     |!important
	    //     | //empty
	    //     )$/i;
	    var CSS_VALID_VALUE = /^(?:(?!-*expression)#?[-\w]+|[+-]?(?:\d+|\d*\.\d+)(?:r?em|ex|ch|cm|mm|in|px|pt|pc|%|vh|vw|vmin|vmax)?|!important|)$/i,

	    // TODO: prevent double css escaping by not encoding \ again, but this may require CSS decoding
	    // \x7F and \x01-\x1F less \x09 are for Safari 5.0, added []{}/* for unbalanced quote
	    CSS_DOUBLE_QUOTED_CHARS = /[\x00-\x1F\x7F\[\]{}\\"]/g,
	        CSS_SINGLE_QUOTED_CHARS = /[\x00-\x1F\x7F\[\]{}\\']/g,

	    // (, \u207D and \u208D can be used in background: 'url(...)' in IE, assumed all \ chars are encoded by QUOTED_CHARS, and null is already replaced with \uFFFD
	    // otherwise, use this CSS_BLACKLIST instead (enhance it with url matching): /(?:\\?\(|[\u207D\u208D]|\\0{0,4}28 ?|\\0{0,2}20[78][Dd] ?)+/g
	    CSS_BLACKLIST = /url[\(\u207D\u208D]+/g,

	    // this assumes encodeURI() and encodeURIComponent() has escaped 1-32, 127 for IE8
	    CSS_UNQUOTED_URL = /['\(\)]/g; // " \ treated by encodeURI()

	    // Given a full URI, need to support "[" ( IPv6address ) "]" in URI as per RFC3986
	    // Reference: https://tools.ietf.org/html/rfc3986
	    var URL_IPV6 = /\/\/%5[Bb]([A-Fa-f0-9:]+)%5[Dd]/;

	    // Reference: http://shazzer.co.uk/database/All/characters-allowd-in-html-entities
	    // Reference: http://shazzer.co.uk/vector/Characters-allowed-after-ampersand-in-named-character-references
	    // Reference: http://shazzer.co.uk/database/All/Characters-before-javascript-uri
	    // Reference: http://shazzer.co.uk/database/All/Characters-after-javascript-uri
	    // Reference: https://html.spec.whatwg.org/multipage/syntax.html#consume-a-character-reference
	    // Reference for named characters: https://html.spec.whatwg.org/multipage/entities.json
	    var URI_BLACKLIST_PROTOCOLS = { 'javascript': 1, 'data': 1, 'vbscript': 1, 'mhtml': 1, 'x-schema': 1 },
	        URI_PROTOCOL_COLON = /(?::|&#[xX]0*3[aA];?|&#0*58;?|&colon;)/,
	        URI_PROTOCOL_WHITESPACES = /(?:^[\x00-\x20]+|[\t\n\r\x00]+)/g,
	        URI_PROTOCOL_NAMED_REF_MAP = { Tab: '\t', NewLine: '\n' };

	    var x,
	        strReplace = function strReplace(s, regexp, callback) {
	        return s === undefined ? 'undefined' : s === null ? 'null' : s.toString().replace(regexp, callback);
	    },
	        fromCodePoint = String.fromCodePoint || function (codePoint) {
	        if (arguments.length === 0) {
	            return '';
	        }
	        if (codePoint <= 0xFFFF) {
	            // BMP code point
	            return String.fromCharCode(codePoint);
	        }

	        // Astral code point; split in surrogate halves
	        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
	        codePoint -= 0x10000;
	        return String.fromCharCode((codePoint >> 10) + 0xD800, codePoint % 0x400 + 0xDC00);
	    };

	    function getProtocol(s) {
	        s = s.split(URI_PROTOCOL_COLON, 2);
	        return s.length === 2 && s[0] ? s[0] : null;
	    }

	    function htmlDecode(s, namedRefMap, reNamedRef, skipReplacement) {

	        namedRefMap = namedRefMap || SENSITIVE_NAMED_REF_MAP;
	        reNamedRef = reNamedRef || SENSITIVE_HTML_ENTITIES;

	        function regExpFunction(m, num, named, named1) {
	            if (num) {
	                num = Number(num[0] <= '9' ? num : '0' + num);
	                // switch(num) {
	                //     case 0x80: return '\u20AC';  // EURO SIGN (€)
	                //     case 0x82: return '\u201A';  // SINGLE LOW-9 QUOTATION MARK (‚)
	                //     case 0x83: return '\u0192';  // LATIN SMALL LETTER F WITH HOOK (ƒ)
	                //     case 0x84: return '\u201E';  // DOUBLE LOW-9 QUOTATION MARK („)
	                //     case 0x85: return '\u2026';  // HORIZONTAL ELLIPSIS (…)
	                //     case 0x86: return '\u2020';  // DAGGER (†)
	                //     case 0x87: return '\u2021';  // DOUBLE DAGGER (‡)
	                //     case 0x88: return '\u02C6';  // MODIFIER LETTER CIRCUMFLEX ACCENT (ˆ)
	                //     case 0x89: return '\u2030';  // PER MILLE SIGN (‰)
	                //     case 0x8A: return '\u0160';  // LATIN CAPITAL LETTER S WITH CARON (Š)
	                //     case 0x8B: return '\u2039';  // SINGLE LEFT-POINTING ANGLE QUOTATION MARK (‹)
	                //     case 0x8C: return '\u0152';  // LATIN CAPITAL LIGATURE OE (Œ)
	                //     case 0x8E: return '\u017D';  // LATIN CAPITAL LETTER Z WITH CARON (Ž)
	                //     case 0x91: return '\u2018';  // LEFT SINGLE QUOTATION MARK (‘)
	                //     case 0x92: return '\u2019';  // RIGHT SINGLE QUOTATION MARK (’)
	                //     case 0x93: return '\u201C';  // LEFT DOUBLE QUOTATION MARK (“)
	                //     case 0x94: return '\u201D';  // RIGHT DOUBLE QUOTATION MARK (”)
	                //     case 0x95: return '\u2022';  // BULLET (•)
	                //     case 0x96: return '\u2013';  // EN DASH (–)
	                //     case 0x97: return '\u2014';  // EM DASH (—)
	                //     case 0x98: return '\u02DC';  // SMALL TILDE (˜)
	                //     case 0x99: return '\u2122';  // TRADE MARK SIGN (™)
	                //     case 0x9A: return '\u0161';  // LATIN SMALL LETTER S WITH CARON (š)
	                //     case 0x9B: return '\u203A';  // SINGLE RIGHT-POINTING ANGLE QUOTATION MARK (›)
	                //     case 0x9C: return '\u0153';  // LATIN SMALL LIGATURE OE (œ)
	                //     case 0x9E: return '\u017E';  // LATIN SMALL LETTER Z WITH CARON (ž)
	                //     case 0x9F: return '\u0178';  // LATIN CAPITAL LETTER Y WITH DIAERESIS (Ÿ)
	                // }
	                // // num >= 0xD800 && num <= 0xDFFF, and 0x0D is separately handled, as it doesn't fall into the range of x.pec()
	                // return (num >= 0xD800 && num <= 0xDFFF) || num === 0x0D ? '\uFFFD' : x.frCoPt(num);

	                return skipReplacement ? fromCodePoint(num) : num === 0x80 ? '€' // EURO SIGN (€)
	                : num === 0x82 ? '‚' // SINGLE LOW-9 QUOTATION MARK (‚)
	                : num === 0x83 ? 'ƒ' // LATIN SMALL LETTER F WITH HOOK (ƒ)
	                : num === 0x84 ? '„' // DOUBLE LOW-9 QUOTATION MARK („)
	                : num === 0x85 ? '…' // HORIZONTAL ELLIPSIS (…)
	                : num === 0x86 ? '†' // DAGGER (†)
	                : num === 0x87 ? '‡' // DOUBLE DAGGER (‡)
	                : num === 0x88 ? 'ˆ' // MODIFIER LETTER CIRCUMFLEX ACCENT (ˆ)
	                : num === 0x89 ? '‰' // PER MILLE SIGN (‰)
	                : num === 0x8A ? 'Š' // LATIN CAPITAL LETTER S WITH CARON (Š)
	                : num === 0x8B ? '‹' // SINGLE LEFT-POINTING ANGLE QUOTATION MARK (‹)
	                : num === 0x8C ? 'Œ' // LATIN CAPITAL LIGATURE OE (Œ)
	                : num === 0x8E ? 'Ž' // LATIN CAPITAL LETTER Z WITH CARON (Ž)
	                : num === 0x91 ? '‘' // LEFT SINGLE QUOTATION MARK (‘)
	                : num === 0x92 ? '’' // RIGHT SINGLE QUOTATION MARK (’)
	                : num === 0x93 ? '“' // LEFT DOUBLE QUOTATION MARK (“)
	                : num === 0x94 ? '”' // RIGHT DOUBLE QUOTATION MARK (”)
	                : num === 0x95 ? '•' // BULLET (•)
	                : num === 0x96 ? '–' // EN DASH (–)
	                : num === 0x97 ? '—' // EM DASH (—)
	                : num === 0x98 ? '˜' // SMALL TILDE (˜)
	                : num === 0x99 ? '™' // TRADE MARK SIGN (™)
	                : num === 0x9A ? 'š' // LATIN SMALL LETTER S WITH CARON (š)
	                : num === 0x9B ? '›' // SINGLE RIGHT-POINTING ANGLE QUOTATION MARK (›)
	                : num === 0x9C ? 'œ' // LATIN SMALL LIGATURE OE (œ)
	                : num === 0x9E ? 'ž' // LATIN SMALL LETTER Z WITH CARON (ž)
	                : num === 0x9F ? 'Ÿ' // LATIN CAPITAL LETTER Y WITH DIAERESIS (Ÿ)
	                : num >= 0xD800 && num <= 0xDFFF || num === 0x0D ? '�' : x.frCoPt(num);
	            }
	            return namedRefMap[named || named1] || m;
	        }

	        return s === undefined ? 'undefined' : s === null ? 'null' : s.toString().replace(NULL, '�').replace(reNamedRef, regExpFunction);
	    }

	    function cssEncode(chr) {
	        // space after \\HEX is needed by spec
	        return '\\' + chr.charCodeAt(0).toString(16).toLowerCase() + ' ';
	    }
	    function cssBlacklist(s) {
	        return s.replace(CSS_BLACKLIST, function (m) {
	            return '-x-' + m;
	        });
	    }
	    function cssUrl(s) {
	        // encodeURI() in yufull() will throw error for use of the CSS_UNSUPPORTED_CODE_POINT (i.e., [\uD800-\uDFFF])
	        s = x.yufull(htmlDecode(s));
	        var protocol = getProtocol(s);

	        // prefix ## for blacklisted protocols
	        return protocol && URI_BLACKLIST_PROTOCOLS[protocol.toLowerCase()] ? '##' + s : s;
	    }

	    return x = {
	        // turn invalid codePoints and that of non-characters to \uFFFD, and then fromCodePoint()
	        frCoPt: function frCoPt(num) {
	            return num === undefined || num === null ? '' : !isFinite(num = Number(num)) || // `NaN`, `+Infinity`, or `-Infinity`
	            num <= 0 || // not a valid Unicode code point
	            num > 0x10FFFF || // not a valid Unicode code point
	            // Math.floor(num) != num ||

	            num >= 0x01 && num <= 0x08 || num >= 0x0E && num <= 0x1F || num >= 0x7F && num <= 0x9F || num >= 0xFDD0 && num <= 0xFDEF || num === 0x0B || (num & 0xFFFF) === 0xFFFF || (num & 0xFFFF) === 0xFFFE ? '�' : fromCodePoint(num);
	        },
	        d: htmlDecode,
	        /*
	         * @param {string} s - An untrusted uri input
	         * @returns {string} s - null if relative url, otherwise the protocol with whitespaces stripped and lower-cased
	         */
	        yup: function yup(s) {
	            s = getProtocol(s.replace(NULL, ''));
	            // URI_PROTOCOL_WHITESPACES is required for left trim and remove interim whitespaces
	            return s ? htmlDecode(s, URI_PROTOCOL_NAMED_REF_MAP, null, true).replace(URI_PROTOCOL_WHITESPACES, '').toLowerCase() : null;
	        },

	        /*
	         * @deprecated
	         * @param {string} s - An untrusted user input
	         * @returns {string} s - The original user input with & < > " ' ` encoded respectively as &amp; &lt; &gt; &quot; &#39; and &#96;.
	         *
	         */
	        y: function y(s) {
	            return strReplace(s, SPECIAL_HTML_CHARS, function (m) {
	                return m === '&' ? '&amp;' : m === '<' ? '&lt;' : m === '>' ? '&gt;' : m === '"' ? '&quot;' : m === "'" ? '&#39;' : /*m === '`'*/'&#96;'; // in hex: 60
	            });
	        },

	        // This filter is meant to introduce double-encoding, and should be used with extra care.
	        ya: function ya(s) {
	            return strReplace(s, AMP, '&amp;');
	        },

	        // FOR DETAILS, refer to inHTMLData()
	        // Reference: https://html.spec.whatwg.org/multipage/syntax.html#data-state
	        yd: function yd(s) {
	            return strReplace(s, LT, '&lt;');
	        },

	        // FOR DETAILS, refer to inHTMLComment()
	        // All NULL characters in s are first replaced with \uFFFD.
	        // If s contains -->, --!>, or starts with -*>, insert a space right before > to stop state breaking at <!--{{{yc s}}}-->
	        // If s ends with --!, --, or -, append a space to stop collaborative state breaking at {{{yc s}}}>, {{{yc s}}}!>, {{{yc s}}}-!>, {{{yc s}}}->
	        // Reference: https://html.spec.whatwg.org/multipage/syntax.html#comment-state
	        // Reference: http://shazzer.co.uk/vector/Characters-that-close-a-HTML-comment-3
	        // Reference: http://shazzer.co.uk/vector/Characters-that-close-a-HTML-comment
	        // Reference: http://shazzer.co.uk/vector/Characters-that-close-a-HTML-comment-0021
	        // If s contains ]> or ends with ], append a space after ] is verified in IE to stop IE conditional comments.
	        // Reference: http://msdn.microsoft.com/en-us/library/ms537512%28v=vs.85%29.aspx
	        // We do not care --\s>, which can possibly be intepreted as a valid close comment tag in very old browsers (e.g., firefox 3.6), as specified in the html4 spec
	        // Reference: http://www.w3.org/TR/html401/intro/sgmltut.html#h-3.2.4
	        yc: function yc(s) {
	            return strReplace(s, SPECIAL_COMMENT_CHARS, function (m) {
	                return m === '\x00' ? '�' : m === '--!' || m === '--' || m === '-' || m === ']' ? m + ' ' : /*
	                                                                                                            :  m === ']>'   ? '] >'
	                                                                                                            :  m === '-->'  ? '-- >'
	                                                                                                            :  m === '--!>' ? '--! >'
	                                                                                                            : /-*!?>/.test(m) ? */m.slice(0, -1) + ' >';
	            });
	        },

	        // FOR DETAILS, refer to inDoubleQuotedAttr()
	        // Reference: https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(double-quoted)-state
	        yavd: function yavd(s) {
	            return strReplace(s, QUOT, '&quot;');
	        },

	        // FOR DETAILS, refer to inSingleQuotedAttr()
	        // Reference: https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(single-quoted)-state
	        yavs: function yavs(s) {
	            return strReplace(s, SQUOT, '&#39;');
	        },

	        // FOR DETAILS, refer to inUnQuotedAttr()
	        // PART A.
	        // if s contains any state breaking chars (\t, \n, \v, \f, \r, space, and >),
	        // they are escaped and encoded into their equivalent HTML entity representations.
	        // Reference: http://shazzer.co.uk/database/All/Characters-which-break-attributes-without-quotes
	        // Reference: https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(unquoted)-state
	        //
	        // PART B.
	        // if s starts with ', " or `, encode it resp. as &#39;, &quot;, or &#96; to
	        // enforce the attr value (unquoted) state
	        // Reference: https://html.spec.whatwg.org/multipage/syntax.html#before-attribute-value-state
	        // Reference: http://shazzer.co.uk/vector/Characters-allowed-attribute-quote
	        //
	        // PART C.
	        // Inject a \uFFFD character if an empty or all null string is encountered in
	        // unquoted attribute value state.
	        //
	        // Rationale 1: our belief is that developers wouldn't expect an
	        //   empty string would result in ' name="passwd"' rendered as
	        //   attribute value, even though this is how HTML5 is specified.
	        // Rationale 2: an empty or all null string (for IE) can
	        //   effectively alter its immediate subsequent state, we choose
	        //   \uFFFD to end the unquoted attr
	        //   state, which therefore will not mess up later contexts.
	        // Rationale 3: Since IE 6, it is verified that NULL chars are stripped.
	        // Reference: https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(unquoted)-state
	        //
	        // Example:
	        // <input value={{{yavu s}}} name="passwd"/>
	        yavu: function yavu(s) {
	            return strReplace(s, SPECIAL_ATTR_VALUE_UNQUOTED_CHARS, function (m) {
	                return m === '\t' ? '&#9;' // in hex: 09
	                : m === '\n' ? '&#10;' // in hex: 0A
	                : m === '\x0B' ? '&#11;' // in hex: 0B  for IE. IE<9 \v equals v, so use \x0B instead
	                : m === '\f' ? '&#12;' // in hex: 0C
	                : m === '\r' ? '&#13;' // in hex: 0D
	                : m === ' ' ? '&#32;' // in hex: 20
	                : m === '=' ? '&#61;' // in hex: 3D
	                : m === '<' ? '&lt;' : m === '>' ? '&gt;' : m === '"' ? '&quot;' : m === "'" ? '&#39;' : m === '`' ? '&#96;' : /*empty or null*/'�';
	            });
	        },

	        yu: encodeURI,
	        yuc: encodeURIComponent,

	        // Notice that yubl MUST BE APPLIED LAST, and will not be used independently (expected output from encodeURI/encodeURIComponent and yavd/yavs/yavu)
	        // This is used to disable JS execution capabilities by prefixing x- to ^javascript:, ^vbscript: or ^data: that possibly could trigger script execution in URI attribute context
	        yubl: function yubl(s) {
	            return URI_BLACKLIST_PROTOCOLS[x.yup(s)] ? 'x-' + s : s;
	        },

	        // This is NOT a security-critical filter.
	        // Reference: https://tools.ietf.org/html/rfc3986
	        yufull: function yufull(s) {
	            return x.yu(s).replace(URL_IPV6, function (m, p) {
	                return '//[' + p + ']';
	            });
	        },

	        // chain yufull() with yubl()
	        yublf: function yublf(s) {
	            return x.yubl(x.yufull(s));
	        },

	        // The design principle of the CSS filter MUST meet the following goal(s).
	        // (1) The input cannot break out of the context (expr) and this is to fulfill the just sufficient encoding principle.
	        // (2) The input cannot introduce CSS parsing error and this is to address the concern of UI redressing.
	        //
	        // term
	        //   : unary_operator?
	        //     [ NUMBER S* | PERCENTAGE S* | LENGTH S* | EMS S* | EXS S* | ANGLE S* |
	        //     TIME S* | FREQ S* ]
	        //   | STRING S* | IDENT S* | URI S* | hexcolor | function
	        //
	        // Reference:
	        // * http://www.w3.org/TR/CSS21/grammar.html
	        // * http://www.w3.org/TR/css-syntax-3/
	        //
	        // NOTE: delimiter in CSS -  \  _  :  ;  (  )  "  '  /  ,  %  #  !  *  @  .  {  }
	        //                        2d 5c 5f 3a 3b 28 29 22 27 2f 2c 25 23 21 2a 40 2e 7b 7d

	        yceu: function yceu(s) {
	            s = htmlDecode(s);
	            return CSS_VALID_VALUE.test(s) ? s : ";-x:'" + cssBlacklist(s.replace(CSS_SINGLE_QUOTED_CHARS, cssEncode)) + "';-v:";
	        },

	        // string1 = \"([^\n\r\f\\"]|\\{nl}|\\[^\n\r\f0-9a-f]|\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)*\"
	        yced: function yced(s) {
	            return cssBlacklist(htmlDecode(s).replace(CSS_DOUBLE_QUOTED_CHARS, cssEncode));
	        },

	        // string2 = \'([^\n\r\f\\']|\\{nl}|\\[^\n\r\f0-9a-f]|\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)*\'
	        yces: function yces(s) {
	            return cssBlacklist(htmlDecode(s).replace(CSS_SINGLE_QUOTED_CHARS, cssEncode));
	        },

	        // for url({{{yceuu url}}}
	        // unquoted_url = ([!#$%&*-~]|\\{h}{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])* (CSS 2.1 definition)
	        // unquoted_url = ([^"'()\\ \t\n\r\f\v\u0000\u0008\u000b\u000e-\u001f\u007f]|\\{h}{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])* (CSS 3.0 definition)
	        // The state machine in CSS 3.0 is more well defined - http://www.w3.org/TR/css-syntax-3/#consume-a-url-token0
	        // CSS_UNQUOTED_URL = /['\(\)]/g; // " \ treated by encodeURI()  
	        yceuu: function yceuu(s) {
	            return cssUrl(s).replace(CSS_UNQUOTED_URL, function (chr) {
	                return chr === '\'' ? '\\27 ' : chr === '(' ? '%28' :
	                /* chr === ')' ? */'%29';
	            });
	        },

	        // for url("{{{yceud url}}}
	        yceud: function yceud(s) {
	            return cssUrl(s);
	        },

	        // for url('{{{yceus url}}}
	        yceus: function yceus(s) {
	            return cssUrl(s).replace(SQUOT, '\\27 ');
	        }
	    };
	};

	// exposing privFilters
	// this is an undocumented feature, and please use it with extra care
	var privFilters = exports._privFilters = exports._getPrivFilters();

	/* chaining filters */

	// uriInAttr and literally uriPathInAttr
	// yubl is always used
	// Rationale: given pattern like this: <a href="{{{uriPathInDoubleQuotedAttr s}}}">
	//            developer may expect s is always prefixed with ? or /, but an attacker can abuse it with 'javascript:alert(1)'
	function uriInAttr(s, yav, yu) {
	    return privFilters.yubl(yav((yu || privFilters.yufull)(s)));
	}

	/** 
	* Yahoo Secure XSS Filters - just sufficient output filtering to prevent XSS!
	* @module xss-filters 
	*/

	/**
	* @function module:xss-filters#inHTMLData
	*
	* @param {string} s - An untrusted user input
	* @returns {string} The string s with '<' encoded as '&amp;lt;'
	*
	* @description
	* This filter is to be placed in HTML Data context to encode all '<' characters into '&amp;lt;'
	* <ul>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#data-state">HTML5 Data State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <div>{{{inHTMLData htmlData}}}</div>
	*
	*/
	exports.inHTMLData = privFilters.yd;

	/**
	* @function module:xss-filters#inHTMLComment
	*
	* @param {string} s - An untrusted user input
	* @returns {string} All NULL characters in s are first replaced with \uFFFD. If s contains -->, --!>, or starts with -*>, insert a space right before > to stop state breaking at <!--{{{yc s}}}-->. If s ends with --!, --, or -, append a space to stop collaborative state breaking at {{{yc s}}}>, {{{yc s}}}!>, {{{yc s}}}-!>, {{{yc s}}}->. If s contains ]> or ends with ], append a space after ] is verified in IE to stop IE conditional comments.
	*
	* @description
	* This filter is to be placed in HTML Comment context
	* <ul>
	* <li><a href="http://shazzer.co.uk/vector/Characters-that-close-a-HTML-comment-3">Shazzer - Closing comments for -.-></a>
	* <li><a href="http://shazzer.co.uk/vector/Characters-that-close-a-HTML-comment">Shazzer - Closing comments for --.></a>
	* <li><a href="http://shazzer.co.uk/vector/Characters-that-close-a-HTML-comment-0021">Shazzer - Closing comments for .></a>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#comment-start-state">HTML5 Comment Start State</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#comment-start-dash-state">HTML5 Comment Start Dash State</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#comment-state">HTML5 Comment State</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#comment-end-dash-state">HTML5 Comment End Dash State</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#comment-end-state">HTML5 Comment End State</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#comment-end-bang-state">HTML5 Comment End Bang State</a></li>
	* <li><a href="http://msdn.microsoft.com/en-us/library/ms537512%28v=vs.85%29.aspx">Conditional Comments in Internet Explorer</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <!-- {{{inHTMLComment html_comment}}} -->
	*
	*/
	exports.inHTMLComment = privFilters.yc;

	/**
	* @function module:xss-filters#inSingleQuotedAttr
	*
	* @param {string} s - An untrusted user input
	* @returns {string} The string s with any single-quote characters encoded into '&amp;&#39;'.
	*
	* @description
	* <p class="warning">Warning: This is NOT designed for any onX (e.g., onclick) attributes!</p>
	* <p class="warning">Warning: If you're working on URI/components, use the more specific uri___InSingleQuotedAttr filter </p>
	* This filter is to be placed in HTML Attribute Value (single-quoted) state to encode all single-quote characters into '&amp;&#39;'
	*
	* <ul>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(single-quoted)-state">HTML5 Attribute Value (Single-Quoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <input name='firstname' value='{{{inSingleQuotedAttr firstname}}}' />
	*
	*/
	exports.inSingleQuotedAttr = privFilters.yavs;

	/**
	* @function module:xss-filters#inDoubleQuotedAttr
	*
	* @param {string} s - An untrusted user input
	* @returns {string} The string s with any single-quote characters encoded into '&amp;&quot;'.
	*
	* @description
	* <p class="warning">Warning: This is NOT designed for any onX (e.g., onclick) attributes!</p>
	* <p class="warning">Warning: If you're working on URI/components, use the more specific uri___InDoubleQuotedAttr filter </p>
	* This filter is to be placed in HTML Attribute Value (double-quoted) state to encode all single-quote characters into '&amp;&quot;'
	*
	* <ul>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(double-quoted)-state">HTML5 Attribute Value (Double-Quoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <input name="firstname" value="{{{inDoubleQuotedAttr firstname}}}" />
	*
	*/
	exports.inDoubleQuotedAttr = privFilters.yavd;

	/**
	* @function module:xss-filters#inUnQuotedAttr
	*
	* @param {string} s - An untrusted user input
	* @returns {string} If s contains any state breaking chars (\t, \n, \v, \f, \r, space, null, ', ", `, <, >, and =), they are escaped and encoded into their equivalent HTML entity representations. If the string is empty, inject a \uFFFD character.
	*
	* @description
	* <p class="warning">Warning: This is NOT designed for any onX (e.g., onclick) attributes!</p>
	* <p class="warning">Warning: If you're working on URI/components, use the more specific uri___InUnQuotedAttr filter </p>
	* <p>Regarding \uFFFD injection, given <a id={{{id}}} name="passwd">,<br/>
	*        Rationale 1: our belief is that developers wouldn't expect when id equals an
	*          empty string would result in ' name="passwd"' rendered as 
	*          attribute value, even though this is how HTML5 is specified.<br/>
	*        Rationale 2: an empty or all null string (for IE) can 
	*          effectively alter its immediate subsequent state, we choose
	*          \uFFFD to end the unquoted attr 
	*          state, which therefore will not mess up later contexts.<br/>
	*        Rationale 3: Since IE 6, it is verified that NULL chars are stripped.<br/>
	*        Reference: https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(unquoted)-state</p>
	* <ul>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(unquoted)-state">HTML5 Attribute Value (Unquoted) State</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#before-attribute-value-state">HTML5 Before Attribute Value State</a></li>
	* <li><a href="http://shazzer.co.uk/database/All/Characters-which-break-attributes-without-quotes">Shazzer - Characters-which-break-attributes-without-quotes</a></li>
	* <li><a href="http://shazzer.co.uk/vector/Characters-allowed-attribute-quote">Shazzer - Characters-allowed-attribute-quote</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <input name="firstname" value={{{inUnQuotedAttr firstname}}} />
	*
	*/
	exports.inUnQuotedAttr = privFilters.yavu;

	/**
	* @function module:xss-filters#uriInSingleQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly an <strong>absolute</strong> URI
	* @returns {string} The string s encoded first by window.encodeURI(), then inSingleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (single-quoted) state for an <strong>absolute</strong> URI.<br/>
	* The correct order of encoders is thus: first window.encodeURI(), then inSingleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* <p>Notice: This filter is IPv6 friendly by not encoding '[' and ']'.</p>
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI">encodeURI | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(single-quoted)-state">HTML5 Attribute Value (Single-Quoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href='{{{uriInSingleQuotedAttr full_uri}}}'>link</a>
	* 
	*/
	exports.uriInSingleQuotedAttr = function (s) {
	    return uriInAttr(s, privFilters.yavs);
	};

	/**
	* @function module:xss-filters#uriInDoubleQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly an <strong>absolute</strong> URI
	* @returns {string} The string s encoded first by window.encodeURI(), then inDoubleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (double-quoted) state for an <strong>absolute</strong> URI.<br/>
	* The correct order of encoders is thus: first window.encodeURI(), then inDoubleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* <p>Notice: This filter is IPv6 friendly by not encoding '[' and ']'.</p>
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI">encodeURI | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(double-quoted)-state">HTML5 Attribute Value (Double-Quoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href="{{{uriInDoubleQuotedAttr full_uri}}}">link</a>
	* 
	*/
	exports.uriInDoubleQuotedAttr = function (s) {
	    return uriInAttr(s, privFilters.yavd);
	};

	/**
	* @function module:xss-filters#uriInUnQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly an <strong>absolute</strong> URI
	* @returns {string} The string s encoded first by window.encodeURI(), then inUnQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (unquoted) state for an <strong>absolute</strong> URI.<br/>
	* The correct order of encoders is thus: first the built-in encodeURI(), then inUnQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* <p>Notice: This filter is IPv6 friendly by not encoding '[' and ']'.</p>
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI">encodeURI | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(unquoted)-state">HTML5 Attribute Value (Unquoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href={{{uriInUnQuotedAttr full_uri}}}>link</a>
	* 
	*/
	exports.uriInUnQuotedAttr = function (s) {
	    return uriInAttr(s, privFilters.yavu);
	};

	/**
	* @function module:xss-filters#uriInHTMLData
	*
	* @param {string} s - An untrusted user input, supposedly an <strong>absolute</strong> URI
	* @returns {string} The string s encoded by window.encodeURI() and then inHTMLData()
	*
	* @description
	* This filter is to be placed in HTML Data state for an <strong>absolute</strong> URI.
	*
	* <p>Notice: The actual implementation skips inHTMLData(), since '<' is already encoded as '%3C' by encodeURI().</p>
	* <p>Notice: This filter is IPv6 friendly by not encoding '[' and ']'.</p>
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI">encodeURI | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#data-state">HTML5 Data State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href="/somewhere">{{{uriInHTMLData full_uri}}}</a>
	* 
	*/
	exports.uriInHTMLData = privFilters.yufull;

	/**
	* @function module:xss-filters#uriInHTMLComment
	*
	* @param {string} s - An untrusted user input, supposedly an <strong>absolute</strong> URI
	* @returns {string} The string s encoded by window.encodeURI(), and finally inHTMLComment()
	*
	* @description
	* This filter is to be placed in HTML Comment state for an <strong>absolute</strong> URI.
	*
	* <p>Notice: This filter is IPv6 friendly by not encoding '[' and ']'.</p>
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI">encodeURI | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#data-state">HTML5 Data State</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#comment-state">HTML5 Comment State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <!-- {{{uriInHTMLComment full_uri}}} -->
	* 
	*/
	exports.uriInHTMLComment = function (s) {
	    return privFilters.yc(privFilters.yufull(s));
	};

	/**
	* @function module:xss-filters#uriPathInSingleQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly a URI Path/Query or relative URI
	* @returns {string} The string s encoded first by window.encodeURI(), then inSingleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (single-quoted) state for a URI Path/Query or relative URI.<br/>
	* The correct order of encoders is thus: first window.encodeURI(), then inSingleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI">encodeURI | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(single-quoted)-state">HTML5 Attribute Value (Single-Quoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href='http://example.com/{{{uriPathInSingleQuotedAttr uri_path}}}'>link</a>
	* <a href='http://example.com/?{{{uriQueryInSingleQuotedAttr uri_query}}}'>link</a>
	* 
	*/
	exports.uriPathInSingleQuotedAttr = function (s) {
	    return uriInAttr(s, privFilters.yavs, privFilters.yu);
	};

	/**
	* @function module:xss-filters#uriPathInDoubleQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly a URI Path/Query or relative URI
	* @returns {string} The string s encoded first by window.encodeURI(), then inDoubleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (double-quoted) state for a URI Path/Query or relative URI.<br/>
	* The correct order of encoders is thus: first window.encodeURI(), then inDoubleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI">encodeURI | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(double-quoted)-state">HTML5 Attribute Value (Double-Quoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href="http://example.com/{{{uriPathInDoubleQuotedAttr uri_path}}}">link</a>
	* <a href="http://example.com/?{{{uriQueryInDoubleQuotedAttr uri_query}}}">link</a>
	* 
	*/
	exports.uriPathInDoubleQuotedAttr = function (s) {
	    return uriInAttr(s, privFilters.yavd, privFilters.yu);
	};

	/**
	* @function module:xss-filters#uriPathInUnQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly a URI Path/Query or relative URI
	* @returns {string} The string s encoded first by window.encodeURI(), then inUnQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (unquoted) state for a URI Path/Query or relative URI.<br/>
	* The correct order of encoders is thus: first the built-in encodeURI(), then inUnQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI">encodeURI | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(unquoted)-state">HTML5 Attribute Value (Unquoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href=http://example.com/{{{uriPathInUnQuotedAttr uri_path}}}>link</a>
	* <a href=http://example.com/?{{{uriQueryInUnQuotedAttr uri_query}}}>link</a>
	* 
	*/
	exports.uriPathInUnQuotedAttr = function (s) {
	    return uriInAttr(s, privFilters.yavu, privFilters.yu);
	};

	/**
	* @function module:xss-filters#uriPathInHTMLData
	*
	* @param {string} s - An untrusted user input, supposedly a URI Path/Query or relative URI
	* @returns {string} The string s encoded by window.encodeURI() and then inHTMLData()
	*
	* @description
	* This filter is to be placed in HTML Data state for a URI Path/Query or relative URI.
	*
	* <p>Notice: The actual implementation skips inHTMLData(), since '<' is already encoded as '%3C' by encodeURI().</p>
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI">encodeURI | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#data-state">HTML5 Data State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href="http://example.com/">http://example.com/{{{uriPathInHTMLData uri_path}}}</a>
	* <a href="http://example.com/">http://example.com/?{{{uriQueryInHTMLData uri_query}}}</a>
	* 
	*/
	exports.uriPathInHTMLData = privFilters.yu;

	/**
	* @function module:xss-filters#uriPathInHTMLComment
	*
	* @param {string} s - An untrusted user input, supposedly a URI Path/Query or relative URI
	* @returns {string} The string s encoded by window.encodeURI(), and finally inHTMLComment()
	*
	* @description
	* This filter is to be placed in HTML Comment state for a URI Path/Query or relative URI.
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI">encodeURI | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#data-state">HTML5 Data State</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#comment-state">HTML5 Comment State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <!-- http://example.com/{{{uriPathInHTMLComment uri_path}}} -->
	* <!-- http://example.com/?{{{uriQueryInHTMLComment uri_query}}} -->
	*/
	exports.uriPathInHTMLComment = function (s) {
	    return privFilters.yc(privFilters.yu(s));
	};

	/**
	* @function module:xss-filters#uriQueryInSingleQuotedAttr
	* @description This is an alias of {@link module:xss-filters#uriPathInSingleQuotedAttr}
	* 
	* @alias module:xss-filters#uriPathInSingleQuotedAttr
	*/
	exports.uriQueryInSingleQuotedAttr = exports.uriPathInSingleQuotedAttr;

	/**
	* @function module:xss-filters#uriQueryInDoubleQuotedAttr
	* @description This is an alias of {@link module:xss-filters#uriPathInDoubleQuotedAttr}
	* 
	* @alias module:xss-filters#uriPathInDoubleQuotedAttr
	*/
	exports.uriQueryInDoubleQuotedAttr = exports.uriPathInDoubleQuotedAttr;

	/**
	* @function module:xss-filters#uriQueryInUnQuotedAttr
	* @description This is an alias of {@link module:xss-filters#uriPathInUnQuotedAttr}
	* 
	* @alias module:xss-filters#uriPathInUnQuotedAttr
	*/
	exports.uriQueryInUnQuotedAttr = exports.uriPathInUnQuotedAttr;

	/**
	* @function module:xss-filters#uriQueryInHTMLData
	* @description This is an alias of {@link module:xss-filters#uriPathInHTMLData}
	* 
	* @alias module:xss-filters#uriPathInHTMLData
	*/
	exports.uriQueryInHTMLData = exports.uriPathInHTMLData;

	/**
	* @function module:xss-filters#uriQueryInHTMLComment
	* @description This is an alias of {@link module:xss-filters#uriPathInHTMLComment}
	* 
	* @alias module:xss-filters#uriPathInHTMLComment
	*/
	exports.uriQueryInHTMLComment = exports.uriPathInHTMLComment;

	/**
	* @function module:xss-filters#uriComponentInSingleQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly a URI Component
	* @returns {string} The string s encoded first by window.encodeURIComponent(), then inSingleQuotedAttr()
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (single-quoted) state for a URI Component.<br/>
	* The correct order of encoders is thus: first window.encodeURIComponent(), then inSingleQuotedAttr()
	*
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent">encodeURIComponent | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(single-quoted)-state">HTML5 Attribute Value (Single-Quoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href='http://example.com/?q={{{uriComponentInSingleQuotedAttr uri_component}}}'>link</a>
	* 
	*/
	exports.uriComponentInSingleQuotedAttr = function (s) {
	    return privFilters.yavs(privFilters.yuc(s));
	};

	/**
	* @function module:xss-filters#uriComponentInDoubleQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly a URI Component
	* @returns {string} The string s encoded first by window.encodeURIComponent(), then inDoubleQuotedAttr()
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (double-quoted) state for a URI Component.<br/>
	* The correct order of encoders is thus: first window.encodeURIComponent(), then inDoubleQuotedAttr()
	*
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent">encodeURIComponent | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(double-quoted)-state">HTML5 Attribute Value (Double-Quoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href="http://example.com/?q={{{uriComponentInDoubleQuotedAttr uri_component}}}">link</a>
	* 
	*/
	exports.uriComponentInDoubleQuotedAttr = function (s) {
	    return privFilters.yavd(privFilters.yuc(s));
	};

	/**
	* @function module:xss-filters#uriComponentInUnQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly a URI Component
	* @returns {string} The string s encoded first by window.encodeURIComponent(), then inUnQuotedAttr()
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (unquoted) state for a URI Component.<br/>
	* The correct order of encoders is thus: first the built-in encodeURIComponent(), then inUnQuotedAttr()
	*
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent">encodeURIComponent | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(unquoted)-state">HTML5 Attribute Value (Unquoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href=http://example.com/?q={{{uriComponentInUnQuotedAttr uri_component}}}>link</a>
	* 
	*/
	exports.uriComponentInUnQuotedAttr = function (s) {
	    return privFilters.yavu(privFilters.yuc(s));
	};

	/**
	* @function module:xss-filters#uriComponentInHTMLData
	*
	* @param {string} s - An untrusted user input, supposedly a URI Component
	* @returns {string} The string s encoded by window.encodeURIComponent() and then inHTMLData()
	*
	* @description
	* This filter is to be placed in HTML Data state for a URI Component.
	*
	* <p>Notice: The actual implementation skips inHTMLData(), since '<' is already encoded as '%3C' by encodeURIComponent().</p>
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent">encodeURIComponent | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#data-state">HTML5 Data State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href="http://example.com/">http://example.com/?q={{{uriComponentInHTMLData uri_component}}}</a>
	* <a href="http://example.com/">http://example.com/#{{{uriComponentInHTMLData uri_fragment}}}</a>
	* 
	*/
	exports.uriComponentInHTMLData = privFilters.yuc;

	/**
	* @function module:xss-filters#uriComponentInHTMLComment
	*
	* @param {string} s - An untrusted user input, supposedly a URI Component
	* @returns {string} The string s encoded by window.encodeURIComponent(), and finally inHTMLComment()
	*
	* @description
	* This filter is to be placed in HTML Comment state for a URI Component.
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent">encodeURIComponent | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#data-state">HTML5 Data State</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#comment-state">HTML5 Comment State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <!-- http://example.com/?q={{{uriComponentInHTMLComment uri_component}}} -->
	* <!-- http://example.com/#{{{uriComponentInHTMLComment uri_fragment}}} -->
	*/
	exports.uriComponentInHTMLComment = function (s) {
	    return privFilters.yc(privFilters.yuc(s));
	};

	// uriFragmentInSingleQuotedAttr
	// added yubl on top of uriComponentInAttr
	// Rationale: given pattern like this: <a href='{{{uriFragmentInSingleQuotedAttr s}}}'>
	//            developer may expect s is always prefixed with #, but an attacker can abuse it with 'javascript:alert(1)'

	/**
	* @function module:xss-filters#uriFragmentInSingleQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly a URI Fragment
	* @returns {string} The string s encoded first by window.encodeURIComponent(), then inSingleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (single-quoted) state for a URI Fragment.<br/>
	* The correct order of encoders is thus: first window.encodeURIComponent(), then inSingleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent">encodeURIComponent | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(single-quoted)-state">HTML5 Attribute Value (Single-Quoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href='http://example.com/#{{{uriFragmentInSingleQuotedAttr uri_fragment}}}'>link</a>
	* 
	*/
	exports.uriFragmentInSingleQuotedAttr = function (s) {
	    return privFilters.yubl(privFilters.yavs(privFilters.yuc(s)));
	};

	// uriFragmentInDoubleQuotedAttr
	// added yubl on top of uriComponentInAttr
	// Rationale: given pattern like this: <a href="{{{uriFragmentInDoubleQuotedAttr s}}}">
	//            developer may expect s is always prefixed with #, but an attacker can abuse it with 'javascript:alert(1)'

	/**
	* @function module:xss-filters#uriFragmentInDoubleQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly a URI Fragment
	* @returns {string} The string s encoded first by window.encodeURIComponent(), then inDoubleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (double-quoted) state for a URI Fragment.<br/>
	* The correct order of encoders is thus: first window.encodeURIComponent(), then inDoubleQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent">encodeURIComponent | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(double-quoted)-state">HTML5 Attribute Value (Double-Quoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href="http://example.com/#{{{uriFragmentInDoubleQuotedAttr uri_fragment}}}">link</a>
	* 
	*/
	exports.uriFragmentInDoubleQuotedAttr = function (s) {
	    return privFilters.yubl(privFilters.yavd(privFilters.yuc(s)));
	};

	// uriFragmentInUnQuotedAttr
	// added yubl on top of uriComponentInAttr
	// Rationale: given pattern like this: <a href={{{uriFragmentInUnQuotedAttr s}}}>
	//            developer may expect s is always prefixed with #, but an attacker can abuse it with 'javascript:alert(1)'

	/**
	* @function module:xss-filters#uriFragmentInUnQuotedAttr
	*
	* @param {string} s - An untrusted user input, supposedly a URI Fragment
	* @returns {string} The string s encoded first by window.encodeURIComponent(), then inUnQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* @description
	* This filter is to be placed in HTML Attribute Value (unquoted) state for a URI Fragment.<br/>
	* The correct order of encoders is thus: first the built-in encodeURIComponent(), then inUnQuotedAttr(), and finally prefix the resulted string with 'x-' if it begins with 'javascript:' or 'vbscript:' that could possibly lead to script execution
	*
	* <ul>
	* <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent">encodeURIComponent | MDN</a></li>
	* <li><a href="http://tools.ietf.org/html/rfc3986">RFC 3986</a></li>
	* <li><a href="https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(unquoted)-state">HTML5 Attribute Value (Unquoted) State</a></li>
	* </ul>
	*
	* @example
	* // output context to be applied by this filter.
	* <a href=http://example.com/#{{{uriFragmentInUnQuotedAttr uri_fragment}}}>link</a>
	* 
	*/
	exports.uriFragmentInUnQuotedAttr = function (s) {
	    return privFilters.yubl(privFilters.yavu(privFilters.yuc(s)));
	};

	/**
	* @function module:xss-filters#uriFragmentInHTMLData
	* @description This is an alias of {@link module:xss-filters#uriComponentInHTMLData}
	* 
	* @alias module:xss-filters#uriComponentInHTMLData
	*/
	exports.uriFragmentInHTMLData = exports.uriComponentInHTMLData;

	/**
	* @function module:xss-filters#uriFragmentInHTMLComment
	* @description This is an alias of {@link module:xss-filters#uriComponentInHTMLComment}
	* 
	* @alias module:xss-filters#uriComponentInHTMLComment
	*/
	exports.uriFragmentInHTMLComment = exports.uriComponentInHTMLComment;

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = "## 基础\r\n看这份教程，默认你学过 Gulp 和 Webpack. 如果没有学过，可以稍微学一下，并能自己成功打包个demo. 然后，再继续看下面的内容。\r\n\r\n## 选择Gulp + Webpack\r\nWebpack 是必选的，因为项目中文件的依赖关系是它处理的。它本身就是一个很好的打包工具。那么，为什么还要把 Gulp 也用上呢？因为 Gulp 可以很灵活地组织打包流程，而且对于文件的复制、删除、合并等操作，它也很擅长。这些是 Webpack 目前还没做到的。或者说， Webpack 提供的是标准化的文件依赖打包流程。两者的出发点不一样。那么 MYUI 的打包工具，是怎么一步步搭起来的呢？来，每一步的组成，我都会细细说明，有好的想法，也欢迎跟我们联系。我们一起努力做得更好。\r\n\r\n首先，我们是用 Gulp 作为打包的骨架。而 Webpack 是用 `gulp-webpack` 作为 Gulp 的一个插件来工作的。\r\n\r\n## 搭 Gulp 骨架\r\n下面，我们开始讲解，整个打包工具的骨架。\r\n### 让 Gulp 支持在 Es6 下工作\r\n1. 把根目录的 `gulpfile.js` 重命名为 `gulpfile.babel.js`\r\n2. `npm i babel-core babel-preset-es2015 -D` 引入 `babel-core` 和 `babel-preset-es2015` 这两个npm包（这里说明下，i 是 install 的简写， -D 是 --save-dev 的简写）\r\n3. 在 `package.json` 加入对 Es2015 的支持：\r\n    ```javascript\r\n\t\"babel\": {\r\n        \"presets\": [\r\n            \"es2015\"\r\n        ]\r\n    }\r\n\t```\r\n### 打包任务，分文件处理\r\n一个打包工具，需要处理很多的打包任务，肯定不能把所有的工作，都放在 `gulpfile.babel.js` 这一个文件里面。所以，我们把 `gulpfile.babel.js` 作为总调度，其它具体任务放在具体的指定文件。这里，在项目根目录创建一个 `package/core` 来放这些具体执行打包任务文件。比如，`pack/core/base.js` 用来打包项目的 vendor 公用基础包。 具体做法：\r\n\r\n1. 安装 `npm i require-dir -D` 它能搜寻指定目录下的js文件，把里面的 `gulp.task('xxx')` 任务都找到。\r\n2. 对于具体执行任务的 `package/core` 目录下的文件，比如，我们定义它的task名是core.base. 于是，`package/core/base.js`里面的入口是这样的：\r\n\t```js\r\n\tgulp.task('core.task', ()=>{});\r\n\t```\r\n\r\n3. 在总调度 `gulpfile.bebel.js` 中：\r\n\t```javascript\r\n\tconst gulp = require('gulp'),\r\n \t\trequireDir = require('require-dir');\r\n \trequireDir('./package/core', {recurse: false}); // 不递归往文件夹里继续找\r\n\tgulp.task('base', ['core.base']);\r\n\t```\r\n\r\n这样，当我们在命令行敲入 `gulp base` 时，实际是执行了 `package/core/base.js` 下的任务。达到了任务分文件的目的。\r\n\r\n### 串行执行任务\r\ngulp 中，它执行任务都是并行的。但是，有时候，我们的任务确实需要串行执行。 这个时候，你需要一个npm包 `gulp-sequence`. 好了，我们刚才说，`package/core/base.js` 是用来打包项目公用文件的，那么一般都会有分js和css两个文件，比如：`vendor.js` 和 `vendor.css`。 此时，我们一般会把这两个任务分开处理。这里假设，打包js的任务必须先执行，那么具体怎么做呢？\r\n1. 首先，安装npm包 `npm i gulp-sequence -D`\r\n2. `package/core/base.js` 中：\r\n\t\r\n\t```javascript\r\n\tconst gulp = require('gulp'),\r\n\t\tSequence = require('gulp-sequence');\r\n\tgulp.task('core.base:js', (cb) => {});\r\n\tgulp.task('core.base:css', (cb) => {});\r\n\tgulp.task('core.base', (cb) => {\r\n\t\tSequence('core.base:js', 'core.base:css', cb);\r\n\t});\r\n\t```\r\n\r\n至此，整个项目的打包骨架，搭起来了。对于 `gulp-webpack` 这个npm包的使用，这里就没有谈了。可以直接看官方的教程。\r\n\r\n## 对我很有用的 npm 包\r\n### 读取命令参数\r\n我们再拿 `package/core/base.js` 来说，我们打包这个公共基础。有时候，我们希望打包出来的是压缩版；有时候，为了调试，我们有希望打包出来的是未压缩版的。而且，我们希望，对于基础包的处理，都通过 `gulp base` 这条命令来处理，那么，我们就需要引入参数。比如，默认情况下，我们打包的压缩版，如果输入的是 `gulp base --dev`，那么就打一个未压缩版的。 那么就需要这个npm包：\r\n\r\n1. `npm i yargs -D`\r\n\r\n### 更换html中的链接地址\r\n这个需求，很常见，当我们开发的项目要上线时。我们一般会把里面的静态资源 img, js, css 替换成线上地址。那么：\r\n\r\n1. `npm i gulp-prefix -D`\r\n\r\n### 让html中，指定的 js, css 文件内嵌\r\n这个需求，一般也来自项目要上线。为了减少 http 请求，我们会把小的 css 和 js 内嵌在 html 里面。那么：\r\n1. `npm i gulp-htmlone -D`\r\n\r\n### 所见即所得 —— 浏览器实时刷新\r\n对于 react.js 来讲，有很好的一套 hmd 机制，能够实现局部实时更新。当然，它只能在当你改动 react 对应的模块时，才能生效。如果我们修改 html 文件，就不能实时刷新了。所以，为了让浏览器根据我们指定文件修改后，进行刷新，我们采用了 `browser-sync` 这个 npm 包。 它有两种模式：指定服务器根目录和指定代理。当你本地开发，还没跟接口联调的时候，你可以使用“指定服务器根目录”来工作。当你，进入了跟接口联调的时候，就可以开启“指定代理”模式来工作，这样才能取到它们的数据。这里，我把核心配置分享下：\r\n\r\n1. 首先，安装npm包 `npm i browser-sync -D`\r\n2. 你具体的打包文件中：\r\n\r\n\t```javascript\r\n\tconst gulp = require('gulp'),\r\n\t    browserSync = require('browser-sync').create();\r\n\t\r\n\t// Static Server + watching\r\n\tgulp.task('core.dev:hot', () => {\r\n\t\tvar serveCfg = {};\r\n\t\tif (useProxy) { // useProxy 的条件你自己写\r\n\t\t\tserveCfg.proxy = config.vhost; // 使用代理\r\n\t\t} else {\r\n\t\t\tserveCfg.server = './'; // 使用本地目录\r\n\t\t}\r\n\t    browserSync.init(serveCfg);\r\n\t\r\n\t    gulp.watch([SRC.views + '/*.*', DIST.path + '/**/*']).on('change', browserSync.reload); // 前面监听的文件，根据你项目的需要自己写：）\r\n\t});\r\n\t```\r\n\r\n## 总结\r\n这份打包工具，核心的干货就在这里啦。希望对你有帮助，让前端自动化帮你在开发中，提高效率。"

/***/ }
/******/ ]);