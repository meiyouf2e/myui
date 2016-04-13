//JSON
(function(global, doc, undef) {
	'use strict';

	if (typeof global.JSON !== 'object') {
		global.JSON = {};
	}

	var rx_one = /^[\],:{}\s]*$/,
		rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
		rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
		rx_four = /(?:^|:|,)(?:\s*\[)+/g,
		rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

	function f(n) {
		// Format integers to have at least two digits.
		return n < 10 ? '0' + n : n;
	}

	function this_value() {
		return this.valueOf();
	}

	if (typeof Date.prototype.toJSON !== 'function') {

		Date.prototype.toJSON = function() {

			return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' +
				f(this.getUTCMonth() + 1) + '-' +
				f(this.getUTCDate()) + 'T' +
				f(this.getUTCHours()) + ':' +
				f(this.getUTCMinutes()) + ':' +
				f(this.getUTCSeconds()) + 'Z' : null;
		};

		Boolean.prototype.toJSON = this_value;
		Number.prototype.toJSON = this_value;
		String.prototype.toJSON = this_value;
	}

	var gap,
		indent,
		meta,
		rep;


	function quote(string) {

		// If the string contains no control characters, no quote characters, and no
		// backslash characters, then we can safely slap some quotes around it.
		// Otherwise we must also replace the offending characters with safe escape
		// sequences.

		rx_escapable.lastIndex = 0;
		return rx_escapable.test(string) ? '"' + string.replace(rx_escapable, function(a) {
			var c = meta[a];
			return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}


	function str(key, holder) {

		// Produce a string from holder[key].

		var i, // The loop counter.
			k, // The member key.
			v, // The member value.
			length,
			mind = gap,
			partial,
			value = holder[key];

		// If the value has a toJSON method, call it to obtain a replacement value.

		if (value && typeof value === 'object' &&
			typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}

		// If we were called with a replacer function, then call the replacer to
		// obtain a replacement value.

		if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}

		// What happens next depends on the value's type.

		switch (typeof value) {
			case 'string':
				return quote(value);

			case 'number':

				// JSON numbers must be finite. Encode non-finite numbers as null.

				return isFinite(value) ? String(value) : 'null';

			case 'boolean':
			case 'null':

				// If the value is a boolean or null, convert it to a string. Note:
				// typeof null does not produce 'null'. The case is included here in
				// the remote chance that this gets fixed someday.

				return String(value);

				// If the type is 'object', we might be dealing with an object or an array or
				// null.

			case 'object':

				// Due to a specification blunder in ECMAScript, typeof null is 'object',
				// so watch out for that case.

				if (!value) {
					return 'null';
				}

				// Make an array to hold the partial results of stringifying this object value.

				gap += indent;
				partial = [];

				// Is the value an array?

				if (Object.prototype.toString.apply(value) === '[object Array]') {

					// The value is an array. Stringify every element. Use null as a placeholder
					// for non-JSON values.

					length = value.length;
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || 'null';
					}

					// Join all of the elements together, separated with commas, and wrap them in
					// brackets.

					v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
					gap = mind;
					return v;
				}

				// If the replacer is an array, use it to select the members to be stringified.

				if (rep && typeof rep === 'object') {
					length = rep.length;
					for (i = 0; i < length; i += 1) {
						if (typeof rep[i] === 'string') {
							k = rep[i];
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (
									gap ? ': ' : ':'
								) + v);
							}
						}
					}
				} else {

					// Otherwise, iterate through all of the keys in the object.

					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (
									gap ? ': ' : ':'
								) + v);
							}
						}
					}
				}

				// Join all of the member texts together, separated with commas,
				// and wrap them in braces.

				v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
				gap = mind;
				return v;
		}
	}

	// If the JSON object does not yet have a stringify method, give it one.
	if (typeof global.JSON.stringify !== 'function') {
		meta = { // table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"': '\\"',
			'\\': '\\\\'
		};
		JSON.stringify = function(value, replacer, space) {

			// The stringify method takes a value and an optional replacer, and an optional
			// space parameter, and returns a JSON text. The replacer can be a function
			// that can replace values, or an array of strings that will select the keys.
			// A default replacer method can be provided. Use of the space parameter can
			// produce text that is more easily readable.

			var i;
			gap = '';
			indent = '';

			// If the space parameter is a number, make an indent string containing that
			// many spaces.

			if (typeof space === 'number') {
				for (i = 0; i < space; i += 1) {
					indent += ' ';
				}

				// If the space parameter is a string, it will be used as the indent string.

			} else if (typeof space === 'string') {
				indent = space;
			}

			// If there is a replacer, it must be a function or an array.
			// Otherwise, throw an error.

			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
				(typeof replacer !== 'object' ||
					typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}

			// Make a fake root object containing our value under the key of ''.
			// Return the result of stringifying the value.

			return str('', {
				'': value
			});
		};
	}


	// If the JSON object does not yet have a parse method, give it one.
	if (typeof global.JSON.parse !== 'function') {
		JSON.parse = function(text, reviver) {

			// The parse method takes a text and an optional reviver function, and returns
			// a JavaScript value if the text is a valid JSON text.

			var j;

			function walk(holder, key) {

				// The walk method is used to recursively walk the resulting structure so
				// that modifications can be made.

				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}


			// Parsing happens in four stages. In the first stage, we replace certain
			// Unicode characters with escape sequences. JavaScript handles many characters
			// incorrectly, either silently deleting them, or treating them as line endings.

			text = String(text);
			rx_dangerous.lastIndex = 0;
			if (rx_dangerous.test(text)) {
				text = text.replace(rx_dangerous, function(a) {
					return '\\u' +
						('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}

			// In the second stage, we run the text against regular expressions that look
			// for non-JSON patterns. We are especially concerned with '()' and 'new'
			// because they can cause invocation, and '=' because it can cause mutation.
			// But just to be safe, we want to reject all unexpected forms.

			// We split the second stage into 4 regexp operations in order to work around
			// crippling inefficiencies in IE's and Safari's regexp engines. First we
			// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
			// replace all simple value tokens with ']' characters. Third, we delete all
			// open brackets that follow a colon or comma or that begin the text. Finally,
			// we look to see that the remaining characters are only whitespace or ']' or
			// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

			if (
				rx_one.test(
					text
					.replace(rx_two, '@')
					.replace(rx_three, ']')
					.replace(rx_four, '')
				)
			) {

				// In the third stage we use the eval function to compile the text into a
				// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
				// in JavaScript: it can begin a block or an object literal. We wrap the text
				// in parens to eliminate the ambiguity.

				j = eval('(' + text + ')');

				// In the optional fourth stage, we recursively walk the new structure, passing
				// each name/value pair to a reviver function for possible transformation.

				return typeof reviver === 'function' ? walk({
					'': j
				}, '') : j;
			}

			// If the text is not JSON parseable, then a SyntaxError is thrown.

			throw new SyntaxError('JSON.parse');
		};
	}
})(window, document);

//BASE64
(function(global, doc, undef) {
	var BASE64_MAPPING = [
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
		'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
		'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
		'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
		'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
		'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
		'w', 'x', 'y', 'z', '0', '1', '2', '3',
		'4', '5', '6', '7', '8', '9', '+', '/'
	];

	/**
	 *ascii convert to binary
	 */
	var _toBinary = function(ascii) {
		var binary = new Array();
		while (ascii > 0) {
			var b = ascii % 2;
			ascii = Math.floor(ascii / 2);
			binary.push(b);
		}
		/*
		var len = binary.length;
		if(6-len > 0){
			for(var i = 6-len ; i > 0 ; --i){
				binary.push(0);
			}
		}*/
		binary.reverse();
		return binary;
	};

	/**
	 *binary convert to decimal
	 */
	var _toDecimal = function(binary) {
		var dec = 0;
		var p = 0;
		for (var i = binary.length - 1; i >= 0; --i) {
			var b = binary[i];
			if (b == 1) {
				dec += Math.pow(2, p);
			}
			++p;
		}
		return dec;
	};

	/**
	 *unicode convert to utf-8
	 */
	var _toUTF8Binary = function(c, binaryArray) {
		var mustLen = (8 - (c + 1)) + ((c - 1) * 6);
		var fatLen = binaryArray.length;
		var diff = mustLen - fatLen;
		while (--diff >= 0) {
			binaryArray.unshift(0);
		}
		var binary = [];
		var _c = c;
		while (--_c >= 0) {
			binary.push(1);
		}
		binary.push(0);
		var i = 0,
			len = 8 - (c + 1);
		for (; i < len; ++i) {
			binary.push(binaryArray[i]);
		}

		for (var j = 0; j < c - 1; ++j) {
			binary.push(1);
			binary.push(0);
			var sum = 6;
			while (--sum >= 0) {
				binary.push(binaryArray[i++]);
			}
		}
		return binary;
	};

	var __BASE64 = {
		/**
		 *BASE64 Encode
		 */
		encoder: function(str) {
			var base64_Index = [];
			var binaryArray = [];
			for (var i = 0, len = str.length; i < len; ++i) {
				var unicode = str.charCodeAt(i);
				var _tmpBinary = _toBinary(unicode);
				if (unicode < 0x80) {
					var _tmpdiff = 8 - _tmpBinary.length;
					while (--_tmpdiff >= 0) {
						_tmpBinary.unshift(0);
					}
					binaryArray = binaryArray.concat(_tmpBinary);
				} else if (unicode >= 0x80 && unicode <= 0x7FF) {
					binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
				} else if (unicode >= 0x800 && unicode <= 0xFFFF) { //UTF-8 3byte
					binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
				} else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) { //UTF-8 4byte
					binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
				} else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) { //UTF-8 5byte
					binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
				} else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) { //UTF-8 6byte
					binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
				}
			}

			var extra_Zero_Count = 0;
			for (var i = 0, len = binaryArray.length; i < len; i += 6) {
				var diff = (i + 6) - len;
				if (diff == 2) {
					extra_Zero_Count = 2;
				} else if (diff == 4) {
					extra_Zero_Count = 4;
				}
				//if(extra_Zero_Count > 0){
				//	len += extra_Zero_Count+1;
				//}
				var _tmpExtra_Zero_Count = extra_Zero_Count;
				while (--_tmpExtra_Zero_Count >= 0) {
					binaryArray.push(0);
				}
				base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
			}

			var base64 = '';
			for (var i = 0, len = base64_Index.length; i < len; ++i) {
				base64 += BASE64_MAPPING[base64_Index[i]];
			}

			for (var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
				base64 += '=';
			}
			return base64;
		},
		/**
		 *BASE64  Decode for UTF-8 
		 */
		decoder: function(_base64Str) {
			var _len = _base64Str.length;
			var extra_Zero_Count = 0;
			/**
			 *计算在进行BASE64编码的时候，补了几个0
			 */
			if (_base64Str.charAt(_len - 1) == '=') {
				//alert(_base64Str.charAt(_len-1));
				//alert(_base64Str.charAt(_len-2));
				if (_base64Str.charAt(_len - 2) == '=') { //两个等号说明补了4个0
					extra_Zero_Count = 4;
					_base64Str = _base64Str.substring(0, _len - 2);
				} else { //一个等号说明补了2个0
					extra_Zero_Count = 2;
					_base64Str = _base64Str.substring(0, _len - 1);
				}
			}

			var binaryArray = [];
			for (var i = 0, len = _base64Str.length; i < len; ++i) {
				var c = _base64Str.charAt(i);
				for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
					if (c == BASE64_MAPPING[j]) {
						var _tmp = _toBinary(j);
						/*不足6位的补0*/
						var _tmpLen = _tmp.length;
						if (6 - _tmpLen > 0) {
							for (var k = 6 - _tmpLen; k > 0; --k) {
								_tmp.unshift(0);
							}
						}
						binaryArray = binaryArray.concat(_tmp);
						break;
					}
				}
			}

			if (extra_Zero_Count > 0) {
				binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
			}

			var unicode = [];
			var unicodeBinary = [];
			for (var i = 0, len = binaryArray.length; i < len;) {
				if (binaryArray[i] == 0) {
					unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
					i += 8;
				} else {
					var sum = 0;
					while (i < len) {
						if (binaryArray[i] == 1) {
							++sum;
						} else {
							break;
						}
						++i;
					}
					unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
					i += 8 - sum;
					while (sum > 1) {
						unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
						i += 8;
						--sum;
					}
					unicode = unicode.concat(_toDecimal(unicodeBinary));
					unicodeBinary = [];
				}
			}
			return unicode;
		}
	};

	function urlsafe_b64encode(input) {
		return window.base64.encoder(input).replace('+', '-').replace('/', '_');
	}

	window.urlsafe_b64encode = urlsafe_b64encode;
	window.base64 = __BASE64;
})(window, document);

