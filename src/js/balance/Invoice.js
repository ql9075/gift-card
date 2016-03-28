import React from 'react'
import Tab  from '../addons/Tab'
import Tappable  from 'react-tappable'
import classNames   from 'classnames'
import Util from '../common/Util'
import Base  from '../common/Base.js'
import Ajax  from '../common/Ajax.js'
import Constants  from '../constants/Constants'
import { Link }  from 'react-router' // 路由变量

const Invoice = React.createClass({
	getInitialState:function(){
		var data = this.props.location.state || '';

		return {
			title : data && data.title,
			checked : data && data.checked,
			isReturn:false
		}
	},
	// 监听text内容并同步
	handleChange:function(e){
		let _target = e.target ,
			_key = _target.getAttribute('data-value'),
			_value =  _target.value ,
			obj = {} ,
			_Util = Util({that:this})
		;
		obj[_key] = _value;
		if( this.state.checked ){
			_Util.stateSave(obj);
		}
	},
	//模拟checkBox 开关切换
	checkBox:function(e){
		Util({that:this}).stateSave({
			checked:this.state.checked ? false : true
		})
	},
	handleFn:function(){
		// Ajax({
		// 	url:Base.setUrlParam(Constants.SERVER_REQUEST.ORDER_CREATE,{
		// 		sku:{},
		// 		serialNumber:'',
		// 		userId:'123'
		// 	},true),
		// 	load:function(e){
		// 		console.log(e);
		//
		// 		$('.btn_commit')[0].click[0];
		// 	},
		// 	error:function(e){
		//
		// 	}
		// });

		Util({that:this}).stateSave({isReturn:true});
	
		setTimeout(function(){
			$('.btn_return')[0].click();
		},200)
	},
	render:function(){
		let data = this.props.location.state ;
		$("body").addClass('BalanceContent');

		return (
			<div className="Invoice">
				<div className="invoiceHead" >
					<div className="left">
						<strong className="invoiceHeadTitle">开具发票</strong>
						仅支持纸质发票
					</div>
					<div className="right invoiceHeadBtn">
						<Tappable
							stopPropagation
							onTap={this.checkBox}
							className={classNames({
								switchBtn:true,
								checked:this.state.checked
							})}
							component='a'
						/>
					</div>
				</div>
				<div className="invoiceTitle">
					<strong>发票抬头</strong>
					<textarea value={this.state.title} data-value="title" onChange={this.handleChange}  ></textarea>
				</div>
				<div className="invoiceContent">
					<strong>发票内容</strong>
					<div className="invoiceContentTab">
						<Tab data={data.tabData} current="current"  disable={this.state.checked ? false : true} />
					</div>
				</div>

				{this.state.isReturn ? (
					<Link  to={'/balance'} className="btn_commit btn_return">
						确定
					</Link>
				):(
					<Tappable stopPropagation onTap={this.handleFn}  className="btn_commit " component='a'>
						确定
					</Tappable>
				)}
			</div>
		)
	}
});

module.exports = Invoice;
