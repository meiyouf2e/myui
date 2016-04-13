'use strict';
require('../css/index.scss');
//const Components = require('async/components');
import 'antd/lib/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Menu ,Icon} from "antd";
import { Router, Route, Link,Redirect,hashHistory } from 'react-router'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
var Img = require('plugin/img');
var Build = require('async/build');
var Guide = require('async/guide');
var Swiper = require('async/swiper');
var Toast = require('async/toast');
var Alert = require('async/alert');

$(function(){
	E.closeLoading();
	const Index = React.createClass({
		render:()=>{
			return <div className="page">一个针对移动端的前端开发解决方案</div>
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
		    	<div className="logo">MYUI</div>
		    	<div id="mainmenu">
			      	<Menu onClick={this.handleClick}
			        style={{ width: 240 }}
			        defaultOpenKeys={this.state.defaultOpenKeys}
			        selectedKeys={[this.state.current]}
			        mode="horizontal"
			        style={{width:"",WebkitBoxFlex:1,border:0}}>
				       <Menu.Item key="index" ><Link to="/index"><Icon type="home" /><span>首页</span></Link></Menu.Item>
				       <Menu.Item key="build" ><Link to="/build"><Icon type="caret-circle-o-right" /><span>构建工具</span></Link></Menu.Item>
				       <Menu.Item key="wapcomponents" ><Link to="/wapcomponents"><Icon type="appstore-o" /><span>移动web组件</span></Link></Menu.Item>
			     	</Menu>
			     </div>
		     </div>
		     <div className="body">
		     	{this.props.body}
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
	      	<Route path="wapcomponents" components={{body:Treemenu,current:"wapcomponents"}}>
	      		<Route path="guide" components={{cbody:Guide,current2:"guide"}}/>
	      		<Route path="swiper" components={{cbody:Swiper,curren2:"swiper"}}/>
	      		<Route path="toast" components={{cbody:Toast,curren2:"toast"}}/>
	      		<Route path="alert" components={{cbody:Alert,curren2:"toast"}}/>
	      	</Route>
	    </Route>
	  </Router>, document.querySelector('#router'));
});
