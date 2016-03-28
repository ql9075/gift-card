import '../../css/list.css'
import React  from 'react'
import Tappable  from 'react-tappable'
import Base  from '../common/Base.js'
import Util from '../common/Util'
import BASE64 from '../lib/jbase64'
import Constants  from '../constants/Constants'
import Ajax  from '../common/Ajax.js'
import Tab  from '../addons/Tab'
import Tips  from '../addons/Tips'
import PopBox  from '../addons/PopBox'
import MiniCart  from '../addons/MiniCart'
import ListContent  from './ListContent'
import { Link }  from 'react-router' // 路由变量
import {VelocityComponent}  from 'velocity-react'


//数据
const data = {
	tabData:{
		index:0,
		tabList:[
			{
				name:'实体e卡',
				target:'entityCard',
				content:""
			},
			{
				name:'电子e卡',
				target:'virtualCard',
				content:""
			}
		]
	}
};


const ListApp = React.createClass({
    getInitialState:function(){
        return{
            tabContent:"",
            productData:"",
						tabTarget:null,
            tips:{
              name:"loadingShow"
            },
            popbox:false,
            isShow:false,
            trigger:false,
            needRealName:false,
						isReturn:false,
						animation:{
							name:null,
							duration:400
						}
        }
    },
    componentDidMount:function(){
      //组件挂载后 初始化pubsub_token,订阅
      this.pubsub_token = PubSub.subscribe('list',function(topic,opt){
        this.stateFn(opt);
      }.bind(this));
      this.isPop = true;

      this.pubsub_token_scroll = PubSub.subscribe('onListScroll',function(topic,data){

          var data = data || {},
              _bh = document.body.clientHeight, //总高度
              _wh = document.documentElement.clientHeight, //窗口大小
              _top = document.body.scrollTop ,
              _topTab = this.refs.topTab.refs.topTab,
              _listContent = this.refs.listContent,
              _tagsTab = _listContent.refs.tagsTab ? _listContent.refs.tagsTab.refs.tagsTab : ''
          ;

          if( _tagsTab == '' || _topTab == undefined || _listContent == undefined ){
            return;
          }

          // if( _top > _topTab.clientHeight ){
          //   $(_listContent.refs.listContent).css({
          //     "padding-top":_tagsTab.clientHeight
          //   });
          //   $(_tagsTab).addClass('fixedTab');
          // }else{
          //   $(_listContent.refs.listContent).css({
          //     "padding-top":0
          //   });
          //   $(_tagsTab).removeClass('fixedTab');
          // }
					//
					//
          // if( (_top+_wh) >= _bh && !this.srcollDownLock ){
          //   console.log("到底了");
					// 	this.srcollDownLock = true;
					// 	//this.switchTags();
					//
          // }

					let _h = $('.list-header').outerHeight(true)+$('.tags').outerHeight(true)+$('.minCart').outerHeight(true);

					$('.productsCont').height( _wh-_h);

      }.bind(this));


      // window.onscroll = function(){
      //     PubSub.publish('onListScroll');
      // }
			setTimeout(function(){
					PubSub.publish('onListScroll');
			},800)

    },
    componentWillUnmount:function(){
      //移除订阅
      PubSub.unsubscribe(this.pubsub_token);

      PubSub.unsubscribe(this.pubsub_token_scroll);
    },
    //touch事件
    touchFn:function(name,e){
      var _this = this;
      Base.touchFunc(e,'start move end',function(e,data){

				//if( $(e.target).hasClass('productsCont') || $(e.target).parents().hasClass('productsCont')){
		        if( data.change.y > 5){
							Util({that:this}).stateSave({
								animation:{
									name:"slideUp",
									duration:400
								}
							});
							//let _h = $('.tags').outerHeight(true)+$('.minCart').outerHeight(true);
							let _h = document.querySelector('.tags').offsetHeight+document.querySelector('.tags').offsetHeight;
							document.querySelector('.productsCont').style.height =  document.documentElement.clientHeight-_h+'px';
							//$('.productsCont').height( document.documentElement.clientHeight-_h);
						}else if( data.change.y < -2){
							Util({that:this}).stateSave({
								animation:{
									name:"slideDown",
									duration:200
								}
							});
							let _h = document.querySelector('.list-header').offsetHeight+document.querySelector('.tags').offsetHeight+document.querySelector('.minCart').offsetHeight;
							document.querySelector('.productsCont').style.height = document.documentElement.clientHeight-_h+'px';
							//let _hs = $('.list-header').outerHeight(true)+$('.tags').outerHeight(true)+$('.minCart').outerHeight(true);
							//$('.productsCont').height( document.documentElement.clientHeight-_h);
						}
				//}
      }.bind(this));
    },
		//设置状态
    stateFn:function(opt){
      Util({that:this}).stateSave(opt);
    },
		//loading or tip 方法
		tipsFn:function(opt){
			if(opt.content){
				this.stateFn({
						tips:{
							name:"text",
							content:opt.content
						}
				});
			}else{
				if(opt.name == 'loadingShow'){

					this.stateFn({
							tips:{
								name:"loadingShow"
							}
					});

				}else if(opt.name == 'loadingHide'){

					this.stateFn({
							tips:{
								name:"loadingHide"
							}
					});
				}
			}
		},
    //实体卡 e卡 tab
    tabHandleFn:function(opt){
			var opt = opt || {},
					content = opt.content,
          _name = opt.index,
          _type = '',
          _list = this.listContentData
			;

			this.stateFn({
					tabTarget:_name,
					tips:{
						name:"loadingShow"
					}
			});


      //实体卡
      if( _name == 'entityCard'){
        _type = 1;
      //虚拟卡
      }else if( _name == 'virtualCard' ){
        _type = 2;
      }

      Ajax({
  		  url:Base.setUrlParam(Constants.SERVER_REQUEST.PRODUCT_LIST,{
					type:_type,
					data:BASE64.encoder('{"type":'+_type+',"source":1,"tradeType":1}'),
					appKey:'duoBao',
					sign:'1'
				},true),
  		  load:function(e){
  				var _data = e.data ;
          if( _data == undefined || _data == null ){
              console.log("数据格式出错")

							this.stateFn({
									tips:{
										name:"text",
										content:"数据格式出错"
									}
							});

              console.log(e,_data)
             return;
          }

          if( e.code !== '0000' ){
            console.log("没有返回成功");
            return;
          }
  		    content = _data;
					content.target = this.state.tabTarget;
					content.trigger = true;

          this.tabIndex = this.state.tabTarget;

          if( _list && _list[this.tabIndex] && _list[this.tabIndex]["name"] == this.tabIndex ){
              content.index = this.listContentData[this.tabIndex]["index"];
          }else{
              content.index = 0;
          }

          this.stateFn({
              tabContent:content,
              tips:{
                name:"loadingHide"
              }
          });

  		  }.bind(this),
  		  error:function(){
  		    console.log("error");
          this.stateFn({
              tips:{
                name:"loadingHide"
              }
    			});
  		  }.bind(this)
  		})
			this.tapFlag = true;
		},
    //
    totalFn:function(data){
      this.stateFn({
          productData:data
			});
    },
		//自动切换下一个分类标签
		switchTags:function(){
			var _tabContent = this.state.tabContent,
					_data = _tabContent.tabList ,
					_index = 0
			;
				_data.map(function(item,i){
					if( this.tagsTarget == item.target ){
							if( i >= _data.length-1 ){
								_index = 0 ;
							}else{
								_index = i+1;
							}
					}
				}.bind(this));
				_tabContent.index = _data[_index]["target"];

				this.stateFn({
						tabContent:_tabContent
				});

				clearTimeout(this.timer);
				this.timer = setTimeout(function(){
					this.srcollDownLock = false;
				}.bind(this),900);
		},
    //分类标签回调
    listContentFn:function(target){
      var content = this.state.tabContent ;
      if( !this.listContentData ){
        this.listContentData = {};
      }

			this.tagsTarget = target;
			this.tabIndex = this.state.tabTarget;

      this.listContentData[this.tabIndex] = {};
      this.listContentData[this.tabIndex]["index"] = target;
      this.listContentData[this.tabIndex]["name"] = this.tabIndex;

      content.index = target;
      this.stateFn({
          tabContent:content,
					tips:{
            name:"loadingHide"
          }
      });


    },
    //去结算 回调
    balanceFn:function(){

			if( this.state.needRealName ){
				PubSub.publish('list',{
            popbox:true,
            trigger:true,
            isShow:true,
						isReturn:false
        });
        this.isPop = false;

			}else{

				PubSub.publish('list',{
						isReturn:true
				});

				//结算
				this.settlement();
			}
    },
    //关闭pop
    popClose:function(e){

      if( $( e.target ).hasClass('commit') ){

        if( !this.popContentFn().isError() ){
            return ;
        }

      if( this.popContentFn().checkInput() ){
					//实名认证请求
					Ajax({
						url:Base.setUrlParam(Constants.SERVER_REQUEST.REALNAME,{
							cardName:this.refs.realName_name.value, //身份证姓名
							cardNum:this.refs.realName_id.value, // 身份证编号
							jdpin:'123'
						},true),
						load:function(e){
							var _code = e.code;

							if( _code == '0000' && e.data.isSuccess  ){
									 console.log('成功！')
									 //剩余验证次数
									 console.log(e.data.remainTimes)


									 PubSub.publish('list',{
											trigger:true,
											isShow:false,
											isReturn:true
										});

									 //创建数据  进入结算页
									 this.settlement();

							}else{
								switch(_code){
									case 'S004-0221':
											 console.log('jdpin为空')
										break
									case 'S004-0222':
											console.log('cardNum为空')
										break
									case 'S004-0223':
											console.log('cardName为空')
										break
									case 'S004-0421':
											console.log('服务器错误')
										break
								}
								PubSub.publish('list',{
									trigger:true,
									isShow:false,
									isReturn:false
								});
							}
						}.bind(this),
						error:function(e){

							PubSub.publish('list',{
								trigger:true,
								isShow:false,
								isReturn:false
							});
						}
					});
       }

			}else{
        PubSub.publish('list',{
          trigger:true,
          isShow:false,
          isReturn:false
        });
      }

    },
     //弹层关闭回调
    popHandleFn:function(isShow,trigger){
      PubSub.publish('list',{
          trigger:trigger,
          isShow:isShow
      });
    },
    //弹窗内容
    popContentFn:function(){
      var _this = this ,
          o = {}
      ;

      o = {
         //实名验证内容
          realNameFn:function(){
            return (
              <div className="realNameBox">
                <h3>实名制验证</h3>
                <div className="realNameBox_cont" >
                  <ol>
                    <li>
                      <div className="title">姓名</div>
                      <div className="wrapperBox" >
                        <input type="text" className="realName_name inline-block-middle" ref="realName_name" />
                      </div>
                    </li>
                    <li>
                      <div className="title">身份证</div>
                      <div className="wrapperBox" >
                        <input type="text" className="realName_id inline-block-middle" ref="realName_id" />
                      </div>
                    </li>
                  </ol>
                  <div className="tips" >
                    今日可验证3次
                  </div>
                </div>
                <div className="btnBox">
                  <Tappable stopPropagation data-index="close" onTap={_this.popClose} >
                      <a className="pop_btn close" ref="popBtnClose">取消</a>
                  </Tappable>
                  <Tappable stopPropagation data-index="commit" onTap={_this.popClose} >
                     <a className="pop_btn commit" ref="popBtnCommit"> 确定</a>
                  </Tappable>
                </div>
              </div>
            )
          },
          //检查input输入框
          checkInput:function(){
              let realName_name = _this.refs.realName_name ,
                  realName_id = _this.refs.realName_id ,
                  _targets = [realName_name,realName_id]
              ;

              $(realName_name).on('input',function(e){
                 if( changeContent(_targets) ){
                    $(_this.refs.popBtnCommit).removeClass('disable');
                 }else{
                    $(_this.refs.popBtnCommit).addClass('disable');
                 }
              });

              $(realName_id).on('input',function(e){
                if( changeContent(_targets) ){
                    $(_this.refs.popBtnCommit).removeClass('disable');
                 }else{
                    $(_this.refs.popBtnCommit).addClass('disable');
                 }
              });


              var changeContent = function(arr){
                var _flag = true;
                arr.map(function(item,i){
                  let v = item.value
                  if( v == ''){
                    _flag = false ;
                  }
                });

                return _flag;
              }

              if( !changeContent(_targets) ){
                $(_this.refs.popBtnCommit).addClass('disable');
                return false;
              }else{
                $(_this.refs.popBtnCommit).removeClass('disable');
                return true;
              }
          },
          isError:function(){
            let realName_name = _this.refs.realName_name ,
                  realName_id = _this.refs.realName_id ,
                  _nameTips = '姓名不能为空',
                  _idTips = '身份证号输入有误，请重新输入' ,
                  _flag = true
              ;
            var tips = function(o){
              var _o = o || {},
                  _error_tips = o.error_tips || '.error_tips' ,
                  _tips = o.target.parent().find( _error_tips )
              ;

              if( _tips[0] ){
                _tips.show();
              }else{
                var _div = $('<div class="error_tips">'+o.content+'</div>');
                o.target.parent().append(_div);
                _tips = _div;

              }
              //clearTimeout(this.t);
              this.t = setTimeout(function(){
                _tips.hide();
              },o.time||2500);

            }.bind(this);

            if( !this.checkInput() ){
                if( realName_name.value == ''  ){
                var _name = $(realName_name);
                tips({
                  target:_name,
                  content:_nameTips
                });
              }

              if( realName_id.value == '' ||  /^[a-zA-Z0-9]+$/.test(realName_id.value) ){
                var _id = $(realName_id);
                tips({
                  target:_id,
                  content:_idTips
                });
              }

              return false;
            }

            return true;
          }

      }

      return o;
    },
		//结算
		settlement:function(successFn){
			successFn && successFn();
			 setTimeout(function(){
				 $('.goToBalance')[0].click();
			 },200)
		},
    render:function(){
      var _data = this.props.data ,
          _this = this,
          pop = ''
      ;
      if( this.state.popbox ){
       var _opt = {
            content:this.popContentFn().realNameFn(),
            trigger:this.state.trigger,
            isShow:this.state.isShow,
            btn:[],
            popOpenAfter:function(){

              _this.popContentFn().checkInput();

            }
          };
        pop = <PopBox opt={_opt} handleFn={this.popHandleFn}  className="realNamePop" ref="popbox" /> ;
      }

      let MiniCartData = {
        current:"list",
        isReturn:this.state.isReturn,
        productData:this.state.productData
      };

      let touchEvents = {
          onTouchStart:this.touchFn.bind(this,'start'),
          onTouchMove:this.touchFn.bind(this,'move'),
          onTouchCancel:this.touchFn.bind(this,'cancel'),
          onTouchEnd:this.touchFn.bind(this,'end')
      }

      return (
        <div {...touchEvents}>
          <div className="list-wrapper" ref="listW" >
						<VelocityComponent
							duration={this.state.animation.duration}
							animation={this.state.animation.name}

							>
							<Tab
									data={_data.tabData}
									target={this.state.tabTarget}
									index={this.state.tabTarget}
									current="current"
									className="list-header"
									ref="topTab"
									refName="topTab"
									tabHandleFn={this.tabHandleFn}
							/>
						</VelocityComponent>
						<ListContent
								className="list-content"
								data={this.state.tabContent}
								target={this.state.tabTarget}
								ref="listContent"
								refName="listContent"
								contentHandleFn={this.listContentFn}
								totalFn={this.totalFn}
								tipsFn={this.tipsFn}
						/>
          </div>
          <MiniCart
							handleFn={this.balanceFn}
							data={MiniCartData}
							className="goToBalance"
					/>
          <Tips
							opt={this.state.tips}
							className="tipsComponent"
					/>
          {
            this.state.isShow && pop
          }
        </div>
      )
    }
});

const List = React.createClass({
    render: function() {
      $("body").removeClass();
      return (
        <ListApp data={data} />
      )
    }
})


module.exports = List;
