import React from 'react'
import Tab  from '../addons/Tab'
import Tappable  from 'react-tappable'
import { Link }  from 'react-router' // 路由变量

// 	<div className="deliveryTime">
//		<strong>小件商品送货时间：</strong>
//		<p>{data && data.payDeliveryTime}</p>
//		<input type="date" className="selecteDate" />
//	</div>


const PayDelivery = React.createClass({
	payWay:function(data){
		let _data = data.payData ;
		return (
			<div className="payWay">
				<h3>支付方式</h3>
				<Tab data={_data} current="current" className="payWayTab"    />
				<p>此订单不支持打白条</p>
			</div>
		)
	},
	deliveryWay:function(data){
		let _data = data.deliveryData ;
		return (
			<div className="deliveryWay">
				<h3>配送方式</h3>
				<div className="pic">
					<img src={_data.src} />
				</div>
				<Tab data={_data} current="current" className="deliveryWayTab"    />
			</div>
		)
	},
	render:function(){
		let data = this.props.location.state ||'';
		$("body").removeClass().addClass('BalanceContent');
		return (
			<div className="PayDelivery">
				{data && this.payWay(data)}
				{data && this.deliveryWay(data)}

				<Link to={'/balance'}   className="btn_commit PayDeliveryCommit" >
						确定
				</Link>
			</div>
		)
	}
});

module.exports = PayDelivery;
