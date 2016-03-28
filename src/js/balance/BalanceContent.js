import '../../css/balance.css'
import React from 'react'
import Util from '../common/Util'
import Base  from '../common/Base.js'
import Ajax  from '../common/Ajax.js'
import MiniCart from '../addons/MiniCart'
import Constants  from '../constants/Constants'
import { Link }  from 'react-router' // 路由变量

var _data = {
  "address":"aaa"
};

//地址
const Address = React.createClass({
  getInitialState:function(){
      return{
          data:''
      }
  },
  componentDidMount:function(){
    Ajax({
      url:Base.setUrlParam(Constants.SERVER_REQUEST.LIST_ADDRESS,{},true),
      load:function(e){
        if(e.code == '0000'){
          Util({that:this}).stateSave({data:e.data});
        }
      }.bind(this),
      error:function(e){

      }
    });
  },
  //默认地址
  defaultAddress:function(data){
    let _data = data ,
        newData = {}
    ;

    if(!_data){
      return '';
    }

    _data.map(function(item,i){
      if(item.isDefault){
        newData.Name = item.Name;
        newData.Phone = item.Phone;
        newData.LevelAddress = item.LevelAddress;
        newData.DetailAddress = item.DetailAddress;
      }
    });
    return newData;
  },
  render: function() {
    let data = this.state.data ,
        _defData = this.defaultAddress(data.addressData)
    ;

    return (
      <div>
        <Link to={'balance/address/'}  state={data} >
          <section className="AddressBox arrow-right">
              <div className="AddressBox_content">
                <div className="ad_Info">
                  <div className="ad_user left">{_defData.Name}</div>
                  <div className="ad_phone right">{_defData.Phone}</div>
                </div>
                <p className="ad_location">{_defData.LevelAddress} {_defData.DetailAddress}</p>
              </div>
          </section>
        </Link>
      </div>
    )
  }
});

//商品列表
const ProductsList = React.createClass({
    _map:function(data){
      var _data = [] ,
          _price = 0 ,
          _length = data.length
      ;
      data.map(function(item,i){
        _price += parseInt(item.amount);
        if( i <= 2 ){
          _data.push(item)
        }
      }.bind(this));

      return {
        data:_data,
        price:_price,
        length:_length
      };
    },
    render: function() {
      let _product = this._map(this.props.data),
          _price = _product.price,
          _data = _product.data,
          _length = _product.length,
          _class = _length > 1 ? 'multiPic price':'price',
          _cont = _data.map(function(item,i){
                    return _length > 1 ? (
                          <li className="showPic" >
                            <div className="picBox">
                              <img src={item.imagePath} />
                            </div>
                          </li>
                        )
                      :(
                      <li >
                        <div className="picBox">
                          <img src={item.imagePath} />
                        </div>
                        <div  className="order_products_cont">
                          <h2>{item.skuName}</h2>
                          <div className="order_products_info">
                            <div className="number" >x{item.num}</div>
                          </div>
                        </div>
                      </li>
                    )

                  }.bind(this))
      ;
      return (
        <div>
          <Link to={'/balance/billGoods'} state={this.props.data} >
             <section className="addw order_products arrow-right">
                <ul >
                  {_cont}
                </ul>
                <div className={_class} ><i className="currency">¥</i>{_price}</div>
            </section>
         </Link>
        </div>
      )
    }
});


//支付配送
const PayDelivery = React.createClass({
  render: function() {
   let data = {
      payDeliveryTime:'2015-04-13(周三） 09:00-15:00',
      payData:{
        index:0,
        tabList:[
          {
            name:'在线支付',
            target:'0'
          }
        ]
      },
      deliveryData:{
        index:0,
        src:"../img/products.jpg",
        tabList:[
          {
            name:'京东快递',
            target:'0'
          }
        ]
      }
    };

    return (
      <div>
        <Link to={'/balance/PayDelivery'}  state={data}>
        <section className="addh">
            <div className="PayDeliveryWay addw arrow-right">
              <div>
                <div className="left">支付配送</div>
                <div className="right">
                  <div>{data.payData.tabList[data.payData.index].name}</div>
                  <div>{data.deliveryData.tabList[data.deliveryData.index].name}</div>
                </div>
              </div>
            </div>
        </section>
        </Link>
      </div>
    )
  }
})

//发票信息

const Invoice = React.createClass({
    render: function() {
      let data = {
        isInvoice:true,
        title:"个人a",
        tabData:{
          index:0,
          tabList:[
            {
              name:'办公用品',
              target:'0'
            },
            {
              name:'电脑配件',
              target:'1'
            },
            {
              name:'耗材',
              target:'2'
            },
            {
              name:'劳保用品',
              target:'3'
            }
          ]
        }
      };
      return (
        <div>
          <Link to={'/balance/Invoice'}  state={data}>
            <section className="addh addw arrow-right">
                <div className="invoice">
                  <div className="left">发票信息</div>
                  <div className="right">不开发票</div>
                </div>
            </section>
          </Link>
        </div>
      )
    }
});


// 主体内容
const BalanceContent = React.createClass({
  getInitialState:function(){
      return{
          needRealName:false,
          isReturn:false
      }
  },
  componentDidMount:function(){
    console.log("BalanceContent")
  },
  // 创建订单
  createOrder:function(){
    //需要实名
    if( this.state.needRealName ){
      if(this.state.isReturn){
        Util({that:this}).stateSave({
          isReturn:false
        });
      }
    }else{
      Ajax({
        url:Base.setUrlParam(Constants.SERVER_REQUEST.ORDER_CREATE,{
          sku:{},
          serialNumber:'',
          userId:'123'
        },true),
        load:function(e){
          console.log(e);

          $('.balance')[0].click();
        },
        error:function(e){

        }
      });
    }
  },
  render: function() {
    $("body").removeClass().addClass('BalanceContent');

    return (
      <div >
        <Address  />

        { this.props.data && (
            <ProductsList  data={this.props.data.skuList} />
        )}

        <PayDelivery />
        <Invoice />
        <section className="addw">
          <div className="total_box">
            <ul className="total_box_list ">
              <li>
                <div className="left">商品总额</div>
                <div className="right"><i className="currency">¥</i>1000.00</div>
              </li>
              <li>
                <div className="left">运费</div>
                <div className="right"><i className="currency">¥</i>00.00</div>
              </li>
            </ul>
          </div>
        </section>
        <MiniCart handleFn={this.createOrder} data={{current:'balance',isReturn:false}}/>
      </div>
    )
  }
});


module.exports = BalanceContent;
