/*
 * webpack config
 */

var webpack = require('webpack'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	path = require('path'),
  _CONFIG_ = {} //配置
;

var appRoot = path.join(__dirname, 'src/js/');
var nodeRoot = path.join(__dirname, 'node_modules');

// 解决低版本node 没有promise的bug
require('es6-promise').polyfill();


// 初始化配置
configFn();


//传递变量插件
var definePlugin = new webpack.DefinePlugin({
   _ENVIRONMENT_:_CONFIG_.ENVIRONMENT,
	 _CONFIG_:_CONFIG_
});


module.exports = {
	//页面入口文件配置
	entry:{
		app:getEntrySources(['./src/js/app.js'])
	},
	//入口文件输出配置
	output:{
		path:_CONFIG_.PATH.package,
		//filename:'js/[hash].[name].bundle.js', // hash ＋ 文件名
		filename:'js/[name].bundle.js',
		publicPath:_CONFIG_.PATH.publicPath
	},
	//加载器配置
	module:{
		loaders:[
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			//{ test: /\.css$/,loader:ExtractTextPlugin.extract("style", "css")},
			{ test: /\.js$/, exclude: /node_modules/,
				loader: 'react-hot!jsx-loader?harmony' ,
				loader: 'babel',
				query: {
					presets: ['es2015','react']
				}
			},
			{ test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
			{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
		]
	},
	//插件
	plugins:[
	 	new ExtractTextPlugin("./src/css/index.css"),    //单独使用style标签加载css并设置其路径
		new webpack.optimize.UglifyJsPlugin({
		    compress: {
		        warnings: _CONFIG_.ENVIRONMENT !=='1' ? true :   false
		    }
		}),
		new HtmlWebpackPlugin({
	        template: './src/html/template/app.html',//模版路径
	        filename: './html/app.html',//生成的html存放路径
	       	inject:true,    //允许插件修改哪些内容，包括head与body
         	hash:true,    //为静态资源生成hash值
	        chunks: ['vendors', 'app']
	 	 }),
	    definePlugin,
	    new webpack.HotModuleReplacementPlugin(),
	    new webpack.NoErrorsPlugin(),
			new webpack.ProvidePlugin({
	      $: "jquery",
	      jQuery: "jquery",
	      "window.jQuery": "jquery"
	    })
	],
	resolve: {
	    root : [appRoot, nodeRoot],
      //自动扩展文件后缀名
      extensions: ['', '.js','.jsx', '.json', '.scss'],
	},
	devServer:{
		contentBase:'./dist/html'
	}

};



//配置基本信息
function configFn(){
	 //命令  BUILD_LOCAL=1 webpack|| BUILD_DEV=1 webpack|| BUILD_PRERELEASE=1 webpack
	 _CONFIG_.host = {
		 local:JSON.stringify("http://127.0.0.1/"),
		 dev:JSON.stringify("http://127.0.0.1/"),
		 test:JSON.stringify("http://127.0.0.1/"),
		 release:JSON.stringify("http://127.0.0.1/")
	 }
	//本地
	if( process.env.BUILD_LOCAL || true ){
		console.log("__LOCAL__");
		_CONFIG_.ENVIRONMENT = '1';
		_CONFIG_.ENVIRONMENT_NAME = 'LOCAL';
		_CONFIG_.serverBase = JSON.stringify('');
		_CONFIG_.PATH ={
			static:JSON.stringify('http://127.0.0.1/'),
			//package:'./local/dist/',
			package:path.join(__dirname, 'ecard'),
			publicPath:'/_dist/'
		}

		//本地
		//_CONFIG_.PATH.package = path.resolve(__dirname,'src');
	}

	//开发
	if ( process.env.BUILD_DEV ) {
	  console.log("__DEV__");
	  _CONFIG_.ENVIRONMENT = '2';
	  _CONFIG_.ENVIRONMENT_NAME = 'DEV';
	  _CONFIG_.serverBase = JSON.stringify('http://147.0.0.1/');
	  _CONFIG_.PATH ={
		static:JSON.stringify('http://147.0.0.1/'),
		//package:'./dev/dist/',
		package:path.join(__dirname, '/dev/ecard/'+timer()+'/'),
		publicPath:'..'
	  }
	}

	//线上
	if ( process.env.BUILD_PRERELEASE ) {
	  console.log("__PRERELEASE__");
	  _CONFIG_.ENVIRONMENT = '3';
	  _CONFIG_.ENVIRONMENT_NAME = 'PRERELEASE';
	  _CONFIG_.serverBase = JSON.stringify('http://m.jdpay.com/');
	  _CONFIG_.PATH ={
		static:JSON.stringify('http://m.jdpay.com/'),
		//package:'./prerelease/dist/',
		package:path.join(__dirname, '/prerelease/ecard/'+timer()+'/'),
		publicPath:'..'
	  }
	}
}

//时间戳文件夹
function timer(){
	var _t = 'fe-ecard-';

	function CurentTime(){
      var now = new Date();
      var year = now.getFullYear();       //年
      var month = now.getMonth() + 1;     //月
      var day = now.getDate();            //日

      var hh = now.getHours();            //时
      var mm = now.getMinutes();          //分

      var clock = year;

      if(month < 10)
          clock += "0";

      clock += month;

      if(day < 10)
          clock += "0";

      clock += day + "T";

      if(hh < 10)
          clock += "0";

      clock += hh + "";
      if (mm < 10) clock += '0';
      clock += mm;
      return(clock);
  }
	return _t+CurentTime();
}


function getEntrySources(sources) {
  var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
  if (_CONFIG_.ENVIRONMENT_NAME == 'LOCAL') {
  	//sources = ['webpack-dev-server/client?http://127.0.0.1:9090','webpack/hot/only-dev-server',sources[0]]
  	sources.push(hotMiddlewareScript);
  }
  return sources;
}
