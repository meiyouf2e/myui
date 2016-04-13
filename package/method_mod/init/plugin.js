/**
 * React Xxx组件：组件描述（中文名，作用）
	@author dddd
	@props（必填属性，前面加 *）
	- *dataid: String //dataid
	- config:
		- prop0: Boolean //属性描述，默认false
		- prop1: Object //属性描述
			- subProp0: String //属性描述，默认'test'
	@methods
	- function0: 方法描述
		- param0: Boolean //形参描述
	@data
	- plugin: 当前插件
	- value0: Type //descritpition
	- value1: Type //descritpition
	@example
	<Xxx dataid={String} [config={Object}] />
 */
'use strict';
require('./xxx.scss');

const Xxx = React.createClass({
	getInitialState: function() {
		return {};
	},
	render: function() {
		return (
			<div className="tae-xxx"></div>
		);
	}
});

module.exports = Xxx;
