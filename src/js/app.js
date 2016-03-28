import '../css/base.css'
import React  from 'react'
import ReactDom  from 'react-dom'
import config  from 'config/config'
import { browserHistory, Router, Route, Link , IndexRoute }  from 'react-router' // 路由变量

//详情页模块
import Detail  from 'detail/Detail'
//列表页模块
import List  from 'list/List'
//订单结算页模块
import Balance  from 'balance/Balance'
//订单结算页　地址模块
import AddressItem  from 'balance/AddressItem'
//订单结算页　地址编辑模块
import AddressEdit from 'balance/AddressEdit'
//订单结算页　商品清单模块
import BillGoods from 'balance/BillGoods'
//订单结算页　支付配送模块
import PayDelivery from 'balance/PayDelivery'
//订单结算页　开具发票模块
import Invoice from 'balance/Invoice'
//订单详情页
import OrderItem from 'order/OrderItem'
//订单支付成功页
import OrderPaySuccess from 'order/OrderPaySuccess'


//定义页面上的路由
// var routes = (
//   <Route handler={App}>
//     <Route name="list" path='list' handler={List} >
//       <Route name="balance" path='balance' handler={Balance} />
//     </Route>
//   </Route>
// );
// var routes = (
//     <Route handler={App}>
//     </Route>
// );

//将匹配的路由渲染到dom中
ReactDom.render((
  <Router history={browserHistory}>
    <Route path="/"  component={List} >
      <IndexRoute  component={List} />
    </Route>
    <Route path="/detail" name="detail" component={Detail} >
      <Route path=":skuId" component={Detail} />
    </Route>
    <Route path="/list" name="list"  component={List} />
    <Route path="/balance" name="balance"  component={Balance} />
    <Route path="/balance/address" name="address"  component={AddressItem} />
    <Route path="/balance/address/edit" name="edit"  component={AddressEdit} />
    <Route path="/balance/billGoods" name="billGoods"  component={BillGoods} />
    <Route path="/balance/PayDelivery" name="PayDelivery"  component={PayDelivery} />
    <Route path="/balance/Invoice" name="Invoice"  component={Invoice} />
    <Route path="/order/OrderItem" name="OrderItem"  component={OrderItem} />
    <Route path="/order/OrderPaySuccess" name="OrderPaySuccess"  component={OrderPaySuccess} />
  </Router>
),document.getElementById('app-page'));
