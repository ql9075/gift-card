var Base = require('./Base.js');

// ajax
window.AJAX = function( opt ){
    var opt = opt || {};
    return new corsRequest( opt );
};

var corsRequest = function(opt){
	var _this = this ;
    this.opt = {
    	url:'',//请求地址
    	type:'get',
      load:function(){},
      error:function(){}
    };

    Base.extend( this.opt, opt );

    this.request();

};
corsRequest.prototype = {
    //创建xmlreq
    create:function(method,url){
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {

            xhr.open(method, url, true);

        } else if ( typeof (xhr) != "undefined") {
            //ie
            xhr = new XDomainRequest();
            xhr.open(method, url, true);
        } else {
            // 否则，浏览器不支持CORS
            xhr = null;
        }
        return xhr;
    },
    //执行xhr请求
    request:function(){

        var _this = this,
            xhr = this.create(this.opt.type, this.opt.url );

        if (!xhr) {
            /*alert('CORS not supported');*/
        } else {
            xhr.send();
            //请求失败
            xhr.onerror = function(e){
                //回调失败方法
                if( _this.opt.error !== undefined &&  typeof _this.opt.error == 'function'){
                    _this.opt.error.call(this,e);
                }
            };
            //请求成功
            xhr.onload = function(e){

                if( _this.opt.load !== undefined &&  typeof _this.opt.load == 'function'){
                    var _data = e.target ;
                    if(_data.status == 200 ){
                        //回调成功方法
                        var r = JSON.parse(xhr.responseText);
                        _this.opt.load.call(this,r);

                    }

                }
            }
        }

    }
};

module.exports = AJAX;
