import '../../css/detail.css'
import React  from 'react'
import Tab  from '../addons/Tab'
import Util from '../common/Util'
import Base from '../common/Base'
import BASE64 from '../lib/jbase64'
import BuyBtn  from '../addons/BuyBtn'
import PopBox  from '../addons/PopBox'
import Tappable  from 'react-tappable'
import Ajax  from '../common/Ajax.js'
import Constants  from '../constants/Constants'
import { Link }  from 'react-router'
//import productPic  from '../../img/products.jpg'




//页面主内容
var Content = React.createClass({
		getInitialState:function(){
				return{
						imgDetail:"",
						productDetail:""
				}
		},
		componentDidMount:function(){
			var _skuId = window.location.hash.split('?')[0].split('/')[2];
			console.log(_skuId);
			// 商品详情数据
			Ajax({
  		  url:Base.setUrlParam(Constants.SERVER_REQUEST.PRODUCT_DETAIL,{
						data:BASE64.encoder('{"skuId":'+_skuId+'}'),
						appKey:"duoBao",
						sign:1
						},true),
  		  load:function(e){
					if( e.code == '0000' ){
							var _data = e.skuInfo ;
							this.stateFn({
								productDetail:{
									name:_data.skuName,
									price:_data.price,
									imagePath:_data.imagePath
								}
							})

					}
				}.bind(this),
				error:function(e){

				}
			});

			// 图文详情
			Ajax({
  		  url:Base.setUrlParam(Constants.SERVER_REQUEST.PRODUCT_IMG_DETAIL,{skuId:_skuId},true),
  		  load:function(e){
					if( e.code == '0000' ){
							var _data = e.data ;
							this.stateFn({
								imgDetail:_data.details
							})

					}
				}.bind(this),
				error:function(e){

				}
			});


		},
		//设置状态
    stateFn:function(opt){
      Util({that:this}).stateSave(opt);
    },
		//去购买点击回调
		buyHandleFn:function(){
			Ajax({
				url:Base.setUrlParam(Constants.SERVER_REQUEST.PRODUCT_IMG_DETAIL,{skuId:_skuId},true),
				load:function(e){
					if( e.code == '0000' ){
							var _data = e.data ;
							this.stateFn({
								imgDetail:_data.details
							})

					}
				}.bind(this),
				error:function(e){

				}
			});
		},
		render:function(){
			return(
				<div>
					<div className="detailContent">
						<div className="productsPicBox">
							<img src={this.state.productDetail && this.state.productDetail.imagePath } />
						</div>
						<div className="productsDes">
							  <h1><span>{this.state.productDetail && this.state.productDetail.name }</span><em>自营</em></h1>
							  <strong className="pricebox">
									<span className="currency">￥</span>
									<span className="price">{this.state.productDetail && this.state.productDetail.price }</span>
								</strong>
							  <p>由京东发货并提供售后服务</p>
							  <div className="productsSalesDes">
									<span>支持七天退换货</span>
									<span>货到付款</span>
								</div>
						</div>

						{ this.state.imgDetail && (
							<div className="productsInfo">
									<h2>图文详情</h2>
									<div className="productsInfoTab">
										<div className="tabBox">
											<div dangerouslySetInnerHTML={{__html:this.state.imgDetail}} />
										</div>
									</div>
									<div className="productsInfoCont" ref="productsInfoCont" >{this.state.tabContent}</div>
							</div>
						)}
						<div className="BuyNowBox">

							{ this.state.return ? (
								<BuyBtn className="buybtn" handleFn={this.buyHandleFn}/>
							 ):(
								<Link className="buybtn BuyNow" to="list" >去购买</Link>
							 )}
						</div>
					</div>
				</div>
			);
		}
});
//<Tab data={_data.tabData} current="current" tabHandleFn={this.tabHandleFn}  />
//<BuyBtn className="buybtn" handleFn={this.buyHandleFn}/>

var Detail = React.createClass({
	render:function(){
		$("body").removeClass()
		return ( <Content  /> );
	}
});



module.exports = Detail;
