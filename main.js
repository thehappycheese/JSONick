

"use strict";

data.Ag.related = '<h1>Hello!</h1><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p>'
data.alpha2.related = [1,2,3,4,[1,2,3,4],6,7];
data.Acc.related = {x:10};

//data={
//	munxc:[1,2,3,4,[45,2]],
//	b:"pleft"
//}

var cnt = 9000;

var test_json = {
	a:2,
	b:false,
	c:"Hello world!",
	d:function(x){return 2*x;},
	e:[1,2,3],
	f:[3,[4,5,6],7],
	g:{
		h:null,
		i:undefined,
		k:[],
		l:{},
		m:"",
		n:0,
		q:function(){}
	},
	o:document.body
}








function digestJSON(json, path){
	var result = undefined;
	var jsonType = Object.prototype.toString.call(json);
	switch(jsonType){
		case "[object Null]":
		case "[object Undefined]":
		case "[object Number]":
		case "[object Boolean]":
		case "[object String]":
			result = json;
			break;
		case "[object Array]":
			result = [];
			for(var i = 0;i<json.length;i++){
				result.push({
					name:		i,
					value:	digestJSON(json[i], path.concat([i])),
					path:		path.concat([i]),
					type:		Object.prototype.toString.call(json[i])
				})
			}
			break;
		case "[object Object]":
			result = [];
			for(var i in json){
				result.push({
					name:		i,
					value:	digestJSON(json[i], path.concat([i])),
					path:		path.concat([i]),
					type:		Object.prototype.toString.call(json[i])
				})
			}
			break;
		case "[object Function]":
			result = null;
			console.warn("Cannot digest functions at { JSON."+path.join(".")+": "+jsonType+" } Null stored in place.");
			break;
		default:
			result = null;
			console.warn("Cannot digest datatype at { JSON."+path.join(".")+": "+jsonType+" } Null stored in place.");
	}
	return result;
}

function reconstituteJSON(json, return_type){
	return_type = return_type || "[object Object]";
	var result = undefined;
	switch(return_type){
		case "[object Object]":
			result = {};
			
			for(var i =0;i<json.length;i++){
				result[json[i].name] = reconstituteJSON(json[i].value, json[i].type);
			}
			
			
			break;
		case "[object Array]":
			result = [];
			
			for(var i =0;i<json.length;i++){
				result[json[i].name] = reconstituteJSON(json[i].value, json[i].type);
			}
			break;
		default:
			return json;
	}
	return result;
}

























var digested_data = digestJSON(data,[]);
render()
function render(){
	var root = d3.select("#leftcol")
		.call(build,digested_data);
}

function build(something, arg_data){
	

	
	// div which will contain a table and maybe another root container div
	var items = this.selectAll(".item")
		.data(
			arg_data,
			function(d){
				return d.path.join(".");
			}
		).enter();
	
	items
		.append("div")
		.attr("class","item")
		.append("table")
		.attr("class","entry")
		.append("tr")
		.on("click",function(){
			var div = this.parentNode.parentNode.querySelector(".content");
			if(div){
				if(div.style.display == "none"){
					div.style.display = null;
				}else{
					div.style.display = "none";
				}
			}
		});
		
	this.selectAll(".item tr")
		.append("td")
		.attr("class", "col1")
		.text(function(d){return d.name});
	
	this.selectAll(".item tr")
		.append("td")
		.attr("class", "col2")
		.html(function(d){
			if(d.type == "[object Array]" || d.type == "[object Object]"){
				d3.selectAll(this)
					.style("font-family","sans-serif")
					.style("color","darkgrey")
				return d.type
			}else{
				return d.value
			}
		});
	
	this.selectAll(".item")
		.each(function(d){
			
			if(d.type == "[object Array]" || d.type == "[object Object]"){
				
				d3.selectAll(this)
					.append("div")
					.attr("class","content")
					.style("display","none")
					.call(build,function(d){return d.value});
			}else{
				// do nothing
			}
			
		})
	
	
		
	items.exit()
		.each(function(d){
			console.log("exit -  "+d.path.join("."));
		})
		.remove();
	
	/*
	SO i figured out what to do. Its very simple
	you need your datastructure to be digested from JSON into an array-type structure
	That way there is no need to wrap objects like this: [dataObject]
	That way you arent creating a different set of data for every call
	That way it will not identify data as being removed! whoop.
	*/
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	return
	
	
	
	
	
	var trow = table.selectAll("tr")
		.data(
			function(){return [this.parentNode.__data__];},
			function(d){return d.path.join(".")}
		);
	
	trow.enter()
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
	
	//trow.exit().remove();
	
	
	
	
	
	var tds = trow.selectAll("td")
		.data(
			function(){
				//console.log(this.parentNode.__data__.name)
				return [this.parentNode.__data__.name, this.parentNode.__data__.value];
			}
		);
	
	tds.enter()
		.append("td")
		.attr("class","col1");
	
	//tds.exit().remove()
		
	tds//.update()
		.html(function(d){
			return d;
		})
	
	
	items.each(function(d){
		if(typeof d.value == "object"){
			var cont = d3.select(this).selectAll(".content")
				.data(
					function(d){
						return [d.value]
					},
					function(d){
						return d;
					});
				
			
			cont.enter()
				.append("div")
				.attr("class","content")
				.style("display","none");
				
			//cont.exit().remove();
			
			cont.call(build, path.concat([d.name]));
		}
	})
	
	
}













	/*
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
		
			

		divlist[0]
			.forEach(function(d,i,a){
				if(cnt>0){
					cnt--;
					if(typeof d.__data__.value == "object"){
						build(d,d.__data__.value,path.concat([d.__data__.name]))
					}
				}
			})*/