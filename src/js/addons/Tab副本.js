import React  from 'react'
// https://github.com/mroderick/PubSubJS
//事件传播组件
import PubSub  from 'pubsub-js'
//touch事件插件
import Tappable  from 'react-tappable'
import Util from '../common/Util'
import Base  from '../common/Base.js'


//TAB
var Tablist = React.createClass({
		render:function(){
			var _tapindex = "tapindex"+this.props.key,
			 		 _tapName = 'taplist '+_tapindex
			;

			return(
				<div className={this.props.classNames} >
					<Tappable stopPropagation onTap={this.props.Tap}  target={this.props.target}  ref={this.props.ref}>
							{this.props.name}
					</Tappable>
				</div>
			)
		}
});


var Tab = React.createClass({
	getInitialState:function(){
		var _index = this.props.data.index || 0,
				_data = this.props.data.tabList[_index]
		;
		return {
				selected:_data.target,
				content:_data.content
		}
	},
	//组件挂载
	componentDidMount:function(){
		//组件挂载后 初始化pubsub_token,订阅
		var random = parseInt(Math.random()*1000) ,
				_pubName = 'tabhandle'+random
		;
		this._pubName = _pubName;

		this.pubsub_token = PubSub.subscribe(this._pubName,function(topic,target){

			Util({that:this}).stateSave({
					selected:target.getAttribute('target'),
					content:this.content
			});
		}.bind(this))

		//组件完成后执行
		this.props.completeFn && this.props.completeFn();
	},
	//组件变动
	componentWillReceiveProps:function(){
		//组件完成后执行
		this.props.completeFn && this.props.completeFn();
	},
	//组件卸载
	componentWillUnmount:function(){
		//移除订阅
		PubSub.unsubscribe(this.pubsub_token);
	},
	handleTap:function(evt){
			var content = this.content ,
					target = evt.target
			;

			//如果点击的是当前正显示的 就返回
			if( target.getAttribute('target') == this.state.selected ){
				 return;
			}
			this.tapFlag = true;

		  PubSub.publish(this._pubName,target);
			this.evt = evt;
			this._tabHandleFn({
				evt:evt,
				state:this.state,
				content:this.state.content
			})

			this.hadleflag = false;

	},
	_tabHandleFn:function(opt){
		var opt = opt || {};
		if( opt.trigger ){
				this.props.tabHandleFn && this.props.tabHandleFn(opt);
				console.log("_tabHandleFn")
		}
	},
	//设置选择
	setSelected:function(){
		let _data = this.props.data.tabList ,
				_this = this ,
				_c = this.props.className ,
				_ref = this.props.refName || '' ,
				_disable = this.props.disable ? this.props.disable : false
			;

		if( this.props.trigger ){
			this.hadleflag = false;
		}
		console.log("selected:",this.state.selected);

		return (
			<div className="tabWrapper" ref={_ref}>
				{_data.map(function(item,i){
					var _index = 'tabindex'+i,
							_current = this.props.current || 'current',
							_state = this.props.state || this.state ,
							_class = '',
							boundTap =  this.handleTap
					;

					if( this.tapFlag ){
						this._selected = _state.selected;
					}else{
						this._selected  = (this.props.selected !== undefined && this.props.selected!== null) ?  this.props.selected : _state.selected;
					}

					console.log("this.selected:",this._selected);

					if( item.target == this._selected && !_disable ){
						_class += _index+' tablist '+_current;
						this.content = item.content;

						var _opt ={
							evt:this.evt,
							state:this.state,
							content:this.content,
							tabIndex:_index,
							name:item.target,
							trigger:true
						}

						if( !this.hadleflag &&  this.props.tabHandleFn ){
							clearTimeout(this.timer)
							this.timer = setTimeout(function(){
								this._tabHandleFn(_opt);
								this.hadleflag = true;
							}.bind(this),5)
						}

					}else{
						_class += 'tabindex'+i+' tablist';
					}

					if( i >= _data.length-1 ){
						this.tapFlag = false;
					}

					return (
						<Tablist
							Tap={boundTap}
							key={i}
							name={item.name}
							classNames={_class}
							ref={_index}
							target={item.target}
						/>
					)
				},this)}
			</div>
		)
	},
	render:function(){
		// var _data = this.props.data.tabList ,
		// 	_this = this ,
		// 	_c = this.props.className ? this.props.className+' tabWrapper' : 'tabWrapper',
		// 	_ref = this.props.refName || '' ,
		// 	_disable = this.props.disable ? this.props.disable : false
		// ;
		return (
			<div className={this.props.className}>
				{this.setSelected()}
			</div>
		)
	}
});

module.exports = Tab;
