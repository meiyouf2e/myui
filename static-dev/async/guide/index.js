'use strict';
import { Spin } from 'antd';
const Guide =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin size="large"/>,
			cl : "loader"
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("guide",function(){
			me.setState({children:React.createElement(AsyncGuide,me.props),cl:""})
		});
	},
	render : function(){
		return <div className={this.state.cl}>{this.state.children}</div>
	}
});

module.exports = Guide;
