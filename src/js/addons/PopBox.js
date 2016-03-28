import '../../css/popbox.css'
import React  from 'react'
// https://github.com/mroderick/PubSubJS
//事件传播组件
import PubSub  from 'pubsub-js'
//touch事件插件
import Tappable  from 'react-tappable'


// 弹层组件

var Popover = React.createClass({
  getInitialState:function(){
      return{
          isShow:true
      }
  },
  componentDidMount:function(){
    var random = parseInt(Math.random()*1000) ,
        _pubName = 'PopoverHandle'+random
    ;
    this._pubName = _pubName;
    this.pubsub_token = PubSub.subscribe(this._pubName,function(topic,target){
      var _status = target.getAttribute('data-index') ,
          _disable = target.getAttribute('disable') ,
          _isShow = true
      ;

      if( _status == 'close' ){
          _isShow = false ;
      }else if( _status == 'commit' ){
          _isShow = false ;
      }

			this.setState({
					isShow:_isShow
			});

      this.props.handleFn && this.props.handleFn(_isShow,_status);

		}.bind(this));
    this.loadFlag = true;
  },
  //组件卸载
	componentWillUnmount:function(){
		//移除订阅
		PubSub.unsubscribe(this.pubsub_token);
    this.loadFlag = null;
	},
  tapHandle:function(evt){
      var _target = evt.target ;
      PubSub.publish(this._pubName,_target);

  },
  btnFn:function(){
    var _opt = this.props.opt ,
        btnArray = _opt.btn || [
        {
          index:"close",
          name:"关闭",
          class:"close"
        },
        {
          index:"commit",
          name:"确定",
          class:"commit"
        }
      ];

    var _btn = btnArray.map(function(item,i){
                  var _class='pop_btn '+item.class ,
                      _index = item.index || item.class
                  ;

                  return(
                    <Tappable stopPropagation className={_class} data-index={_index} onTap={this.tapHandle} component='a' >
                          {item.name}
                    </Tappable>
                  )
              },this) ;

    return (
      <div className="BtnBox">
        {_btn}
      </div>
    )
  },
  render:function(){
    var _opt = this.props.opt ,
        _content = _opt.content
    ;

    var _btn = !_opt.isCustom ? this.btnFn() : '';

    return (
      <div className="popContentWrapper">
        <div className="contentBox">
          {_content}
        </div>
        {_btn}
      </div>
    )
  }
});



/*  opt
 * isShow:是否显示弹层
 * trigger:是否触发弹层组件
 */
var PopBox = React.createClass({
    getInitialState:function(){
        return{
            isShow:this.props.opt.isShow ,
            trigger:this.props.opt.trigger
        }
    },
    componentDidMount:function(){

      //组件挂载后 初始化pubsub_token,订阅
      var random = parseInt(Math.random()*1000) ,
          _pubName = 'popModal'+random
      ;
      this._pubName = _pubName;

  		this.pubsub_token = PubSub.subscribe(this._pubName,function(topic,data){
        var _trigger = data.trigger !== undefined ?  data.trigger : this.props.opt.trigger ;
        if( data.popCloseBefore && data.isShow == false ){
            var _result = data.popCloseBefore(data.status);
            if( data.status == 'commit' && _result !== undefined && !_result ){
                return;
            }
        }

        this.setState({
            isShow: data.isShow ,
            trigger:_trigger
        });

        if( data.popCloseAfter && data.isShow == false ){
            data.popCloseAfter();
        }

        this.props.handleFn && this.props.handleFn(this.state.isShow,false) ;
  		}.bind(this));

      if( this.state.isShow ){
        this.popOpenAfter()
      }

    },
    componentWillUnmount:function(){
      //移除订阅
  		PubSub.unsubscribe(this.pubsub_token);
    },
    //隐藏弹层
    onModalHide:function(_status){
      PubSub.publish(this._pubName,{
        isShow:false,
        trigger:false,
        popCloseBefore:this.popCloseBefore,
        popCloseAfter:this.popCloseAfter,
        status:_status
      });
    },
    //显示弹层
    onModalShow:function(_status){
      PubSub.publish(this._pubName,{
        isShow:true,
        trigger:false,
        popCloseBefore:this.popCloseBefore,
        popCloseAfter:this.popCloseAfter,
        status:_status
      });
    },
    toggle:function(){

      if( this.props.opt.trigger ){
        if( this.props.opt.isShow && !this.state.isShow ){
          console.log("A")
            this.onModalShow();
        }else if( !this.props.opt.isShow && this.state.isShow ){
          console.log("B")
            this.onModalHide();
        }
      }
    },
    //弹层打开之后
    popOpenAfter:function(){
      if( this.props.opt.popOpenAfter ){
        return this.props.opt.popOpenAfter()
      }
    },
    //弹层关闭之前
    popCloseBefore:function(){
      if( this.props.opt.popCloseBefore ){
        return this.props.opt.popCloseBefore()
      }
    },
    //弹层关闭之后
    popCloseAfter:function(){
      if( this.props.opt.popCloseAfter ){
          return this.props.opt.popCloseAfter()
      }
    },
    //子组件传回调 状态
    handleFn:function(_isShow,_status){
      if( _isShow ){
        this.onModalShow(_status);
      }else{
        this.onModalHide(_status);
      }
    },
    componentWillReceiveProps:function(){
      this.toggle();
    },
    render:function(){

      let _class = this.props.className ? this.props.className +' popUpWrapper' : 'popUpWrapper' ,
          _opt = this.props.opt,
          isShow = _opt.isShow
      ;

      return (
          <div className={_class} style={isShow ? {'display':'block'} : {'display':'none'}} >
            <div className="popUp popUp-layer">
              <div className="popUp-content">
                  <Popover opt={_opt} handleFn={this.handleFn} />
              </div>
            </div>
          </div>
      )
    }
});

module.exports = PopBox;
