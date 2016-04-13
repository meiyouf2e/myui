'use strict';
import { Spin } from 'antd';
const Guide =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin/>
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("guide",function(){
			me.setState({children:React.createElement(AsyncGuide,me.props)})
		});
	},
	render : function(){
		return <div>{this.state.children}</div>
	}
});

module.exports = Guide;
