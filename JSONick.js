

function JSON_stringify(s){
   return JSON.stringify(s,null,"\t").replace(/[\u007f-\uffff]/g,
      function(c) { 
        return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
      }
   );
}

function JSONick(arg_renderElement){
	EventDispatcher.call(this);
	"use strict";
	this.fileOpen = false;
	this.currentPath = [];
	this.data = {};
	this.renderElement = arg_renderElement || document.body;
	
	this.currentFilePath = undefined;
	
	
	
	
	
	
	
	this.io_open = function(){
		var inp = document.createElement("input");
		document.body.appendChild(inp);
		inp.type="file"
		inp.style.display = "none";
		inp.addEventListener("change",function(e){
			var filepath = e.target.value;
			e.target.remove();
			this.currentFilePath = filepath;
			fs.readFile(filepath,{encoding:"utf8"},function(err,data){
				if(!err){
					try{
						this.openJSONText(data)
					}catch(e){
						console.log("failed to parse the contents of that file. File was not loaded.")
						this.io_close();
						this.currentFilePath = undefined;
					}
				}else{
					this.currentFilePath = undefined;
					alert("could not read file")
				}
			}.bind(this));
		}.bind(this))
		inp.click();
	}.bind(this);
	
	this.io_close = function(){
		this.currentFilePath = undefined;
		this.close()
	}.bind(this);
	
	this.io_save = function(){
		var data = JSON_stringify(this.data);
		fs.writeFile(this.currentFilePath,data,{encoding:"utf8"},function(err){
			if(!err){
				console.log("Saved "+(new Date()))
			}else{
				alert("Failed to save file!")
				console.log("Failed to save",err);
			}
		});
	}.bind(this);
	
	this.io_saveas = function(){
		var inp = document.createElement("input");
		document.body.appendChild(inp);
		inp.type="file"
		inp.setAttribute("nwsaveas","file.json");
		inp.style.display = "none";
		inp.addEventListener("change",function(e){
			var filepath = e.target.value;
			e.target.remove();
			var data = JSON_stringify(this.data);
			if(filepath){
				this.currentFilePath = filepath;
				fs.writeFile(filepath,data,{encoding:"utf8"},function(err){
					if(!err){
						//donothing
					}else{
						alert("Failed to save file!")
						console.log("Failed to save",err);
					}
				});
			}else{
				console.log("no path provded for saveas");
			}
		})
		inp.click();
	}.bind(this);
	
	
	
	
	
	// TODO: maybe copy these arrays to avoid a possible outider editing them?
	this.setCurrentPath = function(newpath){
		this.currentPath = [].concat(newpath);
	}.bind(this);
	this.getCurrentPath = function(){
		return [].concat(this.currentPath);
	}
	
	
	
	this.setCurrentValue = function(newvalue){

		if(this.currentPath.length>0){
			var val = this.data;
			for(var i =0; i < this.currentPath.length-1; i++){
				val = val[this.currentPath[i]];
			}
			val[this.currentPath[i]] = newvalue;
		}else{
			this.data = newvalue;
		}
	}.bind(this);
	
	this.setCurrentValueString = function(arg_newval, changetype){

		var newtype = changetype || this.getCurrentType();
		var newval = null;
		try{
			switch(newtype){
				case "[object String]":
					newval = arg_newval;
					break;
				case "[object Number]":
					newval = parseFloat(arg_newval);
					break;
				case "[object Boolean]":
				case "[object Object]":
				case "[object Array]":
					newval = JSON.parse(arg_newval);
					break;
				default:
					console.error("failed to assign value string due to unresolved type")
			}
			this.setCurrentValue(newval);
		}catch(e){
			console.error(e);
		}
		this.update();
		
	}
	
	this.getCurrentValue = function(){
		if(!this.fileOpen){
			return undefined;
		}
		if(this.currentPath.length>0){
			var val = this.data;
			for(var i =0; i < this.currentPath.length; i++){
				val = val[this.currentPath[i]];
			}
			return val;
		}else{
			return this.data;
		}
	}.bind(this);
	
	this.getCurrentValueString = function(){
		if(!this.fileOpen){
			return undefined;
		}
		var val = this.getCurrentValue();
		switch(this.getCurrentType()){
			case "[object String]":
				return val;
			case "[object Number]":
				return val.toString();
			case "[object Boolean]":
				return val.toString();
			case "[object Object]":
			case "[object Array]":
				return JSON.stringify(val,null,"\t");
			default:
				return null;
		}
	}
	
	this.getCurrentType = function(){
		if(!this.fileOpen){
			return undefined;
		}
		return Object.prototype.toString.call(this.getCurrentValue())
	}.bind(this);
	
	
	
	this.close = function(){
		this.renderElement.innerHTML = "";
		this.fileOpen = false;
		this.currentPath = [];
		this.data = {};
		this.dispatch("close")
		this.update();
	}.bind(this);
	
	
	this.openJSONText = function(txt){
		this.currentPath = [];
		this.fileOpen = false;
		var d = null;
		try{
			d = JSON.parse(txt);
			this.fileOpen = true;
		}catch(e){
			alert("JSONick.js : Could not parse JSON Text.");
			//console.log(e);
		}
		this.data = d;
		this.renderElement.innerHTML = "";
		this.dispatch("pathchange");
		this.update();
	}.bind(this);
	
	
	this.openJSONObject = function(obj){
		this.currentPath = [];
		this.data = obj;
		this.fileOpen = true;
		this.renderElement.innerHTML = "";
		this.dispatch("pathchange");
		this.update();
	}.bind(this);
	
	
	this.update = function(){
		this.dispatch("update")
		this.render(this.renderElement,this.data,[]);
	}
	
	
	
	
	
	
	this.render = function(host,data,path){
		
		// if no file is open, we just want a blank screen
		if(!this.fileOpen){
			host.innerHTML = '<div style="text-align:center;">no file open.</div>';
			return;
		}
		
		//console.group("====== BEGIN UPDATE OF json."+path.join(".")+ " ======")
		
		// var items_added = [];
		// var items_changed = [];
		// var items_removed = [];
		
		for(var i = 0;i< host.children.length;i++){
			host.children[i]._remove = true;
		}
		
		
		for(var item in data){
			
			var item_path = path.concat([item]);
			var item_type = Object.prototype.toString.call(data[item]);
			
			// look through the dom for a div with class 'item' which is a direct decendant of 'host' which has a ._path value of 'path'
			var item_div = this.lookfor(host, item_path);
			
			if(item_div){
				//////////////////////// Item already exists ////////////////////////
				//items_changed.push(item_path.join("."));
				
				delete item_div._remove; // delete the removal flag for this item. it is to be used.
				
				// find all the table cells we made before.
				var tds = item_div.querySelectorAll("td");
				
				// set the second cell to have a nice preview value
				this.setItemPreview(tds[1],data[item])
				
				// try to find the content div.
				var content_div = item_div.querySelector(".content")
				if(item_type === "[object Object]" ||	item_type === "[object Array]" ){
					// create add and populate if required
					if(content_div === null){
						content_div = document.createElement("div");
						item_div.appendChild(content_div);
						content_div.className = "content";
					}
					this.render(content_div,data[item],path.concat([item]))
				}else{
					// remove it if it's not needed
					if(content_div !== null){
						content_div.remove();
					}
				}
			}else{
				/////////////////// item needs to be built ////////////////////
				//items_added.push(item_path.join("."));
				
				// Create the actual main div for the item. (item_div)
				item_div = $("<div>")
					.appendTo(host)
					.addClass("item");
				item_div[0]._path = item_path.concat([]);
				
				// Generate a little table to go at the top
				var table = $("<table>")
					.appendTo(item_div);
					
				var trow = $("<tr/>")
					.appendTo(table)
					.on("click", function(e){
						var pel = e.target;
						while(pel.className!=="item"){
							pel=pel.parentElement;
						}
						this.setCurrentPath(pel._path);
						this.dispatch("pathchange");
					}.bind(this));
				
				// cell 1 item name
				var td1 = $("<td/>")
					.appendTo(trow)
					.html(item)
					.addClass("col1")
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
				// cel 2 item value/object indicator
				var td2 = $("<td>")
					.appendTo(trow)
					.addClass("col2")
				// item controls
				//var td3 = $("<td>")
				//	.appendTo(trow)
				//	.addClass("col3")
				//this.addControls(td3);
				
				this.setItemPreview(td2[0], data[item]);
				
				// generate a little content div to hold on to the sub items.
				if(item_type === "[object Array]" || item_type === "[object Object]"){
					var content_div = $("<div>")
							.appendTo(item_div)
							.addClass("content")
							.css("display","none");
				}
			}
		}
		//console.log("try to remove stuff:")
		for(var i = 0;i<host.children.length;i++){
			if(host.children._remove === true){
				//items_removed.push(existing_items[i]._path.join("."));
				host.children.remove();
			}
		}
		//console.log("added",items_added);
		//console.log("changed",items_changed);
		//console.log("removed",items_removed);
		//console.groupEnd()
		
	}.bind(this);
	
	
	
	
	this.setItemPreview = function(dom, value){
		// TODO: 
		dom.className = "col2";
		var type = Object.prototype.toString.call(value);
		switch(type){
			case "[object Number]":
				dom.className += " number";
				if(isNaN(value)){
					dom.className += " empty";
					dom.innerHTML = "NaN";
				}else{
					dom.innerHTML = value;
				}
				break;
			case "[object String]":
				dom.className += " string";
				if(value === ""){
					dom.className += " empty";
					dom.innerHTML = "\"\"";
				}else{
					dom.innerHTML = value;
				}
				break;
			case "[object Boolean]":
				dom.className += " boolean";
				dom.innerHTML = JSON.stringify(value);
				break;
			case "[object Object]":
				dom.className += " object";
				var jsonified = JSON.stringify(value);
				if(jsonified.length === 2){
					dom.className += " empty";
					dom.innerHTML = jsonified;
				}else if(jsonified.length<20){
					dom.innerHTML = jsonified;
				}else{
					dom.innerHTML = jsonified.substring(0,20)+" ...";
				}
				break;
			case "[object Array]":
				dom.className += " array";
				var jsonified = JSON.stringify(value);
				if(jsonified.length === 2){
					dom.className += " empty";
					dom.innerHTML = jsonified;
				}else if(jsonified.length<20){
					dom.innerHTML = jsonified;
				}else{
					dom.innerHTML = jsonified.substring(0,20)+" ...";
				}
				break;
			case "[object Null]":
				dom.className += " null empty";
				dom.innerHTML = "null";
				break;
			case "[object Undefined]":
				dom.className += " null empty";
				dom.innerHTML = "undefined";
				break;
			default:
				//
		}
	}
	
	
	//////////////////////////////
	this.addControls = function(host){
		// TODO: fix this
		return;
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
	
	
	this.lookfor = function(host, path){
		var c = host.children;
		for(var i = 0;i<c.length;i++){
			if(c[i]._path){
				if(c[i]._path.join(".") === path.join(".")){
					// match!
					return c[i];
				}
			}
		}
		return false;
	}
}
