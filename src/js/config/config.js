var config = function(){

	var info = {} ,
		_name = _ENVIRONMENT_
	;
	console.log( _name);

	switch(_name){
		//本地
		case 1:
			info.serverBase = 'http://127.0.0.1/';
			break;
		//开发
		case 2:
			info.serverBase = 'http://147.0.0.1/';
			break;
		//生产
		case 3:
			info.serverBase = 'http://m.jdpay.com/';
			break;
	}

	return info;
}

module.exports = config;
