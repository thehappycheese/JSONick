

"use strict";

data.Ag.related = '<h1>Hello!</h1><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p>'
data.alpha2.related = [1,2,3,4,[1,2,3,4],6,7];
data.Acc.related = {x:10};

//data={
//	munxc:[1,2,3,4,[45,2]],
//	b:"pleft"
//}

var cnt = 9000;



render()
	
function render(){
	var root = d3.select("#leftcol")
		.data(function(){return [data]})
	root.call(build,[]);
}



function setup(){
	
}




function build(something,path){
	if(this[0][0].__data__.length==0){
		return;
	}
	
	// div which will contain a table and maybe another root container div
	var items = this.selectAll(".item")
		.data(
			function(d){
				var json = this.parentNode.__data__;
				var data_array = [];
				for(var i in json){
					data_array.push({name:i, value:json[i], path:path.concat([i])});
				}
				return data_array;
			},
			function(d){
				//console.log(d.path.join("."))
				return d.path.join(".");
			}
		);
	
	items.enter()
		.append("div")
		.attr("class","item");
	
	
		
	items.exit()
		.each(function(d){
			console.log(d.path.join("."));
		})
		.remove();
	
	/*
	SO i figured out what to do. Its very simple
	you need your datastructure to be digested from JSON into an array-type structure
	That way there is no need to wrap objects like this: [dataObject]
	That way you arent creating a different set of data for every call
	That way it will not identify data as being removed! whoop.
	*/
	
	
	
	
	
	
	
	
	var table = items.selectAll(".entry")
		.data(
			function(d){
				
				return [this.parentNode.__data__];
			},
			function(d){return d.path.join(".")}
		);
	
	table.enter()
		.append("table")
		.attr("class","entry")
	
	//table.exit().remove();
	
	
	
	
	
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