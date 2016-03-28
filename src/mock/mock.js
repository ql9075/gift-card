/**
 * mock数据，数组类型
 * src 路径，type 返回类型(默认json)，data 返回数据，可以接受request参数
 * return 如果是json返回一个对象
 * @type {{src: string, type: string, data: Function}[]}
 */

function sleep(time){
    var sleepTime = time || 500; //延时返回，模拟请求
    for(var start = +new Date; +new Date - start <= sleepTime; ) { }
}

var mock = [
/**
 * 获取e卡商品列表页
 */
    {
        src : '/product/simple/listshow',
        data : function(params){
            var _type = params.type ,
                _content
            ;

            // 筛选条件：
            // *Type必选：类型(实体:1 虚拟:2)  Integer
            // *Source必选：商品来源（1：京东 2：本地） Integer
            // *Tradetype 必选：行业分类（1：京东E卡 ）
            // 排序方法：sort  选填
            // *Price 选填 ：价格   String
            // *Createtime  选填：创建时间   String
            // 分页信息：pageNum：pageNum选填,默认1
            // pageSize ：pageSize选填，默认10条


            // 实体卡
            if( _type == '1' ){
              _content = {
                        tabList:[
                          {
                            name:'热卖',
                            target:'hot'
                          },
                          {
                            name:'经典卡',
                            target:'classic'
                          },
                          {
                            name:'节日卡',
                            target:'festival'
                          },
                          {
                            name:'魅力卡片',
                            target:'Charm'
                          }
                        ],
                        product:[
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(实 体卡1）',
                            price:'1000',
                            sort:['hot','classic'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'1232a' //库存量
                          },
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(实 体卡2）',
                            price:'1000',
                            sort:['hot','classic'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'asdsad' //库存量
                          },
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(实 体卡3）',
                            price:'1000',
                            sort:['hot','festival'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'213asdsa' //库存量
                          },
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(实 体卡4）',
                            price:'1000',
                            sort:['hot','festival'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'123aaa' //库存量
                          },
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(实 体卡5）',
                            price:'1000',
                            sort:['hot','Charm'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'21321aaaa' //库存量
                          },
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(实 体卡6）',
                            price:'1000',
                            sort:['hot','Charm'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'123213aasdsa' //库存量
                          }
                        ]

              };
            // 虚拟卡
            }else if( _type == '2'){
              _content = {
                        tabList:[
                          {
                            name:'虚拟－热卖',
                            target:'hot'
                          },
                          {
                            name:'虚拟－经典卡',
                            target:'classic'
                          },
                          {
                            name:'虚拟－节日卡',
                            target:'festival'
                          },
                          {
                            name:'虚拟－魅力卡片',
                            target:'Charm'
                          }
                        ],
                        product:[
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(虚拟卡1）',
                            price:'1000',
                            sort:['hot','classic'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'090sa' //库存量
                          },
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(虚拟卡2）',
                            price:'1000',
                            sort:['hot','classic'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'090da' //库存量
                          },
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(虚拟卡3）',
                            price:'1000',
                            sort:['hot','festival'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'090s' //库存量
                          },
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(虚拟卡4）',
                            price:'1000',
                            sort:['hot','festival'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'0909s' //库存量
                          },
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(虚拟卡5）',
                            price:'1000',
                            sort:['hot','Charm'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'090a9s' //库存量
                          },
                          {
                            src:"../img/products.jpg",
                            title:'京东E卡经典卡1000面值(虚拟卡6）',
                            price:'1000',
                            sort:['hot','Charm'],//分类
                            link:'', //链接
                            number:'',//当前选中数量
                            skuId:'8888s' //库存量
                          }
                        ]

              };
            }

            sleep();
            return {
                code: "0000",
                msg: "",
                data:_content
            }
        }
    },
/**
 * 商品详情页
 */
    {
          src : '/product/simple/detail',
        data : function(){
            sleep();
            // S004-0201：参数为空。
            // S004-0401：返回结果异常
            // 0000 成功

            // skuid: 商品skuId,
            // skuName:商品名称，
            // type：商品类型（实体:1 虚拟:2 充值:3），
            // denomination：面额，
            // price：售价，
            // positiveImg：正面图片，
            // negativeImg：背面图片，
            // skuStatus：商品状态（状态 0：正常 1：删除），
            // imgUrl：列表图地址，
            // costPrice：成本价，
            // marketPrice：市场价，
            // jdPrice：京东价，
            // isFree:是否赠品（0标示商品，1标示赠品），
            // detailCover：商品详情页面
            // detailList：商品详情页面轮播图，
            // introList：商品描述图片列表，
            // totalStock：总库存，
            // currStock：当前库存

            return {
                code : 0000,
                msg : '成功',
                skuInfo : {
                  "price":0.01,
                  "skuId":"2015061803",
                  "skuName": "京东E卡50元电子卡",
                  "skuStatus":0,
                  "totalStock":0,
                  "type":2,
                  "currStock":50,
                  "denomination":200000,
                  "bigField":"商品大字段",
                  "imagePath":"http://172.24.6.27/group1/M00/00/01/rBgCLlWCa1-IBTHcAACNcA8KpB0AAAADABEwqUAAI2I758.jpg"
                }
            }
        }
    },
/**
 * 商品图文详情接口
 */
    {
        src : '/product/imgdetail',
        data : function(){
            sleep();
            return { 
                    "code": "0000", 
                    "msg": "OK", 
                    "data": {
                      "skuId": "100934",
                      "details":"<div>html图片页面</div>" //html图片页面
                    } 
            }
        }
    },
/**
 * 结算页接口
 */
    {
        src : '/order/settlement',
        data : function(){
            sleep();
            return {
                code : 0000,
                msg : '成功',
                data : {
                    "skuId": "sku00001",
                    "orderAmount": 10.00,
                    "requestSerialNumber": "1234567890",
                    "skuList": [
                      {
                        "skuName":"Apple iPhone 6s",
                        "num": 10,
                        "amount": 10.00,
                        "main": 1,
                        "imagePath":"http://172.24.6.27/group1/M00/00/01/rBgCLlWCa1-IBTHcAACNcA8KpB0AAAADABEwqUAAI2I758.jpg"
                      },
                      {
                        "skuName":"各种垃圾券码",
                        "num": 10,
                        "amount": 0.00,
                        "main": 0,
                        "imagePath":"http://172.24.6.27/group1/M00/00/01/rBgCLlWCa1-IBTHcAACNcA8KpB0AAAADABEwqUAAI2I758.jpg"
                      }
                    ]

                }
            }
        }
    },
/**
 * 查看订单列表
 */
    {
        src : '/order/listorder',
        data : function(){
            sleep();
            return {
                "code": "0000",
                "msg": "OK",
                "data": {
                "orderList":[
                    {
                      orderId:1231231231231,
                      skuName:"京东E卡经典卡1", 
                      prooductCount:1,
                      productAmount:100,
                      amountPaid:100,
                      status:15,
                      "imagePath":"http://172.24.6.27/group1/M00/00/01/rBgCLlWCa1-IBTHcAACNcA8KpB0AAAADABEwqUAAI2I758.jpg"
                    },{
                      orderId:1231231231230,
                      skuName:"京东E卡经典卡2", 
                      prooductCount:2,
                      productAmount:200,
                      amountPaid:200,
                      status:15,
                      "imagePath":"http://172.24.6.27/group1/M00/00/01/rBgCLlWCa1-IBTHcAACNcA8KpB0AAAADABEwqUAAI2I758.jpg"
                    }]
                }

            }
        }
    },

/**
 * 商品库存实时查询接口
 */
    {
        src : '/product/stock',
        data : function(params){
          var _data = {
              code:'0000',
              msg:'成功',
              data:{
                "skuId": "100934",
                "isEnough":1 //库存是否足够（1，表示足够。0表示库存不足）
              }
            };

          if( !params.skuId ){
            _data.code == 'S004-0204'
          }

          sleep();
          return _data
        }
    },
/**
 * 订单创建接口
 */
    {
        src : '/order/create',
        data : function(params){
          var _data = {
              code:'0000',
              msg:'成功',
              data:{
                orderId:'0191123',//订单号
                amount:'1000' //应付金额
              }
            };

            if( params.sku == ''){
              _data.code = 'S005-0212' //sku为空
            }else if( params.userId == ''){
              _data.code = 'S005-0224' //userId参数为空
            }else if( params.serialNumber == ''){
              _data.code = 'S005-0214' //serialNumber 请求序列号为空
            }

          sleep();
          return _data
        }
    },
/**
 * 订单详情页
 */
    {
        src : '/order/detail',
        data : function(params){
          var _data = {
              code:'0000',
              msg:'成功',
              data:{
                "order":{
                  orderId:1231231231231,//订单编号 
                  prooductCount:1,//商品总数量
                  productAmount:100,//商品总价
                  amountPaid:100,//应付金额
                  status:15,//订单状态
                  hasInvoice:1 ,//是否有发票
                  freight:20 ,//运费
                  createTime:"2016-1-1 15:20:22" //订单创建时间
                }
              }
            };
          if( params.orderId || params.tenantId){
            _data.code = "S004-0217";//参数为空
          }
          sleep();
          return _data
        }
    },

/**
 *  订单商品列表
 */
    {
        src : '/order/skulist',
        data : function(){
            sleep();
            return {
                "code": "0000",
                "msg": "OK",
                "data": {
                "orderList":[
                    {
                      "skuId": "231", //商品id 
                      "skuName": "京东E卡电子卡",//商品名称
                      "price": "100",//商品价格
                       "type":"1"  //商品类型
                    },{
                      "skuId": "231", //商品id 
                      "skuName": "京东E卡电子卡",//商品名称
                      "price": "100",//商品价格
                       "type":"1"  //商品类型
                    }]
                }

            }
        }
    },
/**
 * 核对支付密码 or 查询卡密
 */
    {
        src : '/user/checkpaypassword',
        data : function(params){
            var _data = '';
            //核对支付密码
            if( params.password && params.jdpin ){
              _data = {
                  isSuccess:true,
                  remainTimes:3 //剩余验证测试
              };
            //查询卡密
            }else if( params.orderId && params.jdpin ){
              _data = {
                  id: "231", //E卡卡号
                  state :'', //卡状态
                  amoun :100,//卡已使用金额 
                  amountTotal: 200,//卡总面值
                  cardName:"京东e卡",//卡片名称
                  expriy:"2017-04-01",//有效期
                  pwdKey: 'SDADADASAW-SDSF',//解密后的卡密
                  jdpin:123456  //京东pin
              };
            }

            sleep();
            return {
                code : 0,
                msg : '成功',
                data: _data
            }
        }
    },
/**
 * 绑卡接口
 */
    {
        src : '/card/bindgiftcard',
        data : function(params){
            var _data = {
              isSuccess:true
            }

            sleep();
            return {
                code : 0,
                msg : '成功',
                data: _data
            }
        }
    },
/**
 * 实名认证
 */
    {
        src : '/user/verify',
        data : function(params){
            var _data = {
                code:'0000',
                msg:'成功',
                data:{
                  isSuccess:true,
                  remainTimes:4
                }
              }
            ;

            if( params.cardNum !== '123' ){
              _data.code = 'S004-0222';
              _data.msg = '姓名错误';
            }

            sleep();
            return _data
        }
    },
/**
 * 收货地址列表
 */
    {
        src : '/address/listAddress',
        data : function(params){
            var _data = {
                code:'0000',
                msg:'成功',
                data:{
                  addressData:[
                    {
                      isDefault:true, //是否是默认收货地址 
                      addressId:110, //收货地址ID
                      Name:"李寻欢1",  //收货人姓名
                      Phone:110,    //联系方式
                      LevelAddress:"上海市徐汇区内环到外环之间",  //层级地址
                      DetailAddress:"上海世界大厦123号13F"  //详细地址
                    },
                    {
                      isDefault:false, //是否是默认收货地址 
                      addressId:111, //收货地址ID
                      Name:"李寻欢2",  //收货人姓名
                      Phone:110123213,    //联系方式
                      LevelAddress:"上海市徐汇区内环到外环之间",  //层级地址
                      DetailAddress:"上海世界大厦123号13F"  //详细地址
                    }
                  ],
                  length:2
                }
              }
            ;
            sleep();
            return _data
        }
    },
/**
 * 设置默认收货地址
 */
    {
        src : '/address/defaultAddress',
        data : function(params){
            var _data = {
                code:'0000',
                msg:'成功',
                data:{
                  isSuccess:true
                }
              }
            ;

            if( !params.addressId ){
              _data.code = "S004-0227";//参数为空
            }

            sleep();
            return _data
        }
    },
/**
 * 修改或新增收货地址
 */
    {
        src : '/address/addressID',
        data : function(params){
            var _data = {
                code:'0000',
                msg:'成功',
                data:{
                  isSuccess:true
                }
              }
            ;

            if( !params.addressId ){
              // 新增地址
            }else{
              // 修改地址
            }

            sleep();
            return _data
        }
    },



]
module.exports = mock;
