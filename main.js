

"use strict";

data.Ag.related = '<h1>Hello!</h1><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p>'
data.alpha2.related = [1,2,3,4,[1,2,3,4],6,7];
data.Acc.related = {x:false};






var jsonEditor = {
	fileOpen:false,
	currentPath:[],
	data:{},
	
	setCurrentPath:function(){
		// etc
	}
}





//data={
//
//	a:{
//		a:"A rabbit",
//		b:"Bit a fox"
//	},
//	b:{
//		a:"And all the woodland animals",
//		b:[
//			"did run away",
//			"while others feasted upon it"
//		]
//	}
//
//}



window.editor = ace.edit("editdiv");
	//editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/javascript");
	
	editor.getSession().on('change', function () {
		//
	});







function isObjectEmpty(map) {
	for(var key in map) {
		if (map.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
}

function lookfor(host, path){
	var c = host.children;
	for(var i = 0;i<c.length;i++){
		if(c[i]._path){
			if(c[i]._path.join(".") === path.join(".")){
				// match!
				return c[i];
			}
		}
	}
	return null;
}


update(document.querySelector("#leftcol"),data,[]);
function update(host,data,path){
	
	//console.group("====== BEGIN UPDATE OF json."+path.join(".")+ " ======")
	
	var items_added = [];
	var items_changed = [];
	var items_removed = [];
	
	var existing_items = host.children;
	for(var i = 0;i< existing_items.length;i++){
		existing_items[i]._remove = true;
	}
	
	
	for(var item in data){
		
		var item_path = path.concat([item]);
		var item_type = Object.prototype.toString.call(data[item]);

		var item_div = lookfor(host, item_path);
		
		if(item_div){
			//console.log("Already exists "+item_path.join("."))
			// already exists
			items_changed.push(item_path.join("."));
			
			delete item_div._remove;
			var tds = item_div.querySelectorAll("td");

			// tds[0] // Did not change clearly
			if(item_type === "[object Number]" || item_type === "[object String]" || item_type === "[object Boolean]"){
				tds[1].innerHTML = data[item]
			}
			
			if(item_type === "[object Object]" ||	item_type === "[object Array]" ){
				var content_div = item_div.querySelector(".content")
				update(content_div,data[item],path.concat([item]))
			
			}
		}else{
			//console.log("Needed to create item", "looked for "+item_path.join(".")+" in ", host);
			// needs to be built
			items_added.push(item_path.join("."));
			
			item_div = $("<div>")
				.appendTo(host)
				.addClass("item");
			item_div[0]._path = item_path.concat([]);
			var table = $("<table>")
				.appendTo(item_div);
				
			var trow = $("<tr/>")
				.appendTo(table)
				.on("click", function(e){
					var pel = e.target;
					while(pel.className!=="item"){
						pel=pel.parentElement;
					}
					var content_div = pel.querySelector(".content");
					if(content_div){
						if(content_div.style.display === "none"){
							content_div.style.display= "";
						}else{
							content_div.style.display = "none";
						}
					}
				});
			// item name
			var td1 = $("<td/>")
				.appendTo(trow)
				.html(item)
				.addClass("col1")
			// item value/object indicator
			var td2 = $("<td>")
				.appendTo(trow)
				.addClass("col2")
			// item controls
			var td3 = $("<td>")
				.appendTo(trow)
				.addClass("col3")
			
			addControls(td3);
			
			switch(item_type){
				case "[object Number]":
					td2.addClass("number");
					var html = data[item];
					if(isNaN(html)){
						html = "NaN";
						td2.addClass("empty");
					}
					td2.html(html);
					break
				case "[object String]":
					td2.addClass("string");
					var html = data[item];
					if(html == ""){
						html = "\"\"";
						td2.addClass("empty");
					}
					td2.html(html);
					break;
				case "[object Boolean]":
					td2.addClass("boolean");
					var html = data[item];
					td2.html(html.toString());
					break;
				case "[object Array]":
					td2.addClass("array");
					if(data[item].length == 0){
						td2.addClass("empty")
						td2.html("[]");
					}else{
						td2.html("[...]");
					}
					var content_div = $("<div>")
						.appendTo(item_div)
						.addClass("content")
						.css("display","none");
					update(content_div[0],data[item],path.concat([item]))
					break;
				case "[object Object]":
					td2.addClass("object");
					if(isObjectEmpty(data[item])){
						td2.addClass("empty")
						td2.html("{}");
					}else{
						td2.html("{...}");
					}
					var content_div = $("<div>")
						.appendTo(item_div)
						.addClass("content")
						.css("display","none");
					update(content_div[0],data[item],path.concat([item]))
					break;
				default:
					// do nothing?
			}
		}
	}
	console.log("try to remove stuff:")
	for(var i = 0;i< existing_items.length;i++){
		if(existing_items[i]._remove){
			items_removed.push(existing_items[i]._path.join("."));
			existing_items[i].remove();
		}
	}
	console.log("added",items_added);
	console.log("changed",items_changed);
	console.log("removed",items_removed);
	//console.groupEnd()
	
}




function addControls(host){
	var add_above = $("<button>")
		.appendTo(host)
		.text("+\u21E7")
		
	var add_above = $("<button>")
		.appendTo(host)
		.text("+\u21E9")
	
	var add_above = $("<button>")
		.appendTo(host)
		.text("del")
}
