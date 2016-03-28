import React  from 'react'
import Tappable  from 'react-tappable'

//去购买浮层
var BuyBtn = React.createClass({
		handleTap:function(){
			//alert("go buy");
		},
		render:function(){
      var _handleFn = this.props.handleFn || this.handleTap,
          _class = this.props.className+' BuyNow' || 'BuyNow'
      ;

			return(
				<div className="BuyNowBox">
					<Tappable preventDefault onTap={_handleFn} className="Tappable-BuyNow">
						<a className={_class} >去购买</a>
					</Tappable>
				</div>
			)
		}
});

module.exports = BuyBtn;
