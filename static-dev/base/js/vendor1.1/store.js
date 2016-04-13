var Store = function(){
	var data = {
		config : {
			hash:{
				h5type : "app",
				imglazy : "auto",
				user_address: "admin" //user_address 页面
			}
		}
	}
	return {
		add : function(obj){
			var id="data"+E.random();
			if(data[id]){
				id = this.add();
			}
			data[id]=obj?obj:{};
			return id;
		},
		reset:function(id,obj){
			if(!data[id]) return;
			data[id] = null;
			return data[id] = obj;
		},
		set:function(id,obj){
			if(!data[id]) return;
			return $.extend(data[id],obj);
		},
		get : function(id){
			if(id=="config"){
				return data['config'];
			}
			return data[id]}

	}
}
S = Store = new Store();
(function(){
	var str = location.search.slice(1).split("&");
	var hash = S.get("config").hash;
	for(var k in str){
		if(str[k].split("=")[1]){
			hash[str[k].split("=")[0]]=str[k].split("=")[1];
		}
	}

})();