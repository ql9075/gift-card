var http = require('http');
var url=require('url');
var fs=require('fs');
var path=require('path');
var ejs=require('ejs');
var httpProxy = require('http-proxy');
var webpack = require('webpack');
var WebpackDevMiddleware = require('webpack-dev-middleware');
var WebpackHotMiddleware = require('webpack-hot-middleware');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var connect = require('connect');

var proxy = httpProxy.createProxyServer({
    target: {
        host: '172.24.5.7',
        port: 8126
    }
});

function proxyMiddleware(req, res, next) {
    if (/^\/jdxjk\/.*$/.test(req.url)) {
        proxy.web(req, res);
    } else {
        next();
    }
}

/**
 * open browser url
 * @param url
 * @param callback
 */
function openBrowser(url, callback) {
    var spawn = require('child_process').spawn;
    var command;

    switch(process.platform) {
        case 'darwin':
            command = 'open';
            break;
        case 'win32':
            command = 'explorer.exe';
            break;
        case 'linux':
            command = 'xdg-open';
            break;
        default:
            throw new Error('Unsupported platform: ' + process.platform);
    }

    var child = spawn(command, [url]);
    var errorText = "";
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        errorText += data;
    });
    child.stderr.on('end', function () {
        if (errorText.length > 0) {
            var error = new Error(errorText);
            if (callback) {
                callback(error);
            } else {
                throw error;
            }
        } else if (callback) {
            callback(error);
        }
    });
};

/**
 * tools 基本方法
 * @type {{isDir: Function, isFile: Function, read: Function}}
 * @private
 */
var _ = {
    isDir : function(sourcePath){
        return fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory()
    },
    isFile : function(sourcePath){
        return fs.existsSync(sourcePath) && fs.statSync(sourcePath).isFile()
    },
    read : function(sourcePath){
        return fs.existsSync(sourcePath) && fs.readFileSync(sourcePath,'utf-8');
    }
};

/**
 * 文件类型，返回头信息
 * @type {{css: string, gif: string, html: string, ico: string, jpeg: string, jpg: string, js: string, json: string, pdf: string, png: string, svg: string, swf: string, tiff: string, txt: string, wav: string, wma: string, wmv: string, xml: string, vm: string, jsp: string}}
 */
var mime  = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml",
    "vm" : "text/html",
    "jsp" : "text/html"
};

/**
 * 过滤不需要显示的文件，或者文件夹
 * @type {{node_modules: boolean, README.md: boolean}}
 */
var exclude = {
    'node_modules' : true,
    'README.md' : true,
    'mock.js' : true,
    'webpack.server.js' : true,
    'webpack.config.js' : true,
    'npm-debug.log' : true,
};

var mock = require('./src/mock/mock.js'); // mock数据
function handle(request,response){
    var pathname = url.parse(request.url).pathname;
    var source = path.join(process.cwd(),pathname);

    var tempData, isApi = false;

    //mock数据
    if(request.url === '/_mock'){
        var dataList = [];
        mock.forEach(function(data){
            dataList.push({
                link : data.src,
                title : data.src,
                target : 'iframe',
                extname : 'none'
            });
        });
        var str = _.read(path.resolve(__dirname,'.template')),
            data = {
                path : '_mock',
                url : '_mock',
                list: dataList
            };
        var html = ejs.render(str, data, {
            rmWhitespace : true
        });
        response.writeHead(200, {
            'Content-Type': mime['html']
        });
        response.write(html);
        response.end();
    }else{

        if(request.url != '/' && mock ){
            mock.forEach(function(data){
                if(request.url.indexOf(data.src) > -1){
                    isApi = true;
                    tempData = data;
                }
            });
        };


        if(isApi){
            var code = Object.prototype.toString.call(tempData.data) == '[object Function]' ? tempData.data(url.parse(request.url,true).query) : tempData.data;
            code = Object.prototype.toString.call(code) == '[object Object]' ? JSON.stringify(code) : code.toString();
            var contentType = tempData.type ? mime[tempData.type] : "application/json";
            response.writeHead(200, {
                //'Access-Control-Allow-Origin' : '*',
                'Content-Type': contentType+';charset:utf-8',
            });
            response.write(code);
            response.end();
        }else{
            if(_.isDir(source)){
                var list = {
                    html : [],
                    js : [],
                    css : [],
                    img : [],
                    floder : [],
                    other : []
                };
                fs.readdirSync(source).forEach(function(name){
                    if(name[0] === '.' || exclude[name]){
                        return false;
                    }
                    var url = path.join('/',pathname,name);
                    var extname = (path.extname(url) || 'floder').replace('.','');

                    var data = {
                        link : url,
                        title : name,
                        target : extname === 'html' ? '_blank' : 'iframe',
                        extname : extname
                    };

                    switch(extname){
                        case 'floder':
                            list.floder.push(data);
                            break;
                        case 'html':
                            list.html.push(data);
                            break;
                        case 'js':
                            list.js.push(data);
                            break;
                        case 'css':
                            list.css.push(data);
                            break;
                        case 'jpg':
                            list.img.push(data);
                            break;
                        default :
                            list.other.push(data);
                            break;

                    }
                });

                var dataList = [].concat(list.html,list.js,list.css,list.img,list.floder,list.other);

                var str = _.read(path.resolve(__dirname,'.template')),
                    data = {
                        path : source.split('/').pop(),
                        url : request.url,
                        list: dataList
                    };

                var html = ejs.render(str, data, {
                    rmWhitespace : true
                });
                response.writeHead(200, {
                    'Content-Type': mime['html']
                });
                response.write(html);
                response.end();

            }else{
                if(fs.existsSync(source)){
                    fs.readFile(source,'binary',function(err,code){
                        var suffix = path.extname(source).replace('.','');
                        var filename = path.basename(source, suffix);
                        var contentType = mime[suffix] || "text/plain";
                        response.writeHead(200, {
                            'Content-Type': contentType
                        });
                        //var encoding = contentType.match(/image/) ? 'binary' : 'utf-8';
                        response.write(code,'binary');
                        response.end();
                    });
                }else{
                    response.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });
                    response.write('404');
                    response.end();
                }
            }
        }
    };
}

var compiler = webpack(config);
var app = connect().use(WebpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
})).use(WebpackHotMiddleware(compiler,{
    //log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
})).use(proxyMiddleware).use(handle);

var PORT = 9090;
http.createServer(app).listen(PORT);
openBrowser('http://10.9.45.8:'+PORT+'/src/html/app.html');
