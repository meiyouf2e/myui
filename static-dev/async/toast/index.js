'use strict';
import { Spin } from 'antd';
const Toast =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin/>
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("toast",function(){
			me.setState({children:React.createElement(AsyncToast,me.props)})
		});
	},
	render : function(){
		return <div>{this.state.children}</div>
	}
});

module.exports = Toast;
