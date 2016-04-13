/**
 *React Img图片惰性加载插件
 	@author Liuyutong
 	@props
 		－url : String,必选
		－mustType :强制定义no－不惰性加载，不受hash影响
		－className : String
		-defaultHeight:图片load前的高度
	@example
	<Img url=String  [musttype='no'] [className=String]/>

*/

require('./img.scss');
var imgLazy = require('./imgLazy.js');

var Img = React.createClass({
	blankURI:'data:image/gif;base64,R0lGODlhAQABAPAAAPf39////yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',// 灰度图片的base64
	getInitialState: function() {
		var className = this.props.className ? this.props.className:"",
		imgLazy = S.get("config").hash.imglazy;
		if(imgLazy=="no"){
			imgLazy = false;
		}
		if(this.props.mustType == "no"){
			imgLazy = false;
		}
		return {
			className : className,
			imgLazy : imgLazy,
			style : {}
		};
	},
	componentDidMount:function(){
		imgLazy.init();
		if(this.refs.img&&this.refs.img.clientHeight){
			if(this.props.defaultHeight){
				this.setState({
					style:{height:this.props.defaultHeight}
				})
			}
		}
	},
	onload:function(){
		if(this.refs.img&&!this.refs.img.getAttribute("data-src")){
			this.setState({
				style:{}
			})
		}
	},
	componentDidUpdate:function(){
		imgLazy.init();
	},
	render: function() {
		if(this.state.imgLazy){
			return (
				<img style={this.state.style} ref="img" onLoad={this.onload} data-src={this.props.url} src={this.blankURI} className={this.state.className+" tae-img"} id={this.props.id} />
			);
		}else{
			return (
				<img src={this.props.url}  className={this.state.className+" tae-img"} id={this.props.id} />
			);
		}
	}
});

module.exports = Img;
