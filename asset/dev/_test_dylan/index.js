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

	/*
	 * 引入 antd 说明：
	 * 把 node_modules/antd 下的 package.json 替换成 ./package.json
	 */
	// import {AA, BB} from './es6test';
	// import { DatePicker } from 'antd';
	// const App = () => (
	// 	<div>{AA} - {BB}</div>
	// );
	'use strict';

	var Test = React.createElement(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"async/test\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
	// let Test = require('async/test');
	var Plugin = React.createClass({
		displayName: 'Plugin',

		getInitialState: function getInitialState() {
			return {
				async: '这里是异步的'
			};
		},
		changeAsync: function changeAsync() {
			this.setState({
				async: Test
			});
		},
		render: function render() {
			var s = this.state;
			return React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					{ style: { margin: '10px' }, onClick: this.changeAsync },
					'更改底部'
				),
				React.createElement(
					'div',
					null,
					s.async
				)
			);
		}
	});
	// ReactDOM.render(<App />, document.querySelector('#app'));
	ReactDOM.render(React.createElement(Plugin, null), document.querySelector('#app'));

/***/ }
/******/ ]);