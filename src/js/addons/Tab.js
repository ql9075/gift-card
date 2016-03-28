import React  from 'react'
// https://github.com/mroderick/PubSubJS
//事件传播组件
import PubSub  from 'pubsub-js'
//touch事件插件
import Tappable  from 'react-tappable'
import Util from '../common/Util'
import Base  from '../common/Base.js'


//TAB
// var Tablist = React.createClass({
// 		render:function(){
// 			var _tapindex = "tapindex"+this.props.key,
// 			 		 _tapName = 'taplist '+_tapindex
// 			;
// 			return(
// 				<div className={this.props.classNames} >
// 					<Tappable stopPropagation onTap={this.props.Tap}  target={this.props.target}  ref={this.props.ref}>
// 							{this.props.name}
// 					</Tappable>
// 				</div>
// 			)
// 		}
// });


var Tab = React.createClass({
	getInitialState:function(){
		var _index = this.props.data.index || 0,
				_data = this.props.data.tabList[_index]
		;
		return {
				trigger:true,
				index:_data.target,
				content:_data.content
		}
	},

	//接收到新 props 时调用 , 可以设置状态
	componentWillReceiveProps:function(nextProps){
		// console.log("will")
		// console.log("props:",this.props);
		// console.log("nextProps:",nextProps);
		if( this.props.target != nextProps.target ){
			Util({that:this}).stateSave({
					trigger:true,
			});
		}

		if( nextProps.data.index &&  nextProps.data.index != this.state.index ){
			Util({that:this}).stateSave({
					index:nextProps.data.index,
			});
		}
	},
	//在接收到新的 props 或者 state，将要渲染之前调用。 返回布尔值 表示后续操作是否执行
	// shouldComponentUpdate:function(nextProps,nextState){
	// 	// console.log("props:",this.props);
	// 	// console.log("nextProps:",nextProps);
	// 	// console.log("state:",this.state);
	// 	// console.log("nextState",nextState);
	// 	return this.state.index == nextState.index ;
	// 	//return this.props.target !== nextProps.target ;
	// },
	componentDidUpdate:function(){
		//组件完成后执行
		this.props.completeFn && this.props.completeFn();
	},
	//挂载完成
	componentDidMount:function(){
		this.tabHandleFn();
		//组件完成后执行
		this.props.completeFn && this.props.completeFn();
	},
	//变动执行
	changeFn:function(data){

		Util({that:this}).stateSave({
				index:data.target,
				trigger:true
		});

		this.tabHandleFn(this.state);
	},
	//回调
	tabHandleFn:function(data){
		var _data = data || this.state;
		if( this.state.trigger ){
			this.props.tabHandleFn && this.props.tabHandleFn(_data);
			Util({that:this}).stateSave({data:{trigger:false}});
		}
	},
	//设置选中样式
	getTitleItemCssClasses: function(opt){
		var _disable = this.props.disable ? this.props.disable : false ;
		if( typeof this.state.index  == 'number' &&  typeof opt.index != 'number' ){
			if( opt.key === this.state.index &&  !_disable  ){
				return "tablist tab-title-item current";
			}else{
				return "tablist tab-title-item";
			}
		}else{
			if( opt.index === this.state.index &&  !_disable  ){
				return "tablist tab-title-item current";
			}else{
				return "tablist tab-title-item";
			}
		}

 	},
	//触摸事件
	handleTap:function(evt){
			var content = this.content ,
					target = evt.target ,
					_t = target.getAttribute('target')
			;

			//如果点击的是当前显示的 就返回
			if( _t == this.state.index ){
				 return;
			}
			this.changeFn({evt:evt,target:_t,index:_t});
	},
	//设置选择
	setSelected:function(){
		let _data = this.props.data.tabList ,
				_this = this ,
				_c = this.props.className ,
				_ref = this.props.refName || '' ,
				_disable = this.props.disable ? this.props.disable : false
			;


		return (
			<div className="tabWrapper" ref={_ref}>
				{_data.map(function(item,i){
					var _index = 'tabindex'+i,
							_current = this.props.current || 'current',
							_state = this.props.state || this.state ,
							_class = '',
							boundTap =  this.handleTap
					;

					var opt ={
						state:this.state,
						content:this.content,
						index:item.target,
						key:i,
						tabIndex:_index,
						trigger:true
					}

					return (
						<div className={this.getTitleItemCssClasses(opt)} key={i} >
							<Tappable stopPropagation onTap={boundTap}  target={item.target}  ref={_index}  >
									{item.name}
							</Tappable>
						</div>
					)
				},this)}
			</div>
		)
	},
	render:function(){

		return (
			<div className={this.props.className}>
				{this.setSelected()}
			</div>
		)
	}
});
module.exports = Tab;
