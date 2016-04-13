'use strict';
import { Spin } from 'antd';
const Alert =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin/>
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("alert",function(){
			me.setState({children:React.createElement(AsyncAlert,me.props)})
		});
	},
	render : function(){
		return <div>{this.state.children}</div>
	}
});

module.exports = Alert;
