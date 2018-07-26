import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';

class Checkout extends React.Component{
  state={
    firstname:'',
    lastname:'',
    phone:'',
    address:'',
    errors:{},
    complete:false
  };

  handleInput = e=>
      this.setState({[e.target.name]:e.target.value});

  completeOrder =async (e)=>{
      e.preventDefault();
      // i konsole isvesti user info ir visa uzsakyma
      try{
        const res = await axios.post('/api/orders',
            {...this.state, orders:this.props.orders});
        console.log(res.data);
        this.setState({complete:res.data.message});
        setTimeout(()=>{
            this.props.history.push('/')
        },2000)
      }catch (err){
        console.log(err.response.data);
        this.setState({errors:err.response.data})
      }
  };

  render(){

    if(this.state.complete){
      return (
          <div className="Checkout">
            <h1>{this.state.complete}</h1>
          </div>
      )
    }

    return (
        <div className="Checkout">
          <h1>Checkout</h1>
          <Link to='/shop'>&#60; &#60; back</Link>
          <form onSubmit={this.completeOrder}>
            <input
                onChange={this.handleInput}
                value={this.state.firstname}
                placeholder="First Name"
                name="firstname"
                type="text"/>
            <input
                onChange={this.handleInput}
                value={this.state.lastname}
                placeholder="Last Name"
                name="lastname"
                type="text"/>
            <input
                onChange={this.handleInput}
                value={this.state.phone}
                placeholder="Phone nr."
                name="phone"
                type="text"/>
            {this.state.errors.phone
            && <span>{this.state.errors.phone}</span>}
            <input
                onChange={this.handleInput}
                value={this.state.address}
                placeholder="Address"
                name="address"
                type="text"/>
            <button>Complete order</button>
          </form>
        </div>
    );
  }
}
const mapStateToProps = (state) =>{
    return {
        orders:state.orders
    }
};
export default connect(mapStateToProps)(Checkout)