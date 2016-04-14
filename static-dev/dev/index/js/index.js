'use strict';
require('../css/index.scss');
//const Components = require('async/components');
import 'antd/lib/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Menu ,Icon,Button,Row,Col} from "antd";
import { Router, Route, Link,Redirect,hashHistory } from 'react-router'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
var Img = require('plugin/img');
var Build = require('async/build');
var Frame = require('async/frame');
var Guide = require('async/guide');
var Swiper = require('async/swiper');
var Toast = require('async/toast');
var Alert = require('async/alert');

$(function(){
	E.closeLoading();
	const Index = React.createClass({
		render:()=>{
			return <div className="index">
				<div className="index-top">
					<div className="index-title"><span className="warning">MY</span>UI</div>
					<div>一个针对移动端的前端框架</div>
					<div className="index-des">
						美柚电商前端出品
					</div>
					<div className="index-github"><a href="https://github.com/meiyouf2e/myui" target="_blank"><Icon type="github"/>  Github</a></div>
					<div><div className="index-start">Let's start!</div></div>
				</div>
				<div className="index-list">
					<Row>
				      <Col span="6"><div className="index-list-item">
				      		<div className="index-list-img"><img src="/images/mbile.jpeg"/></div>
				      		<div className="index-list-title">针对移动端</div>
				      		<div className="index-list-des">针对移动web的前端框架，代码更适宜于移动端，充分考虑移动端性能、兼容问题、hybird开发模式等</div>
				      </div></Col>
				      <Col span="6"><div className="index-list-item">
				      	<div className="index-list-img"><img src="/images/components.png"/></div>
				      	<div className="index-list-title">丰富的组件</div>
				      	<div className="index-list-des">丰富的移动ui组件,基于h5,css3,并根据css3能力做好js动画兼容,完美兼容各种移动机型</div>
				      </div></Col>
				      <Col span="6"><div className="index-list-item">
				      	<div className="index-list-img"><img src="/images/performance1.png"/></div>
				      	<div className="index-list-title">高性能 更智能</div>
				      	<div className="index-list-des">努力让体验接近原生效果,并从多方位提升页面性能,引入search管理页面功能,实现智能化（切换hybird和web模式等）</div>
				      </div></Col>
				      <Col span="6"><div className="index-list-item">
				     	<div className="index-list-img"><img src="/images/react.png"/></div>
				      	<div className="index-list-title">基于React</div>
				      	<div className="index-list-des">本框架基于React,且提供了基于webpack和gulp的脚手架工具,引入hotloader,htmlone等,使创建、开发、上线更简单</div>
				      </div></Col>
				    </Row>
				</div>

			</div>
		}
	});
	const Sider = React.createClass({
	  getInitialState() {
	    return {
	      defaultOpenKeys :[]
	    };
	  },
	  handleClick(e) {
	    this.setState({
	      current: e.key
	    });
	  },
	  render() {
	    return (
	    <div className="main">
		    <div className="banner">
		    	<div className="logo"><span className="warning">MY</span>UI</div>
		    	<div id="mainmenu">
			      	<Menu onClick={this.handleClick}
			        style={{ width: 240 }}
			        defaultOpenKeys={this.state.defaultOpenKeys}
			        selectedKeys={[this.state.current]}
			        mode="horizontal"
			        style={{width:"",WebkitBoxFlex:1,border:0}}>
				       <Menu.Item key="index" ><Link to="/index"><Icon type="home" /><span>首页</span></Link></Menu.Item>
				       <Menu.Item key="frame" ><Link to="/frame"><Icon type="inde" /><span>MYUI前端架构</span></Link></Menu.Item>
				       <Menu.Item key="build" ><Link to="/build"><Icon type="caret-circle-o-right" /><span>构建工具</span></Link></Menu.Item>
				       <Menu.Item key="wapcomponents" ><Link to="/wapcomponents"><Icon type="appstore-o" /><span>移动web组件</span></Link></Menu.Item>
			     	</Menu>
			     </div>
		     </div>
		     <div className="body">
		     	{this.props.body}
		     </div>
		     <div className="footer">
					<div>我们是虚拟世界的建筑师</div>
					<div className="issues">问题与建议:<a href="https://github.com/meiyouf2e/myui/issues" target="_blank"> <Icon type="github"/> Issues</a></div>
					<div className="aboutus">联系我们: <Icon type="mail"/> 176929463@qq.com</div>
					<div className="andps">最终解释权归本团队成员所有</div>
				</div>
	      </div>
	    );
	  }
	});
	const Treemenu = React.createClass({
	  getInitialState() {
	    return {
	      defaultOpenKeys :["wapcomponents"]
	    };
	  },
	  handleClick(e) {
	    this.setState({
	      current2: e.key
	    });
	  },
	  render() {
	    return (
	    <div className="componentsBody">
	    	<div id="menutree">
		      	<Menu onClick={this.handleClick}
		        style={{ width: 240 }}
		        defaultOpenKeys={this.state.defaultOpenKeys}
		        selectedKeys={[this.state.current2]}
		        mode="inline"
		        >
			       	<Menu.Item key="guide" ><Link to="/wapcomponents/guide"><Icon type="question-circle-o" /><span>快速上手</span></Link></Menu.Item>
			       	<SubMenu title="移动web-Components" key="wapcomponents">
					    <Menu.Item key="swiper"><Link to="/wapcomponents/swiper">Swiper组件</Link></Menu.Item>
					    <Menu.Item key="toast"><Link to="/wapcomponents/toast">Toast组件</Link></Menu.Item>
					    <Menu.Item key="alert"><Link to="/wapcomponents/alert">Alert组件</Link></Menu.Item>
					</SubMenu>
		     	</Menu>
		     </div>
		     <div className="componentsMain">	
		     	{this.props.cbody}
		     </div>
	      </div>
	    );
	  }
	});
	ReactDOM.render(
	<Router history={hashHistory}>
		<Redirect from="/" to="/index" />
		<Redirect from="/wapcomponents" to="/wapcomponents/guide" />
	    <Route path="/" component={Sider}>
	      	<Route path="index" components={{current:"index",body:Index}}/>
	      	<Route path="build" components={{current:"build",body:Build}}/>
	      	<Route path="frame" components={{current:"frame",body:Frame}}/>
	      	<Route path="wapcomponents" components={{body:Treemenu,current:"wapcomponents"}}>
	      		<Route path="guide" components={{cbody:Guide,current2:"guide"}}/>
	      		<Route path="swiper" components={{cbody:Swiper,curren2:"swiper"}}/>
	      		<Route path="toast" components={{cbody:Toast,curren2:"toast"}}/>
	      		<Route path="alert" components={{cbody:Alert,curren2:"toast"}}/>
	      	</Route>
	    </Route>
	  </Router>, document.querySelector('#router'));
});
