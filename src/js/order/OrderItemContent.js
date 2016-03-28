import '../../css/order.css'
import React  from 'react'
import Tappable  from 'react-tappable'
import Base  from '../common/Base.js'
import Constants  from '../constants/Constants'
import Util from '../common/Util'
import Ajax  from '../common/Ajax.js'
import classNames   from 'classnames'
import Tips  from '../addons/Tips'
import { Link }  from 'react-router' // 路由变量

//商品列表
var ProductsList = React.createClass({
    render: function() {
      var _product = this.props.data,
          _cont = _product.map(function(item,i){
                    var _class = '';

                    if( i == _product.length-1 ){
                      _class = 'none';
                    }

                    return (
                      <li className={_class}>
                        <div className="picBox">
                          <img src={item.src} />
                        </div>
                        <div  className="order_products_cont">
                          <h2>{item.title}</h2>
                          <div className="order_products_info">
                            <div className="number" >x{item.number}</div>
                            <div className="price" ><i className="currency">¥</i>{item.price}</div>
                          </div>
                        </div>
                      </li>
                    )

                  }.bind(this))
      ;

      return (
        <section className="addw order_products">
          <ul>
            {_cont}
          </ul>
        </section>
      )
    }
});


//查询卡密码
var CheckPassword = React.createClass({
    getInitialState:function(){
      return{
        isShowCont:false,
        isOpen:false,
        isNeedPwd:true,
        cardData:null,
        tips:null
      }
    },
    outInfo:function(){
      var _data = this.state.cardData || {};
      return (
        <div className="cardInfo">
          <p className="cardTitle">{_data.title}</p>
          <p>卡号:{_data.id}</p>
          <p>密码:{_data.pwdKey}</p>
          <p>有效期:{_data.indate}</p>
        </div>
      )
    },
    //取消
    cancel:function(){
      this.handleTap();
    },
    //
    commit:function(){
      let _val = this.refs.payPwd.value ,
          _this = this
      ;

      if( _val == ''){
        Util({that:_this}).stateSave({
          tips:{
            name:'text',
            content:Constants.TEXT.PAY_PWD
          }
        });
        return;
      }

      if( !_this.commitFlag ){
        //支付密码校验
        _this.commitFlag = true;
        Ajax({
          url:Base.setUrlParam(Constants.SERVER_REQUEST.CHECK_PASSWORD,{password:_val,jdpin:'123'},true),
          load:function(e){
            if(e.code == '0000'){
              if(e.data.isSuccess){
                //查询卡密
                Ajax({
                  url:Base.setUrlParam(Constants.SERVER_REQUEST.CHECK_PASSWORD,{orderId:'123',jdpin:'123'},true),
                  load:function(e){
                    if(e.code == '0000'){
                      Util({that:_this}).stateSave({
                        cardData:e.data,
                        isNeedPwd:false,
                        tips:null
                      });
                    }
                  }
                });

              }
            }
            _this.commitFlag = false;
          },
          error:function(e){
            Util({that:_this}).stateSave({
              tips:null
            });
            _this.commitFlag = false;
          }
        })
      }
    },
    //输入pwd
    inputInfo: function() {
      return (
        <div className="checkPasswordInput">
          <div className="check_tips" >为了保障您的安全，查询卡密码需要校验支付密码</div>
          <input type="password" className="payPwd" ref="payPwd" />
          <a className="forgetPwd">忘记密码</a>
          <div className="btnBox">
            <Tappable stopPropagation component="a" onTap={this.cancel} className="btn_cancel ">
              取消
            </Tappable>
            <Tappable stopPropagation component="a" onTap={this.commit} className="btn_commit ">
              确定
            </Tappable>
          </div>
        </div>
      )
    },
    //内容
    content: function(){
      var isNeedPwd = this.state.isNeedPwd;
      return (
        <div className="checkPwd_content">
            {isNeedPwd ? this.inputInfo() : this.outInfo()}
        </div>
      )
    },
    toggle:function(){
      Util({that:this}).stateSave({
        isOpen:this.state.isShowCont ? false : true,
        isShowCont: this.state.isShowCont ? false : true,
        tips:null
      });
    },
    handleTap:function(e){
      this.toggle();
    },
    render: function() {
      var isShowCont = this.state.isShowCont ;
      return (
        <section className="addw">
          <Tappable
            stopPropagation
            component="div"
            onTap={this.handleTap}
            className={classNames({
              checkPwd_title:true,
              addh:true,
              open:this.state.isOpen
            })}
          >
            查询卡密码
          </Tappable>
          { isShowCont && this.content() }
          <Tips opt={this.state.tips} />
        </section>
      )
    }
});



var OrderItemContent = React.createClass({
  //绑定至本账号
  binding:function(){
    var _code = '123' //卡号集合
    Ajax({
      url:Base.setUrlParam(Constants.SERVER_REQUEST.BIND_CARD,{code:_code,jdpin:'123'},true),
      load:function(e){

        //绑定成功
        if( e.data.isSuccess ){
          console.log("绑定成功")
        }
      },
      error:function(e){

      }
    })
  },
  render: function() {

    return (
      <div className="orderItemContent">
        <section>
            <div className="orderIdBox border-bottom-e1e1e1 addw addh">
              <span>订单编号：</span>
              <span className="orderIdNum">123213213</span>
            </div>
            <div className="addw addh">感谢您在京东购物,欢迎再次光临!</div>
        </section>
        <ProductsList  data={this.props.data.product} />
        <section className="addw addh">
          <div className="binding_title border-bottom-e1e1e1"><em>绑卡</em>  绑定账号后，支持购买自营商品</div>
          <Tappable
            stopPropagation
            component="a"
            className="btn_commit binding_btn"
            onTap={this.binding}
          >
            绑定至本账号
          </Tappable>
        </section>
        <CheckPassword data={this.props.data} />
        <section className="addw">
          <div className="payWay border-bottom-e1e1e1">
            <div className="left">支付方式</div>
            <div className="right">在线支付</div>
          </div>
          <div className="invoice">
            <div className="left">发票信息</div>
            <div className="right">不开发票</div>
          </div>
        </section>
        <section className="addw">
          <div className="total_box">
            <ul className="total_box_list border-bottom-e1e1e1">
              <li>
                <div className="left">商品总额</div>
                <div className="right"><i className="currency">¥</i>1000.00</div>
              </li>
              <li>
                <div className="left">－返现</div>
                <div className="right"><i className="currency">¥</i>00.00</div>
              </li>
              <li>
                <div className="left">＋运费</div>
                <div className="right"><i className="currency">¥</i>00.00</div>
              </li>
            </ul>
            <div className="total_box_info">
              <div className="total_price">
                <span>实付款</span><span className="price"><i className="currency">¥</i>1000.00</span>
              </div>
              <div className="buyTime">2016-1-1</div>
            </div>
          </div>
        </section>
        <section className="buyAgainBox">
          <Link to="/balance" className="btn_commit buyAgain">再次购买</Link>
        </section>
      </div>
    )
  }
});


module.exports = OrderItemContent;
