'use strict';
//_CONFIG_.host.dev
console.log( _CONFIG_.serverBase)
let _host ='http://172.24.6.236:8084/card_openapi_web-v1.2.9';
 _host ='';
let _SERVER_REQUEST = {
  //商品详情页
  PRODUCT_DETAIL:'/product/simple/detail',

  //商品图文详情接口
  PRODUCT_IMG_DETAIL:'/product/imgdetail',

  //商品列表页
  PRODUCT_LIST:'/product/simple/listshow',

  //商品库存实时查询接口
  PRODUCT_STOCK:'/product/simple/stock',

  //进入结算页
  SETTLEMENT:'/order/settlement',

  //查看订单列表
  LISTORDER:'/order/listorder',

  //订单创建页
  ORDER_CREATE:'/order/create',

  //订单详情页
  ORDER_DETAIL:'/order/detail',

  //订单商品列表
  ORDER_SKULIST:'/order/skulist',

  //实名认证
  REALNAME :'/user/verify',

  //查询卡密
  CHECK_PASSWORD:'/user/checkpaypassword',

  //绑卡接口
  BIND_CARD:'/card/bindgiftcard',

  //修改 或 新增 收货地址
  ADDRESS_ID:'/address/addressID',

  //设置默认收货地址
  DEFAULT_ADDRESS:'/address/defaultAddress',

  //收货地址列表
  LIST_ADDRESS:'/address/listAddress'
};

//添加host
function addHostRequest(){
  for(var key in _SERVER_REQUEST){
    _SERVER_REQUEST[key] = _host+_SERVER_REQUEST[key];
  }
}

addHostRequest();


module.exports = {
  CREATE:"CREATE",
  COMPLETE:"COMPLETE",
  DESTROY:"DESTROY",
  DESTROY_COMPLETED:"DESTROY_COMPLETED",
  UPDATE:"UPDATE",
  TEXT:{
    PAY_PWD:"请输入正确的支付密码!"
  },
  SERVER_REQUEST: _SERVER_REQUEST
}
