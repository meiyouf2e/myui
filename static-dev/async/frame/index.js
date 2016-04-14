'use strict';
import { Spin } from 'antd';
const Frame =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin size="large"/>,
			cl : "loader page"
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("frame",function(){
			me.setState({children:React.createElement(AsyncFrame,me.props),cl:"page"})
		});
	},
	render : function(){
		return <div className={this.state.cl}>{this.state.children}</div>
	}
});

module.exports = Frame;
