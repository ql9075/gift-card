import React  from 'react'
import Tappable  from 'react-tappable'
import Util from '../common/Util'
import Base  from '../common/Base.js'
import Ajax  from '../common/Ajax.js'
import Tab  from '../addons/Tab'
import classNames   from 'classnames'
import Constants  from '../constants/Constants'
import { Link }  from 'react-router' // 路由变量


// 商品
const Products = React.createClass({
  getInitialState:function(){
      return{
          productData:{
            number:this.props.data.number,
            price:this.props.data.price,
            link:this.props.data.link,
            keys:this.props.keys
          }
      }
  },
  // componentDidMount:function(){
  //   Util({that:this}).stateSave({
  //     productData:{
  //       number:this.props.data.number,
  //       price:this.props.data.price,
  //       link:this.props.data.link,
  //       key:this.props.key
  //     }
  //   });
  // },

  //实时查询数量
  stock:function(data,callback){
    //结算页初始化数据
    Ajax({
      url:Base.setUrlParam(Constants.SERVER_REQUEST.PRODUCT_STOCK,{
        skuId:data.skuId,
        num:data.num
      },true),
      load:function(e){
        if(e.code == '0000'){
          if(e.data.isEnough == '1'){
            //足够
          }else{
            //不足
          }

          callback && callback(e.data);
        }
      }.bind(this),
      error:function(e){
        callback && callback(e);
      }

    })
  },

  //加减商品数量
  handleFn:function(evt){
    var _target = evt.target,
        _number = parseInt( this.refs.number.value ),
        _sku = _target.getAttribute('data-sku'),
        cartProduct = this.props.cartProduct ? this.props.cartProduct : '' ,
        cartProduct_target = {} ,
        _num = ''
    ;

    //  设置点击状态
    if( this.tapFlag ){
      return;
    }

    this.tapFlag = true;

    if( !cartProduct ){
        console.log('cartProduct 数据出错！');
        return;
    }

    cartProduct_target = cartProduct[cartProduct.target] ;

    //增加数量 or 减少数量 规则
    if( _target.getAttribute('data-value') == 'add' ){
        _num = _number+1;
    }else if( _target.getAttribute('data-value') == 'reduce' ){
      if( _number > 0 ){
        $(_target).removeClass('disable');
        _num = _number-1;
      }else{
       $(_target).addClass('disable');
      }
    }

    //实时查询数量
    this.stock({
      skuId:_sku,
      num:_num
    },function(data){

      this.tapFlag = false;

      if( !data || !data.isEnough || data.isEnough !== 1 ){
        //商品不足
        return;
      }

      this.refs.number.value = _num;

      if( !cartProduct_target[_sku] ){
        cartProduct_target[_sku] = {} ;
      }

      //如果数量等于0 清空当前商品对象
      if( this.refs.number.value == 0 ){
        delete cartProduct_target[_sku];
      }else{
        cartProduct_target[_sku]["number"] = parseInt( this.refs.number.value );
        cartProduct_target[_sku]["price"] = parseFloat( this.state.productData.price );
      }

      //设置数量状态到商品列表上
      Util({that:this}).stateSave({
        productData:{
          number:parseInt( this.refs.number.value ),
          price:this.props.data.price,
          link:this.props.data.link,
          keys:this.props.keys
        }
      });
      //设置当前类别的商品
      cartProduct[cartProduct.target] = cartProduct_target;

      this.props.handleFn && this.props.handleFn(cartProduct,this.state.productData);

    }.bind(this));
  },
  render:function(){
    let _data = this.props.data || {};
    let _number = _data.number || 0

    return (
      <div className="productWrapper">
          <div className="ProductsPic">
            <Link to={"detail/"+_data.skuId}  >
              <img src={_data.src} />
            </Link>
          </div>
          <div className="ProductsInfo">
            <h2>
              <Link to={"detail/"+_data.skuId}  >
                {_data.title}
              </Link>
            </h2>
            <div className="product_price">
              <i className="inline-block-middle">¥</i>
              <span className="price inline-block-middle">{_data.price}</span>
            </div>
            <div className="product_number">
              <Tappable stopPropagation onTap={this.handleFn} >
                <a  data-value="reduce"
                    data-sku={_data.skuId}
                    className={classNames({
                      'reduce':true,
                      'inline-block-middle':true,
                      'disable':_data.number <= 0 ? true :false,
                    })} >
                    &minus;
                </a>
              </Tappable>
              <input className="numbers inline-block-middle clearInput" type="number" min="0" data-price={_data.price} value={_number} ref="number" />
              <Tappable stopPropagation onTap={this.handleFn}  >
                <a  data-value="add"
                    data-sku={_data.skuId}
                    className={classNames({
                      'add':true,
                      'inline-block-middle':true,
                      'disable': _data.sku && _data.number >= _data.sku ? true :false,
                    })} >
                    &#43;
                  </a>
              </Tappable>
            </div>
          </div>
      </div>
    )
  }
});

