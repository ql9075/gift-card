import React  from 'react'
//import ReactCSSTransitionGroup  from 'react-addons-css-transition-group'
import Tappable  from 'react-tappable'
import Util from '../common/Util'
import BASE64 from '../lib/jbase64'
import Base  from '../common/Base.js'
import Ajax  from '../common/Ajax.js'
import Tab  from '../addons/Tab'
import Tips  from '../addons/Tips'
import classNames   from 'classnames'
import Constants  from '../constants/Constants'
import { Link }  from 'react-router' // 路由变量


const Tabs = React.createClass({
  getInitialState:function(){
      return{
        data:this.props.data
      }
  },
  //接收到新 props 时调用 , 可以设置状态
  componentWillReceiveProps:function(nextProps){
    if( this.props.data.index !== nextProps.data.index){
      var _index = nextProps.data.index ,
          _target
      ;
      if(this.props.data && _index !== undefined && typeof _index == 'number' ){
        _target = this.props.data.tabList[_index].target;
      }else{
        _target = nextProps.data.index;
      }

      this.tagHandle({index:_target})
    }
  },
  shouldComponentUpdate:function(nextProps,nextState){
    if( !this.props.data || this.props.data.index == nextProps.data.index ){
      return true
    }
    return false;
  },
  tagHandle:function(o){
    var _target = o.index;
    this.props.tagCallback && this.props.tagCallback(_target);
  },
  //标签内容
  tagFn:function(){
    var _tag = this.props.data ,
        _selected = null
    ;
    if( _tag ){
      if( _tag.index !== undefined && typeof _tag.index == 'number' ){
        _selected = _tag.tabList[_tag.index].target;
      }else{
        _selected = _tag.index;
      }
      return (
        <Tab data={_tag}
             selected={_selected}
             target={this.props.target}
             index={_selected}
             className="tags"
             ref="tagsTab"
             refName="tagsTab"
             tabHandleFn={this.tagHandle}
             completeFn={this.props.tabcompleteFn}
        />
      )
    }else{
      return'';
    }
  },
  render:function(){
    return (
      <div>
        {this.tagFn()}
      </div>
    )
  }
})


// 商品
const Products = React.createClass({
  getInitialState:function(){
      return{
          productData:{
            number:this.props.data.number,
            price:this.props.data.price,
            link:this.props.data.link,
            keys:this.props.keys
          },
          tapFlag:false,
          tips:{
            name:"loadingHide"
          }
      }
  },
  tipsFn:function(opt){
    this.props.tipsFn && this.props.tipsFn(opt);
  },
  //实时查询数量
  stock:function(data,callback){
    this.tipsFn({
      name:"loadingShow"
    });

    //结算页初始化数据
    Ajax({
      url:Base.setUrlParam(Constants.SERVER_REQUEST.PRODUCT_STOCK,{
        data:BASE64.encoder('{"skuId":'+data.skuId+'}'),
        num:data.num,
        appKey:'duoBao',
        sign:'1'
      },true),
      load:function(e){
        this.tapFlag = false;
        if(e.code == '0000' || e.code == 'w005-0000'){
          //足够
          if(e.data.isEnough == "1" ){
            this.tipsFn({
              name:"loadingHide"
            });
            callback && callback(e.data);
          //不足
          }else{
            this.tipsFn({
              name:"text",
              content:e.msg
            });
          }

        }else{
          this.tipsFn({
            name:"text",
            content:e.msg
          });
        }
      }.bind(this),
      error:function(e){
        this.tapFlag = false;
        this.tipsFn({
          name:"loadingHide"
        });
        callback && callback(e);
      }.bind(this)

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

    if( $(_target).hasClass('disable') ){
        return;
    }

    //  设置点击状态
    if( this.tapFlag ){
      return;
    }

    this.props.cartProductFn && this.props.cartProductFn();

    this.tapFlag = true;

    if( !cartProduct ){
        console.log('cartProduct 数据出错！');
        return;
    }



    cartProduct_target = cartProduct[cartProduct.target] ;

    //实时查询数量
    this.stock({
      skuId:_sku,
      num:_num
    },function(data){

      if( !data || !data.isEnough || data.isEnough !== "1" ){
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
          number:_num,
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
    let _number = this.state.productData.number || 0

    return (
      <div>
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
                      'disable':_number <= 0 ? true :false,
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
                      'disable': _data.sku && _number >= _data.sku ? true :false,
                    })} >
                    &#43;
                  </a>
              </Tappable>
            </div>
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
            name:'',
            target:0
        }
    },
    //接收到新 props 时调用 , 可以设置状态
    componentWillReceiveProps:function(nextProps){
      if( this.props.target != nextProps.target){
        Util({that:this}).stateSave({
          target:this.state.target?0:1
        })
      }
    },
    componentDidMount:function(){
      this.productTotal();
      this.props.listContentDid && this.props.listContentDid();
    },
    //标签触发事件
    tagCallback:function(_target){

      Util({that:this}).stateSave({
        productData:this.state.productData == undefined ? this.props.data.product : this.state.productData,
        name:_target
      });

      if( _target !== undefined ){
        this.props.contentHandleFn && this.props.contentHandleFn(_target);
      }
      this.setCartProduct();
    },
    tabcompleteFn:function(){
      let _box = $('.tags .tabWrapper'),
          _list = $('.tags .tablist'),
          _l = _list.length
      ;

      if( _l ){
        _box.width( $(_list[0] ).outerWidth(true) * (_l+1) );
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
    cartProductFn:function(){
      this.setCartProduct();
    },
    // 缓存设置分类卡片的数据
    setCartProduct:function(callback){
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
        });

        //读取当前分类购物车数据
        this.productTotal(_targetData);
      }

      callback && callback.call(this);
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
                    return(
                      <li >
                          <Products
                              data={item}
                              key={i}
                              keys={item.skuId}
                              handleFn={this.productFn}
                              cartProductFn={this.cartProductFn}
                              cartProduct={this.state.cartProduct}
                              tipsFn={this.props.tipsFn}
                          />
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

      return(
        <div className={this.props.className}  ref={refs} >
          <Tabs
              tagCallback={this.tagCallback}
              data={this.props.data}
              target={this.state.target}
              tabcompleteFn={this.tabcompleteFn}
          />
          {this.props.data && this.contentFn(this.props.data)}
        </div>
      )
    }
});

module.exports = ListContent;
