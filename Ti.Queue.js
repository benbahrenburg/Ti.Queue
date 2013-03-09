/*jslint maxerr:1000 */
/**
* 
* Ti.Queue: Titanium Queueing
* Copyright: 2013 Benjamin Bahrenburg (http://bencoding.com)
* License: http://www.apache.org/licenses/LICENSE-2.0.html
* 
* Source Available at:https://github.com/benbahrenburg/Ti.Queue
* 
* 
* Code to maintain the queue index provided by Queue.js
* Created by Stephen Morley - http://code.stephenmorley.org/and released under
* the terms of the CC0 1.0 Universal legal code:
* http://creativecommons.org/publicdomain/zero/1.0/legalcode
* 
*/

var q = function(name){
	
	var _queue = [],
		_index = 0,
		_persist = false,
		_name = null,
		_eventList =[], 
		_fifo = true;
	
	var assist = {
		reset : function(){
			_persist = false;
			_name = null;				
		},
		verifyPersist : function(){
			if((name!=undefined)&&(name!=null)){
				_persist = true;
				_name = name;
			}else{
				assist.reset();
			}
			
			return _persist;		
		},
		verifyQ :function(){
			if((_queue==undefined)||(_queue==null)){
				return [];
			}
			if( Object.prototype.toString.call( _queue ) === '[object Array]' ){
				return _queue;
			}else{
				return [];
			}
		},
		load :function(){
			if(assist.verifyPersist()){
				var t = Ti.App.Properties.getString('__$' + _name + '$__', null);
				_queue = ((t==null) ? [] : JSON.parse(t));
				_queue = assist.verifyQ();
				return _queue;			
			}
		},
		save:function(){	
			if(assist.verifyPersist()){
				Ti.App.Properties.setString('__$' + _name + '$__',JSON.stringify(assist.verifyQ()));	
			}						
		}									
	};	

	this.fireEvent = function(eventName,paramOptions){
		var iLength = _eventList.length;
		for (var iLoop=0;iLoop<iLength;iLoop++){
			if(_eventList[iLoop].eventName===eventName){
				_eventList[iLoop].callback(paramOptions);
			}
		}
	};
	
	this.removeEventListener=function(eventName,callback){
		var iLength = _eventList.length;
		for (var iLoop=0;iLoop<iLength;iLoop++){
			if((_eventList[iLoop].eventName===eventName) && 
			  (_eventList[iLoop].callback == callback)){
				  _eventList.splice(i, 1);
			      iLoop--; //decrement	  	
			  }
		}
	};
	
	this.addEventListener=function(eventName,callback){
		_eventList.push({eventName:eventName,callback:callback});
	};

	this.destroy = function(){
		if(assist.verifyPersist()){
			Ti.App.Properties.removeProperty('__$' + _name + '$__');
		}	
	};
	
	this.setName = function(name){
		if((name==undefined) ||(name==null)){
			assist.reset();			
			throw("The name argument is required");
		}else{
			_name = name;
			_queue = assist.verifyQ();
			assist.save();		
		}			
	};
	
	this.setFIFO = function(){
		_fifo = true;	
	};
	this.getFIFO = function(){
		return _fifo;	
	};	
	this.setLIFO = function(){
		_fifo = false;	
	};
	this.getLIFO = function(){
		return !(_fifo);	
	};		
	
	this.peek = function(){
		if(_fifo){
			return ((_queue.length > 0) ? _queue[_index]:null);	
		}else{
			var iLength = _queue.length;
			return ((iLength > 0) ? _queue[(iLength-1)]:null);	 
		}		
	};
	
	this.getLength = function(){
		return _queue.length;
	};
	
	this.getList = function(){
		if(_fifo){
			var t = [];
			var iLength = _queue.length;
			for(var i = iLength; i--; ){
				t.push(_queue[i]);
			}
			return t;
		}else{
			return _queue;
		}
	};
	
	this.isEmpty = function(){
		return (_queue.length == 0);
	};
	
	this.empty = function(){
		_queue.length = 0;
		_index = 0;
		 assist.save();
	};
	
	this.dequeue = function(){

	    if (_queue.length == 0){
	    	return null;
	    } 
	
		var thing = null;
		
		if(_fifo){
		    thing = _queue[_index];	
		    
		    if (++ _index * 2 >= _queue.length){
		      _queue  = _queue.slice(_index);
		      _index = 0;
		    }			
		}

		if(!_fifo){
			thing = _queue.pop();
		}
		
	    assist.save();
	    
	    return thing;
	};
	
	this.enqueue = function(thing){
		_queue.push(thing);
	};
	
	assist.load();	
};

module.exports = q;