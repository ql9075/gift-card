import '../../css/balance.css'
import React from 'react'
import Tappable  from 'react-tappable'
import Util from '../common/Util'
import Base  from '../common/Base.js'
import Ajax  from '../common/Ajax.js'
import Constants  from '../constants/Constants'
import classNames   from 'classnames'
import { Link }  from 'react-router' // 路由变量

var AddressItem = React.createClass({
  getInitialState:function(){
    var data = this.props.location.state ;
    return {
      current : null
    }
  },
  handleFn:function(e){
    let _target = e.currentTarget ,
      _key = "current",
      _value =  $(_target).attr('data-key') ,
      obj = {} ,
      _Util = Util({that:this})
    ;
     obj[_key] = _value;
    if( this.state.current !== _value){
         _Util.stateSave(obj);

         Ajax({
           url:Base.setUrlParam(Constants.SERVER_REQUEST.DEFAULT_ADDRESS,{
             addressId:''
           },true),
           load:function(e){
             if(e.code == '0000'){
               if(e.data.isSuccess){
                 // she zhi chenggong
               }
             }
           }.bind(this),
           error:function(e){

           }
         });
     }

     clearTimeout(this.timer);
     this.timer = setTimeout(function(){
       $('.toBlance')[0].click();
    },300)

  },
  //默认标记
  defaultFlag:function(){
    return (
       <div className="default_icon">
          默认
        </div>
    )
  },
  list:function(data){
    let _data = data ,
        _isCurrent = false
    ;

    return (
      <ul>
      {_data.map(function(item,i){
          let _isDefault = item.isDefault  ,
              _address = item.LevelAddress+' '+item.DetailAddress
          ;

          if( _isCurrent ){
              _isCurrent = false;
          }else{
            if( this.state.current == null){
              if( _isDefault ){
                _isCurrent = true;
              }
            }else{
              if(  this.state.current == i ){
                _isCurrent = true;
              }
            }
          }

          return (
              <li
                className={classNames({
                  default:_isDefault
                })}
                keys={i} >
                <div className="ad_wrapper">
                  <Tappable
                  stopPropagation
                  onTap={this.handleFn}
                  className={classNames({
                    AddressBox:true,
                    current:_isCurrent
                  })}
                  data-key={i}
                  component='section' >
                    <div className="AddressBox_content">
                      <div className="ad_Info">
                        <div className="ad_user">{item.Name}</div>
                        <div className="ad_phone">{item.phone}</div>
                      </div>
                      { _isDefault && this.defaultFlag() }
                      <p className="ad_location">{_address}</p>
                    </div>
                  </Tappable>
                  <Link to="balance" name="toBlance" className="toBlance"  />
                  <div className="addressEditBtn">
                    <Link to="balance/address/edit" name="addressEdit" className="addressEdit" state={item} />
                  </div>
                </div>
              </li>
          )
      }.bind(this))}
      </ul>
    )
  },
  render: function() {
    let _data = this.props.location.state  ,
        _address = _data.addressData,
        _leng = _address.length
    ;

    $("body").removeClass().addClass('BalanceAddress');
    return (
      <div className="AddressItem">
        { _address && this.list(_address) }
        <Link to="balance/address/edit" name="newAddress" className="btn_commit">
              新建地址
        </Link>
      </div>
    )
  }
});

module.exports = AddressItem;
