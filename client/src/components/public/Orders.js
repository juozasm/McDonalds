import React from 'react';
import img from '../../assets/img/water.png';
import {connect} from 'react-redux';
import * as actions from '../../actions/ordersActions';

const Orders = (props) => {
  const orders = props.orders.map((order,i)=>{
     return (
         <div className="order" key={i}>
           <img src={order.img} alt=""/>
           <nav>
             <span onClick={()=>props.removeOrder(order._id)}>-</span>
             <strong>{order.count}</strong>
             <span onClick={()=>props.addOrder(order)}>+</span>
           </nav>
         </div>
     )
  });
  return (
      <div className="Orders">
        {orders}
      </div>
  );
};
const mapStateToProps = (state) =>{
    return {
        orders:state.orders
    }
};
export default connect(mapStateToProps, actions)(Orders)