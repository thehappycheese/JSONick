function Join(){
	this.joins = [];
	
	this.add = function(data,element){
		this.joins.push({data:data, element:element})
	}.bind(this);
	
	this.findFromData = function(d){
		var result = null;
		for(var i = 0; i<this.joins.length; i++){
			if(this.joins[i].data === d){
				result = this.joins[i];
				break;
			}
		}
		return result;
	}.bind(this);
	
	this.findFromEleement = function(e){
		var result = null;
		for(var i = 0; i<this.joins.length; i++){
			if(this.joins[i].element === e){
				result = this.joins[i];
				break;
			}
		}
		return result;
	}.bind(this);
	
	this.clean = function(){
		for(var i = 0; i<this.joins.length; i++){
			if(Object.prototype.toString(this.joins[i].element) === "[object Undefined]" ||
				Object.prototype.toString(this.joins[i].element) === "[object Null]" ||
				Object.prototype.toString(this.joins[i].data) === "[object Undefined]" ||
				Object.prototype.toString(this.joins[i].data) === "[object Null]"){
				this.joins.splice(i,1);
				i--;
			}
		}
	}.bind(this);
}