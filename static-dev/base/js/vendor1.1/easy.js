//常用函数，常量
var E = Easy = {
	ajaxTimeout:10000,
	defaultText : {
		netError : "咦？网络不见了，请检查网络连接",
		netBad :"咦?网络不给力啊",
		defaultError :"咦？出错了"
	},
	ajaxGet : function(path,data,callback,toast){//第三项为toast的plugin对象
		if((/\?/).test(path)){
			path = path+"&"+$.param(data);
		}else{
			path = path+"?"+$.param(data);
		}
		$.ajax({
		  type: 'GET',
		  url: path,
		  timeout: E.ajaxTimeout,
		  success: function(data){
		  	callback(data);
		  },
		  error: function(xhr, type){
		  	console.log(type);
		  	xhr.abort();
		  	if(type == "timeout"){
		  		 toast.show(E.defaultText.netError);
		  	}else{
		  		toast.show(E.defaultText.defaultError)
		  	}
		  }
		});
	},
	ajaxPost : function(path,data,callback,toast){//第三项为toast的plugin对象
		$.ajax({
		  type: 'POST',
		  url: path,
		  data:data,
		  timeout: E.ajaxTimeout,
		  success: function(data){
		  	callback(data);
		  },
		  error: function(xhr, type){
		  	if(type == "timeout"){
		  		toast.show(E.defaultText.netError);
		  	}else{
		  		toast.show(E.defaultText.defaultError)
		  	}
		    console.log(xhr,type);
		  }
		})

	},
	random:function(length){
		var l ='1',
		length=length?length:6;
		for(var i=0;i<length;i++){
			l += '0';
		}
		l = Number(l);
		return Math.floor(Math.random()*l);
	},
	closeLoading : function(){
		var dom = document.getElementById('_prepage_toast');
		dom && (dom.style.display = 'none');
	},
	toArray :function(obj){
		var arr = [];
		for(var k in obj){
			arr.push(obj[k]);
		}
		return arr;
	},
	tplConnect : function(tpl,obj){//模板拼装函数
		var rel='';
		rel = tpl.replace(/\{([\w|\[|\]]+)\}/gi,function(word,key){
			if(obj[key] != undefined){ //若obj含有这个属性，则返回obj的属性值
				return obj[key];
			}else{
				var oldWord = word;
				word = word.replace(/\{(\w+)\[(\w+)\]\}/gi,function(a,b,c,d){
					if(obj[b] != undefined&&obj[b][c] !=undefined){
						return  obj[b][c];
					}else{
						return c;
					}
				})
				return word;
			}
		});
		return rel;
	},
	getWindowSize :function(){//获取浏览器可视化区域宽高
		return {
			w : window.screen.width?window.screen.width:(document.documentElement.clientWidth?document.documentElement.clientWidth:document.body.clientWidth),
			h : window.screen.height?window.screen.height:(document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight)
		}
	},
	jump: function(url,type){//跳转
		if(!url) return;
		type = type ? type :S.get("config").hash.h5type;
		if(type!="web"){
			switch(type){
				case "ebweb" : MeiYouJsSdk.openEbWebView(url);break;
				case "taeweb": MeiYouJsSdk.openTaeWebView(url);break;
				case "app":
				default:MeiYouJsSdk.openWebView(url);break;
			}
		}else{
			location.href = url;
		}
	},
	use : function(page,callback,version){
		var script = document.createElement("script");
		version = version?version:0;
		var reg = new RegExp("/"+page+".js"),exist=false;
		$("script").each(function(e,c){
			if(reg.test($(c).attr("src"))){
				exist = true;
			}
		})
		if(exist){
			if(callback)callback();
			return;
		}
			script.src = "../asset/dev/async/"+page+".js"+"?"+version;
		
		script.onload = function(){
			if(callback)callback();
		};
		$("head").append(script);
	},
	getStorage : function(pathName,version){
	//获取locastorage,pathName,version为必须
		var str = localStorage ? localStorage.getItem("tae_"+pathName) : "";
		var obj = str?JSON.parse(str):null;
		if(obj&&obj.v&&obj.data&&obj.v == version){
			return obj;
		}else{
			return false;
		}
	},
	setStorage : function(pathName,value,version){
	//获取locastorage,pathName,key,value,version为必须
		var str = "",obj={
			v : version,
			data : value
		};
		str = JSON.stringify(obj);
		localStorage && localStorage.setItem("tae_"+pathName,str);
	}
}
