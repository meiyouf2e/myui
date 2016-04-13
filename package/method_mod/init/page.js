'use strict';
require('../css/index.scss');
import 'antd/lib/index.css';
import React from 'react';
import { render } from 'react-dom';
var Img = require('plugin/img');
$(function(){
	E.closeLoading();
	const Page = React.createClass({
		getInitialState: function() {
			return {};
		},
		render: function() {
			return (
				<div>这一段是React渲染出来的</div>
			);
		}
	});
	ReactDOM.render(<Page />, document.querySelector('#app'));
});
