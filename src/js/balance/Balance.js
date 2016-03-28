import React  from 'react'
import Util from '../common/Util'
import Tips  from '../addons/Tips'
import Base  from '../common/Base.js'
import Ajax  from '../common/Ajax.js'
import Constants  from '../constants/Constants'
import BalanceContent  from './BalanceContent'
import { Link }  from 'react-router' // 路由变量



const Balance = React.createClass({
    getInitialState:function(){
      return{
        data:'',
        tips:{
          name:"loadingShow"
        }
      }
    },
    componentDidMount:function(){
      //sku数据 来自路由
      let _skuData = this.props.location.state
      ;
      if( !_skuData || Base.isOwnEmpty( _skuData ) || _skuData.length < 1 ){
        Util({that:this}).stateSave({
          tips:{
            name:"text",
            content:'来源数据出错！'
          }
        });
        return;
      }


      //结算页初始化数据
      Ajax({
        url:Base.setUrlParam(Constants.SERVER_REQUEST.SETTLEMENT,{
          sku:_skuData,
          userId:'123'
        },true),
        load:function(e){
          if(e.code == '0000'){
            Util({that:this}).stateSave({
              data:e.data,
              tips:{
                name:"loadingHide"
              }
            });
          }else{
            Util({that:this}).stateSave({
              tips:{
                name:"text",
                content:e.msg
              }
            });
          }
        }.bind(this),
        error:function(e){
          Util({that:this}).stateSave({
            tips:{
              name:"text",
              content:e.msg
            }
          });
        }

      })
    },
    render: function() {
      return (
        <div>
          <BalanceContent data={this.state.data} />
          <Tips
              opt={this.state.tips}
              className="tipsComponent"
          />
        </div>
      )
    }
});

module.exports = Balance;
