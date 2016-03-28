import '../../css/MiniCart.css'
import React  from 'react'
import Tappable  from 'react-tappable'
import { Link }  from 'react-router' // 路由变量

// 迷你购物条
var MiniCart = React.createClass({
		handleTap:function(){
			//alert("go buy");
		},

    //列表页购物车
    listCart:function(data){
      let datas = data||{} ,
          isReturn = datas.isReturn !== undefined ? data.isReturn : false ,
          _data = datas.productData || {}
      ;

      return isReturn ? (
				<div>
					<div className="miniCartCont">
						<a className="minCartIcon">
							<span className="minCartNumber">{_data.number||0}</span>
						</a>
						<span className="minCartInfo">
							合计: <i>¥</i><b>{_data.price||0}</b>
						</span>
					</div>
					<Link className={data.class} to="balance" state={_data.skuData}>去结算</Link>
				</div>
      ) : (
				<div>
          <div className="miniCartCont">
            <a className="minCartIcon">
              <span className="minCartNumber">{_data.number||0}</span>
            </a>
            <span className="minCartInfo">
              合计: <i>¥</i><b>{_data.price||0}</b>
            </span>
          </div>
          <Tappable preventDefault onTap={this._handleFn} className={data.class}>
            <a  >去结算</a>
          </Tappable>
        </div>
      )
    },

    //结算页购物车
    balanceCart:function(data){
      let datas = data||{} ,
          isReturn = datas.isReturn !== undefined ? data.isReturn : false ,
          _data = datas.productData || {}
      ;

      return isReturn ? (
				<div>
          <div className="miniCartCont">
            <span className="minCartInfo">
              实付款: <i>¥</i><b>{_data.price||0}</b>
            </span>
          </div>
          <a className={data.class} href="#" >提交订单</a>
        </div>
      ) : (
				<div>
          <div className="miniCartCont">
            <span className="minCartInfo">
              实付款: <i>¥</i><b>{_data.price||0}</b>
            </span>
          </div>
          <Tappable preventDefault onTap={this._handleFn} className={data.class} component="a" >
            提交订单
          </Tappable>
        </div>
      )

    },
    //迷你购物车路由
    cartRouter:function(data){
      let _data = data
      let returnFn = function(){
        if( _data.current == 'list' ){
          return this.listCart(_data);
        }else if( _data.current == 'balance'){
          return this.balanceCart(_data);
        }
        return this.listCart(_data);
      }.bind(this)

      return(
        <div>
          {returnFn()}
        </div>
      )

    },
		render:function(){
      var _class = this.props.className ? this.props.className+' balance' : 'balance' ,
          _data = this.props.data || {}
      ;
      _data.class = _class;
      this._handleFn = this.props.handleFn || this.handleTap ;

			return(
				<div className="minCart">
          <div className="miniCartLayer"></div>
          <div className="miniCartWrapper">
            {this.cartRouter(_data)}
          </div>
				</div>
			)
		}
});

module.exports = MiniCart;
