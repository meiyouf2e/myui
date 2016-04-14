'use strict';
import { Spin } from 'antd';
const Frame =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin size="large"/>,
<<<<<<< HEAD
			cl : "loader"
=======
			cl : "loader page"
>>>>>>> master
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("frame",function(){
<<<<<<< HEAD
			me.setState({children:React.createElement(AsyncToast,me.props),cl:""})
=======
			me.setState({children:React.createElement(AsyncFrame,me.props),cl:"page"})
>>>>>>> master
		});
	},
	render : function(){
		return <div className={this.state.cl}>{this.state.children}</div>
	}
});

module.exports = Frame;
