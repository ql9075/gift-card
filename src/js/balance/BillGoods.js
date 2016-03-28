import React from 'react'
import { Link }  from 'react-router' // 路由变量

const BillGoods = React.createClass({

	list:function(data){
		let _data = data;
		console.log(_data);
		return (
			<ul>
				{_data.map(function(item,i){
					return (
						<li>
							<div className="productWrapper">
					          <div className="ProductsPic">
												<img src={item.imagePath} />
					          </div>
					          <div className="ProductsInfo">
					            <h2>
													{item.skuName}
											</h2>
					            <div className="product_other">
					             	支持7天无理由退款
					            </div>
					            <div className="product_number">
					            	x{item.num}
					            </div>
					          </div>
					     	</div>
					    </li>
					)

				})}
			</ul>
		)
	},
	render:function(){
		let data = this.props.location.state || '';

		$("body").removeClass();
		return (
			<div className="BillGoods" >
				{data && this.list(data) }
			</div>
		)
	}
});

module.exports = BillGoods;
