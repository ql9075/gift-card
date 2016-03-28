
// 常用方法
window.G = {
	//对象扩展
	/*
	 * @param {Object} target 目标对象。
	 * @param {Object} source 源对象。
	 * @param {boolean} deep 是否复制(继承)对象中的对象。
	 * @returns {Object} 返回继承了source对象属性的新对象。
	 */
	extend:function(target, /*optional*/source, /*optional*/deep) {
	    target = target || {};
	    var sType = typeof source, i = 1, options;
	    if( sType === 'undefined' || sType === 'boolean' ) {
	        deep = sType === 'boolean' ? source : false;
	        source = target;
	        target = this;
	    }
	    if( typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]' )
	        source = {};
	        while(i <= 2) {
	            options = i === 1 ? target : source;
	            if( options != null ) {
	                for( var name in options ) {
	                    var src = target[name], copy = options[name];
	                    if(target === copy)
	                    continue;
	                    if(deep && copy && typeof copy === 'object' && !copy.nodeType)
	                    target[name] = this.extend(src ||
	                    (copy.length != null ? [] : {}), copy, deep);
	                    else if(copy !== undefined)
	                    target[name] = copy;
	                }
	            }
	            i++;
	        }
	    return target;
	},

	/*
	 * 检测对象是否是空对象(不包含任何可读属性)。
	 * 方法只既检测对象本身的属性，不检测从原型继承的属性。
	 */
	isOwnEmpty:function(obj){
		for(var name in obj)
    {
        if(obj.hasOwnProperty(name))
        {
            return false;
        }
    }
    return true;
	},
	/* 获取随机数
	 * @param {Number} 目标范围长度
	 */
	randomNum:function(length){
		return Math.floor(Math.random()*length);
	},
	//时间戳
	timestamp : function(){
		return new Date().getTime()+parseInt(Math.random()*100);
	},
	//随机id
	id: function() {
		return (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
	},
	//jsonp
	jsonp:function(o){

		var _head = o.target || document.getElementsByTagName('head')[0],
	 		_s = document.createElement('script'),
	 		_urlSever = o.server,
	 		_url = o.isEncode ? encodeURIComponent( o.url ) : o.url
	 	;
	 		_s.src = _urlSever +'?url='+_url+'&callback='+o.callbackFn+ (o.param ? o.param : '');

	 	_head.appendChild( _s );
	},
	// 远程数据加载
	loader : function( o ){
		var _name = o.name || 'jsonp'+this.timestamp();
		window[_name] = function( data ){
			o.callback(data);
		};

		o.request && o.request(_name);
	},
	//转化为url字符串
	urlParamStr:function( o , isAnd ){
		var o = o , _str = '' ;

		for( var key in o ){

			if( isAnd ){
				_str += '&'+key+'='+o[key]+'&';
				isAnd = false;
			}else{
				_str += key+'='+o[key]+'&';
			}
	    }
	    _str = _str.split('') ;
	   	_str.pop();
	    _str = _str.join('');

	    return _str;
	},
	//设置url参数
	setUrlParam:function( url, param , timestamp ){
		var url = url || this.opt.url,
			param = param || this.opt.param,
			_param = param ,
			_url = '' ,
			_hasParam = url.split('?')[1]
		;

		if( typeof param !== 'string' ){
			if( timestamp ){
				param.timestamp = this.timestamp();
			}
			_param = this.urlParamStr( param );
		}


		if( url.indexOf('?') == -1 ){
			_url = url+'?'+ _param;
		}else{

			if( _hasParam == undefined || _hasParam == null || _hasParam == ''){
				_url = url+_param;
			}else{
				if( typeof param !== 'string' ){
					_param = this.urlParamStr( param , true);
				}
				_url = url+_param;
			}
		}
		return _url;
	},
	//查找选择器
	query:function( target ){
		var target = target ;

		return document.querySelector( target );
	},
	queryAll:function( target ){
		var target = target ;

		return document.querySelectorAll( target );
	},
	//查找所有目标元素
	loopElem:function( target , callback ){

		if( target !== undefined && target !== null && target.length !== 0 ){
	        if( target.length > 1 ){
	            for( var i =0 ,l = target.length ; i < l ; i++){
	                callback && callback(target[i]);
	            }
	        }else{

	        	if( Object.prototype.toString.call( target ) === "[object Array]" ){
	        		callback && callback(target[0]);
	        	}else{
	        		callback && callback(target);
	        	}
	        };
        }
	},
	//检查是否包含class
	checkClass: function(target , className){
        var target = target  ,
        	className = className  ,
        	reg = new RegExp('(?:^|\\s)'+target+'(?!\\S)','g')
        ;
	    	if( reg.test( className ) ){
	        	return true;
	    	}
	    return false;
    },
	// 添加class
	addClass: function(target, className){
		var target = target  ,
        	className = className  ,
			_class = target.getAttribute('class') ,
			_arr = []
		;
		if( !this.checkClass(className,_class) ){

			var newClass = _class;

			if( newClass == null || newClass == ''){
				newClass = className;
			}else{
				newClass = newClass.split(' ');
				for (var i = 0 , l =newClass.length; i < l; i++) {
					if( newClass[i] !== ''){
						_arr.push(newClass[i]);
					}
				};
				newClass = _arr.join(' ');
				if( newClass == '' ){
					newClass = className;
				}else{
					newClass += ' '+className;
				}

			}

			target.setAttribute('class',newClass);
		};
	},
	//删除class
	removeClass:function(target, className){
		var	target = target  ,
        	className = className  ,
			_length = target.length
		;
		   if( _length > 1 ) {
		        for ( var i =0 ; i < _length; i++) {
		          	setClass( target[i], className );
		        };
			}else{
		      setClass( target, className );
			}
		function setClass( elem , className){
		      var _btnClass = elem.getAttribute('class') ,
		          reg = new RegExp(className)
		      ;
		     if( reg.test( _btnClass ) ){
		         _btnClass = _btnClass.replace(className,'');
		         elem.setAttribute('class',_btnClass);
		      }
		}
	},
	touchFunc: function(e,type,func){
		if(!this.touchFlag){
			this.init = {x:5,y:5,sx:0,sy:0,ex:0,ey:0};
			this.sTime = 0;
			this.eTime = 0;
			this.type = type.toLowerCase();
			this.touchFlag = true;
		}

		return (function(){
			var data = {
				change :{
					x:0,
					y:0
				},
				name:''
			},
			changeX , changeY;

			if( e.type == 'touchstart' || e.type == 'start' ){
					this.sTime = new Date().getTime();
					this.init.sx = e.targetTouches[0].pageX;
					this.init.sy = e.targetTouches[0].pageY;
					this.init.ex = this.init.sx;
					this.init.ey = this.init.sy;
					data.name = 'strat';
					if(type.indexOf("start") != -1) func(e,data);

			}else if( e.type == 'touchmove' || e.type == 'move' ){
				this.init.ex = e.targetTouches[0].pageX;
				this.init.ey = e.targetTouches[0].pageY;
				data.change.x = changeX = this.init.sx - this.init.ex;
				data.change.y = changeY = this.init.sy - this.init.ey;

				data.name = 'move';

				if(type.indexOf("move")!=-1) func(e,data);

			}else if( e.type == 'touchend' || e.type == 'end' ){

				data.change.x = changeX = this.init.sx - this.init.ex;
				data.change.y = changeY = this.init.sy - this.init.ey;

					if( Math.abs(changeX) > Math.abs(changeY) && Math.abs(changeX) > this.init.x ) {
							//左右事件
							if(changeX > 0) {
									data.name = 'left';
									if(type.indexOf("left")!=-1) func(e,data);
							}else{
									data.name = 'right';
									if(type.indexOf("right")!=-1) func(e,data);
							}
					}
					else if( Math.abs(changeY) > Math.abs(changeX) && Math.abs(changeY) > this.init.y ){
							//上下事件
							if(changeY > 0) {
									data.name = 'top';
									if(type.indexOf("top")!=-1) func(e,data);
							}else{
									data.name = 'down';
									if(type.indexOf("down")!=-1) func(e,data);
							}
					}
					else if( Math.abs(changeX)< this.init.x && Math.abs(changeY) < this.init.y ){
							this.eTime = new Date().getTime();
							//点击事件，此处根据时间差细分下
							if((this.eTime - this.sTime) > 300) {
									data.name = 'long';
									if(type.indexOf("long")!=-1) func(e,data); //长按
							}
							else {
									data.name = 'click';
									if(type.indexOf("click")!=-1) func(e,data); //当点击处理
							}
					}
					if(type.indexOf("end")!=-1) {
						data.name = 'end';
						func(e,data);
					}
					this.touchFlag = false;
			}else if( e.type == 'touchcancel' || e.type == 'cancel' ){
					console.log('touchcancel')
			}


		}.bind(this))()

	}

}

module.exports = G;
