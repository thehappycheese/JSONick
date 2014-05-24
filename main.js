

"use strict";

data.Ag.related = '<h1>Hello!</h1><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p>'
data.alpha2.related = [1,2,3,4,[1,2,3,4],6,7];
data.Acc.related = {x:10};



var cnt = 9000;
build("#leftcol",data,[]);
document.querySelector("#leftcol").querySelector(".content").style.display = "";



function setup(){
	
}




function build(host,json,path){
	if(json==undefined){
		return
	}
	 
	var divlist = d3
		.select(host)
		.append("div")
		.attr("class","content")
		.style("display","none")
		.selectAll("div")
		.data(function(){
			var data_array = [];
			for(var i in json){
				data_array.push({name:i, value:json[i], path:path.concat([i])});
			}
			return data_array;
		})
		.enter()
		.append("div");
		
	window.d = divlist;
		
	var tables = divlist
		.attr("class","item")
		.append("table")
		.append("tr")
		.on("click",function(){
			var pn = this.parentNode;
			while(pn.__data__ == undefined){
				pn = pn.parentNode;
			}
			
			
			
			// toggle content visisbility
			var contentdiv = pn.parentNode.querySelector(".content");
			if(contentdiv){
				if(contentdiv.style.display==""){
					contentdiv.style.display = "none";
				}else{
					contentdiv.style.display = "";
				}
			}else{
				// set json editor path
				document.querySelector("#pathtext").innerHTML = pn.__data__.path.join('.');
			}
		})
	tables
		.append("td")
		.attr("class","col1")
		.text(function(d){
			var pn = this.parentNode;
			while(pn.__data__ == undefined){
				pn = pn.parentNode;
			}
			return pn.__data__.name;
		})
	tables
		.append("td")
		.attr("class","col2")
		.html(function(d){
			var pn = this.parentNode;
			while(pn.__data__ == undefined){
				pn = pn.parentNode;
			}
			if(typeof pn.__data__.value == "object"){
				this.style = "color:grey;font-family:sans-serif;"
				switch(Object.prototype.toString.call(pn.__data__.value)){
					case "[object Array]":
						var outstr = JSON.stringify(pn.__data__.value);
						if(outstr.length<20){
							return outstr;
						}else{
							return "[...] length:"+pn.__data__.value.length;
						}
					case "[object Object]":
						var outstr = JSON.stringify(pn.__data__.value);
						if(outstr.length<20){
							return outstr;
						}else{
							return "{...}";
						}
					default:
						return Object.prototype.toString.call(pn.__data__.value);
				}
				
			}else{
				return pn.__data__.value;
			}
		})
		
		//.html(function(d){
		//	if(typeof d.value=="number" || typeof d.value=="string"){
		//		return '<table><tr><td class="col1">' + d.name +'</td><td class="col2"><div>'+ d.value+"</div></td></tr></table>";
		//	}else if(typeof json=="object"){
		//		return '<table><tr><td class="col1">' + d.name +'</td><td class="col2" style="color:grey;font-family:sans-serif;">'+ Object.prototype.toString.call(d.value)+"</td></tr></table>";
		//	}
		//	return d.name + "erk";
		//})
			

		divlist[0]
			.forEach(function(d,i,a){
				if(cnt>0){
					cnt--;
					if(typeof d.__data__.value == "object"){
						build(d,d.__data__.value,path.concat([d.__data__.name]))
					}
				}
			})
}