//BRIDGE
(function(global, doc, undef) {

	var bridge = global.MeiYouJSBridge || {};
	var scheme = 'meiyou:///'
	var _readyList = [];
	var _errorList = [];
	var _waitList = {};
	var _listenList = {};
	var has = Object.prototype.hasOwnProperty;


	bridge.isReady = false;
	bridge.version = '0.0.1';
	bridge.app = {
		project: '{{project}}',
		channel: '{{channel}}',
		version: '{{version}}',
		platform: '{{platform}}',
		os: '{{os}}',
		mac: '{{mac}}',

	};
	var defaultConfig = {
		debug: true,
	};

	function log(message) {
	}

	/**
	 * create elements
	 * @param  {[type]}
	 * @return {[type]}
	 */
	function _createElement(options) {

		var src = scheme + options.method;
		if (options.data) {
			var data = JSON.stringify(options.data);
			var json = urlsafe_b64encode(data);
			src += '?params=' + json;
		}

		//alert(src);
		var iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		iframe.src = src;
		if(S.get("config").hash.deving == "jiayou"){
			console.log(src);
		}
		iframe.onload = function() {
			setTimeout(function() {
				iframe.remove();
			}, 0);
		};
		document.getElementsByTagName('body')[0].appendChild(iframe);
	}


	/*
	 * 兼容旧版的方法处理
	 * @param  option {[object]}
	 * @return {[type]}
	 */
	function _send(option) {
		if (option !== Object(option) || !option.code)
			throw new TypeError('invalid option');
		_createElement(option);
	}

	/*
	 * 执行方法
	 * @param  {[type]}
	 * @param  {[type]}
	 * @return {[type]}
	 */
	function _invoke(method, option) {
		var data = {
			method: method,
			data: option
		};
		_createElement(data);
	}

	/*
	 * 向native 添加注册事件
	 * @param  {[type]}
	 * @return {[type]}
	 */
	function _listen(listenObject) {
		_createElement(listenObject);
	}

	/*
	 * 向native 删除注册事件
	 * @param  {[type]}
	 * @return {[type]}
	 */
	function _unlisten(method) {
		var data = {
			method: '_unlisten',
			data: {
				method: method
			}
		};
		_createElement(data);
	}

	function _report() {}


	function _merge(to, from) {
		for (var key in from) {
			if (has.call(from, key)) {
				to[key] = from[key];
			}
		}
		return to;
	}

	function noop() {}

	/*
	 * 兼容旧版处理
	 * @param  {[type]}
	 * @return {[type]}
	 */
	bridge.send = function(option) {
		_send(option);
	};

	/*
	 * 配置信息
	 * @param  {[type]}
	 * @return {[type]}
	 */
	bridge.init = function(config) {

		config = config || {};
		if (this.isReady) {
			log('init fn shuold call once');
			return;
		}
		var conf = _merge(defaultConfig, config);
		this.config = conf;
		while (_readyList.length) {
			var item = _readyList[0];
			typeof item === 'function' ? item.apply(this, arguments) : noop.apply(this, arguments);
			_readyList.shift(_readyList[0]);
		};

		this.isReady = true;

		//dispatch init events
		var _initEvent = doc.createEvent('Events');
		_initEvent.initEvent('MeiYouJSBridgeInit');
		_initEvent.bridge = this;
		doc.dispatchEvent(_initEvent);
	};

	/*
	 * 注册ready事件
	 * @param  callback 	{Function}
	 * @return {[type]}
	 */
	bridge.ready = function(callback) {
		_readyList.push(callback);
		return this;
	};

	/*
	 * 注册错误事件
	 * @return {[type]}
	 */
	bridge.error = function() {

	};


	/*
	 * 取消侦听
	 * @param  {[type]}
	 * @return {[type]}
	 */
	bridge.unlisten = function(method) {

		_unlisten(method);
		delete _listenList[method];
	};

	/*
	 * 执行方法
	 * 不可等待
	 * @param  method {[string]}
	 * @param  option {[json object]}
	 * @return {[type]}
	 */
	bridge.invoke = function(method, option) {
		_invoke(method, option);
	};

	/*
	 * 注册等待消息回执的方法
	 * 暂不支持队列消息
	 * @param  method 	{[string]}
	 * @param  option 	{[object]}
	 * @param  callback {Function}
	 * @return {[type]}
	 */
	bridge.wait = function(method, option, callback) {

		var now = (new Date()).getTime();
		var callbackId = method + '-' + now;

		var waitObject = {
			callbackId: callbackId,
			callback: callback,
			inputData: option,
			outputData: null,
			start: now,
			finish: null,
			_complete: function() {},
			timeout: 1000
		};
		_waitList[method] = waitObject;
		_invoke(method, option);
		return this;
	};

	/*
	 * 执行回调消息
	 * 禁止在页面调用
	 * @param  method {[string]}
	 * @param  data {[string of json]}
	 * @return {[type]}
	 */
	bridge.dispatchWait = function(method, data) {
		var waitObject = _waitList[method];
		if (waitObject && waitObject.callback) {
			waitObject.callback.apply(this, arguments);
		}
		_waitList.shift(waitObject);
		return this;
	};

	/*
	 * 侦听	 *
	 * topbar/rightbutton?params=
	 * @param  method 		{[string]}
	 * @param  callback 	{Function}
	 * @return {[type]}
	 */
	bridge.listen = function(method, data, callback) {
		var listenObject = _listenList[method];
		if (!listenObject) {
			listenObject = {
				method: method,
				data: data,
				listenList: [],
			};
		}
		listenObject.listenList.push(data);
		listenObject['callback'] = callback;
		_listenList[method] = listenObject;
		_listen(listenObject);
		return this;
	};

	/*
	 * 派发侦听消息
	 * 禁止在页面调用
	 * @param  method {[string]}
	 * @param  data {[string of json]}
	 * @return {[type]}
	 */
	bridge.dispatchListener = function(method, data) {
		var listenObject = _listenList[method];
		if (listenObject) {
			var callback = listenObject['callback'];
			if (callback) {
				callback.apply(this,arguments);
			};

			// var listenList = listenObject.listenList;
			// if (listenList && listenList.length) {
			// 	for (var i = listenList.length - 1; i >= 0; i--) {
			// 		listenList[i]['callback'].apply(this, data);
			// 	}
			// }
		}
	};

	//直接发出协议请求
	bridge.callBridge = function(src) {
		var iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		iframe.src = src;
		iframe.onload = function() {
			setTimeout(function() {
				iframe.remove();
			}, 0);
		};
		document.getElementsByTagName('body')[0].appendChild(iframe);
	};

	/*
	 * dispatch ready Event;
	 */
	var readyEvent = doc.createEvent('Events');
	readyEvent.initEvent('MeiYouJSBridgeReady');
	readyEvent.bridge = bridge;
	global.MeiYouJSBridge = bridge;

	doc.dispatchEvent(readyEvent);

	global.dispatchListener = bridge.dispatchListener;
	global.dispatchWait = bridge.dispatchWait;


	return bridge;
})(window, document);
