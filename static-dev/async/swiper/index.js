'use strict';
import { Spin } from 'antd';
const Swiper =  React.createClass({
	getInitialState: function() {
		return {
			children: <Spin size="large"/>,
			cl : "loader"
		};
	},
	componentDidMount:function(){
		let me = this;
		E.use("swiper",function(){
			me.setState({children:React.createElement(AsyncSwiper,me.props),cl:""})
		});
	},
	render : function(){
		return <div className={this.state.cl}>{this.state.children}</div>
	}
});

module.exports = Swiper;
