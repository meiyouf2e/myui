'use strict';
import { Spin } from 'antd';
const Alert =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin size="large"/>,
			cl : "loader"
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("alert",function(){
			me.setState({children:React.createElement(AsyncAlert,me.props),cl:""})
		});
	},
	render : function(){
		return <div className={this.state.cl}>{this.state.children}</div>
	}
});

module.exports = Alert;
