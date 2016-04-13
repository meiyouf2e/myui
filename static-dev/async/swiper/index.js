'use strict';
import { Spin } from 'antd';
const Swiper =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin/>
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("swiper",function(){
			me.setState({children:React.createElement(AsyncSwiper,me.props)})
		});
	},
	render : function(){
		return <div>{this.state.children}</div>
	}
});

module.exports = Swiper;
