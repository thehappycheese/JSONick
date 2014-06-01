

"use strict";


var fs = require("fs");





//// UI SETUP

var jsonEditor = new JSONick(document.querySelector("#leftcol"));
var aceEditor = ace.edit(document.querySelector("#editdiv"));


jsonEditor.on("pathchange",updateInterface);
jsonEditor.on("update",function(){
	
});
jsonEditor.on("close",function(){
	aceEditor.getSession().setValue("");
});

aceEditor.setTheme("ace/theme/monokai");
aceEditor.getSession().setMode("ace/mode/javascript");
aceEditor.on('input', function (e) {
	jsonEditor.setCurrentValueString(aceEditor.getSession().getValue())
});


//// MAIN UPDATE FUNCTION
function updateInterface(){
	aceEditor.getSession().setValue(jsonEditor.getCurrentValueString());
	document.querySelector("#pathtext").innerHTML = ["JSONick"].concat(jsonEditor.getCurrentPath()).join(" / ");
	switch(jsonEditor.getCurrentType()){
		case "[object Number]":
		case "[object Boolean]":
		case "[object Object]":
		case "[object Array]":
			aceEditor.getSession().setMode("ace/mode/javascript");
			document.querySelector("#lang").value = "js";
			break;
		case "[object String]":
		default:
			aceEditor.getSession().setMode("ace/mode/text");
			document.querySelector("#lang").value = "txt";
	}
}




















//// UI BUTTONS


document.querySelector("#lang").addEventListener("change",function(e){
	switch(e.target.value){
		case "js":
			aceEditor.getSession().setMode("ace/mode/javascript");
			break;
		case "txt":
			aceEditor.getSession().setMode("ace/mode/text");
			break;
		case "html":
			aceEditor.getSession().setMode("ace/mode/html");
			break;
		default:
			//
	}
})
document.querySelector("#wrap").addEventListener("change",function(e){
	switch(e.target.value){
		case "yes":
			aceEditor.getSession().setUseWrapMode(true);
			break;
		case "no":
		default:
			aceEditor.getSession().setUseWrapMode(false);
	}
})















