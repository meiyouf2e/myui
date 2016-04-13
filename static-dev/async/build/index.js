'use strict';
import { Spin } from 'antd';
const Build =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin/>
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("build",function(){
			me.setState({children:React.createElement(AsyncBuild,me.props)})
		});
	},
	render : function(){
		return <div>{this.state.children}</div>
	}
});

module.exports = Build;
