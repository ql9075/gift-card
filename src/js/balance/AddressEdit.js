import React from 'react'
import Tappable  from 'react-tappable'
import Util from '../common/Util'
import Base  from '../common/Base.js'
import Ajax  from '../common/Ajax.js'
import Constants  from '../constants/Constants'
import { Link }  from 'react-router' // 路由变量


var AddressEdit = React.createClass({
	getInitialState:function(){
		var data = this.props.location.state || '';

		return {
			isReturn : false ,
			name : data && data.Name ,
			phone : data && data.Phone ,
			levelAddress : data && data.LevelAddress ,
			detailAddress : data && data.DetailAddress
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

		_Util.stateSave(obj);
	},
	handleFn:function(){
		Ajax({
			url:Base.setUrlParam(Constants.SERVER_REQUEST.ADDRESS_ID,{
				addressId:'',
				name:this.state.name,
				phone:this.state.phone,
				levelAddress:this.state.levelAddress,
				detailAddress:this.state.detailAddress
			},true),
			load:function(e){
				if(e.code == '0000'){
					if(e.data.isSuccess){
						// she zhi chenggong

						Util({that:this}).stateSave({isReturn:true});

						setTimeout(function(){
							$('.btn_return')[0].click();
						},200)
					}
				}
			}.bind(this),
			error:function(e){

			}
		});
	},
	render:function(){
		var data = this.props.location.state || '';
			$("body").addClass('BalanceAddress');
		return (
			<div className="addressEditBox">
				<ul>
					<li>
						<span className="text_head">
							收货人:
						</span>
						<input
							type="text"
							className="text_cont"
							data-value="name"
							ref="name"
							value={this.state.name}
							onChange={this.handleChange} />
					</li>
					<li>
						<span className="text_head">
							联系方式:
						</span>
						<input
							type="text"
							className="text_cont"
							data-value="phone"
							ref="phone"
							value={this.state.phone}
							onChange={this.handleChange} />
					</li>
					<li>
						<span className="text_head">
							所在地区:
						</span>
						<input
							type="text"
							className="text_cont"
							data-value="levelAddress"
							ref="levelAddress"
							value={this.state.levelAddress}
							onChange={this.handleChange} />
					</li>
					<li>
						<span className="text_head">
							详细地址:
						</span>
						<input
							type="text"
							className="text_cont"
							data-value="detailAddress"
							ref="detailAddress"
							value={this.state.detailAddress}
							onChange={this.handleChange} />
					</li>
				</ul>
				{this.state.isReturn ? (
					<Link  to={'/balance'} className="btn_commit btn_return">
						保存并使用
					</Link>
				):(
					<Tappable stopPropagation onTap={this.handleFn}   className="btn_commit" component='a'>
						保存并使用
					</Tappable>
				)}
			</div>
		)
	}
});

module.exports = AddressEdit;
