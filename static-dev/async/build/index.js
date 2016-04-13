'use strict';
import { Spin } from 'antd';
const Build =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin size="large"/>,
			cl : "loader page"
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("build",function(){
			me.setState({children:React.createElement(AsyncBuild,me.props),cl:"page"})
		});
	},
	render : function(){
		return <div className={this.state.cl}>{this.state.children}</div>
	}
});

module.exports = Build;
