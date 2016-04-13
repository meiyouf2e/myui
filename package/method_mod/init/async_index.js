'use strict';
import { Spin } from 'antd';
const Xxx =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin/>
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("xxx",function(){
			me.setState({children:React.createElement(AsyncXxx,me.props)})
		});
	},
	render : function(){
		return <div>{this.state.children}</div>
	}
});

module.exports = Xxx;