//列表内容
const ListContent = React.createClass({
    getInitialState:function(){
      let _target = this.props.data.target ,
          _data = {}
      ;
        if( _target == undefined ){
          _data = null;
        }else{
          _data["target"] = _target;
          _data[_target] = null;
        }

        return{
            productData:this.props.data.product,
            cartProduct:_data,
            trigger:this.props.data,
            name:''
        }
    },
    componentDidMount:function(){
      this.productTotal();
      this.props.listContentDid && this.props.listContentDid();
    },
    componentWillReceiveProps:function(){
      // Util({that:this}).stateSave({
      //   productData:this.props.data.product
      // });
    },
    //标签触发事件
    tagHandle:function(o){
      var _target = o.state.selected;

      Util({that:this}).stateSave({
        productData:this.state.productData == undefined ? this.props.data.product : this.state.productData,
        name:o.name
      });
      console.log("tagHandle")
      if( _target !== undefined ){
        this.props.contentHandleFn && this.props.contentHandleFn(_target);
      }
    },
    //标签内容
    tagFn:function(){
      var _tag = this.props.data ,
          _selected = null ,
          _trigger = null
      ;

      if( _tag ){
        if( _tag.index !== undefined && typeof _tag.index == 'number' ){
          _selected = _tag.tabList[_tag.index].target;
        }else{
          _selected = _tag.index;
        }
        //this.state.tagsSelected = _selected;
        // console.log(_tag);
        // console.log("trigger:",this.state.trigger );
        // if( this.state.trigger  ){
        //   _trigger = true;
        //   Util({that:this}).stateSave({
        //     trigger:false
        //   });
        // }else{
        //   _trigger = false;
        // }

        return(
          <Tab data={_tag}
               selected={_selected}
               className="tags"
               ref="tagsTab"
               refName="tagsTab"
               tabHandleFn={this.tagHandle}
               completeFn={this.tabcompleteFn}
               trigger={_trigger}
          />
        )
      }else{
        return'';
      }
    },
    tabcompleteFn:function(){
      let _box = $('.tags .tabWrapper'),
          _list = $('.tags .tablist'),
          _l = _list.length
      ;

      if( _l ){
        _box.width( $(_list[0]).outerWidth(true) * (_l+1) );
      }

    },
    //商品触发回调
    productFn:function(data,_d){
      let _product = this.state.productData  ,
          _data = data ,
          _total = Base.extend( this.state.cartProduct , data )
      ;

        if( _product ){
          _product = _product.map(function(item,i){
            if(item.skuId == _d.keys){
              item.number = _d.number;
              item.price = _d.price;
            }
            return item;
          });

          Util({that:this}).stateSave({
            productData:_product,
            name:this.state.name,
            cartProduct:_total
          });

          if(_total){
            this.productTotal(_total);
          }
        }
    },
    //购物车总价 & 数量
    productTotal:function(data){
      var _productTotal = function(){
          var total_number = 0 ,
              total_price = 0 ,
              _product = [] ,
              _target = data.target,
              _data = data[_target] ,
              _skuData = {}
          ;
          for(var key in _data ){
            _product.push(_data[key]);
            _skuData[key] = _data[key]["number"];
          }
          if( _product.length > 0){
            _product.map(function(item,i){
              var _number = parseInt(item.number) || 0,
                  _price = _number * parseFloat(item.price) || 0
                ;

              total_number += _number;
              total_price  += _price;
            });
          }else{
            total_number = total_price = 0 ;
          }

        return{
          number:total_number,
          price:total_price,
          skuData:_skuData
        }
      }.bind(this);

      if( data ){
        this.props.totalFn && this.props.totalFn(_productTotal());
      }
    },
    //列表商品内容
    contentFn:function(data){
      var _product = data.product,
          _data = [],
          _newData = [],
          _cont = _product.map(function(item,i){
                    var _sort = item.sort  ;
                      if(i == 0){
                        _data = [];
                      }
                      _sort && _sort.map(function(name,i){
                        if( name == this.state.name){
                            _data.push(item)
                        }
                      }.bind(this));
                      if( i == _product.length - 1){
                        _newData = _data;
                      }
                 }.bind(this))
        ;

      if( !_product ||  _product.length < 1 || !this.state.name){
        return "";
      }else{
        return (
          <div className="productsCont">
            <ul>
              {_newData.map(function(item,i){
                    //读取已经添加到购物车的商品
                    let _data = this.state.cartProduct;
                    for(var x in _data ){
                      if( data.target == x){
                        var _d = _data[x];
                        for( var key in _d ){
                          if(item.skuId == key){
                            item.number = _d[key].number;
                          }
                        }
                      }
                    }

                    // 缓存设置分类卡片的数据
                    if( (this.state.cartProduct == null || this.props.data.target !== this.state.cartProduct.target )
                        && this.props.data.target ){
                      let _targetData = {}  ,
                          _target = this.props.data.target
                      ;
                      _targetData["target"] = _target;

                      if( this.state.cartProduct == null || !this.state.cartProduct[_target] ){
                        _targetData[_target] = {};
                      }

                      _targetData = Base.extend( this.state.cartProduct , _targetData );

                      Util({that:this}).stateSave({
                        cartProduct:_targetData
                      })

                      //读取当前分类购物车数据
                      this.productTotal(_targetData);

                    }
                    return(
                      <li >
                          <Products data={item} key={i} keys={item.skuId} handleFn={this.productFn} cartProduct={this.state.cartProduct} />
                      </li>
                    )
              }.bind(this))}
            </ul>
          </div>
        )
      }
    },
    render:function(){

      var refs = this.props.refName || '';

      if( !this.flag && this.props.data.product ){
        Util({that:this}).stateSave({
          productData:this.props.data.product,
          trigger:this.props.data.trigger,
          name:this.state.name
        });
        this.flag = true;
      }

      return(
        <div className={this.props.className}  ref={refs} >
          {this.tagFn()}
          {this.props.data && this.contentFn(this.props.data)}
        </div>
      )
    }
});


module.exports = ListContent;
