import React  from 'react'
import Tappable  from 'react-tappable'
import { Link }  from 'react-router'

const OrderPaySuccess = React.createClass({
	render: function() {
		 $("body").removeClass().addClass('orderItem');
		return (
			<div className="OrderPaySuccess">
		        <section>
		            <div className="orderIdBox border-bottom-e1e1e1 addw addh">
		              <span>订单编号：</span>
		              <span className="orderIdNum">123213213</span>
		            </div>
		            <div className="orderIdBox addw addh">
		              <span>订单金额：</span>
		              <span className="orderIdNum">1000</span>
		            </div>
		        </section>
		        <div>
		        	<Tappable stopPropagation onTap={this.handleFn}   className="btn_commit" component='a'>
						绑定至本账号
					</Tappable>
					<p>
					 	您可以在订单详情页中
					 	<Link to='/order/OrderItem' className="checkCradPassword">
					 		查询卡密码
					 	</Link>
					</p>
		        </div>
		    </div>
		)
	}
})

module.exports = OrderPaySuccess;