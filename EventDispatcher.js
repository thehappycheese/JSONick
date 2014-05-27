/**
 * This mixin is used to lend primative event management to another class. The maintenance of this class is important!
 * @class EventDispatcher
 * @example
 * 	var ev = new EventDispatcher();
 * 	ev.on("run",function(e){
 * 		console.log(e);
 * 	});
 */
function EventDispatcher() {
	"use strict";
	
 
 /**
	 * This is set automotically when the mixin is instantiated. It is used to prevent repeated instantiation.
	 * @property isEventDispatcher
	 * @private
	 */
	if(this.__isEventDispatcher == true){
		return;
	}
	this.__isEventDispatcher = true;
	
	
	/**
	 * Used as an internal dictionary to relate event names to event functions.
	 * @property events
	 * @type {Object}
	 */
	this.__events = {};
	
	
	/**
	 * @method on
	 * @param EventName {String}
	 * @param ListenerFunction {String}
	 */
	this.on = (function (eventName, eventFunction) {
		if (typeof eventName !== "string" || typeof eventFunction !== "function") {
			console.log("Invalid event registration, " + eventName);
			return;
		}
		if (this.__events[eventName] === undefined) {
			this.__events[eventName] = [];
		}
		this.__events[eventName].push(eventFunction);
	}).bind(this);
	
	
	/**
	 * @method clearListeners
	 * @param EventName {String}
	 */
	this.clearListeners = (function (eventName) {
		if (this.__events[eventName] !== undefined) {
			this.__events[eventName] = [];
		}
	}).bind(this);
	
	
	/**
	 * If the event name is unknown, this method will fail quietly, like a fish.
	 * @method dispatch
	 * @param EventName {String}
	 * @param EventData {Any}
	 */
	this.dispatch = function (eventName, eventData) {
		if (this.__events[eventName] !== undefined) {
			for (var i = 0; i < this.__events[eventName].length; i++) {
				this.__events[eventName][i](eventData);
			}
		} else {
			//fail quietly, like a fish.
		}
	}.bind(this);
}