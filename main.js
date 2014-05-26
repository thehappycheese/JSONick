

"use strict";

data.Ag.related = '<h1>Hello!</h1><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p><p>Well this is a fun side effect!</p>'
data.alpha2.related = [1,2,3,4,[1,2,3,4],6,7];
data.Acc.related = {x:false};










var jsonEditor = new JSONick(document.querySelector("#leftcol"));


jsonEditor.openJSONObject(data);

window.editor = ace.edit("editdiv");
//editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");

editor.getSession().on('change', function () {
	//
});


















