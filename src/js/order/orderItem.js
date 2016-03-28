import React  from 'react'
import ReactDom  from 'react-dom'
import OrderItemContent  from './OrderItemContent'

var data = {
  product:[
    {
      src:"../img/products.jpg",
      title:'京东E卡经典卡1000面值(实 体卡1）',
      price:'1000',
      sort:['hot','classic'],//分类
      link:'', //链接
      number:'',//当前选中数量
      sku:'' //库存量
    },
    {
      src:"../img/products.jpg",
      title:'京东E卡经典卡1000面值(实 体卡2）',
      price:'1000',
      sort:['hot','classic'],//分类
      link:'', //链接
      number:'',//当前选中数量
      sku:'' //库存量
    }
  ]
}


var OrderItem = React.createClass({
    render: function() {
       $("body").removeClass().addClass('orderItem');
      return (
        <OrderItemContent data={data} />
      )
    }
});


module.exports = OrderItem;
