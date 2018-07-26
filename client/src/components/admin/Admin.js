import React from 'react';
import Home from './Home';
import Menu from './Menu';
import ActiveOrders from './ActiveOrders';
import Nav from './Nav';
import {Route} from 'react-router-dom';
import jwt from 'jsonwebtoken';
import {connect} from 'react-redux';
import * as authActions from '../../actions/authActions';
import * as ordersActions from '../../actions/ordersActions';
import axios from 'axios';
import socket from '../../utils/socket';

class Admin extends React.Component {


  componentDidMount(){
    socket.on('neworder',(order)=>{
        console.log(order);
        this.props.newOrder(order)
    } );
    socket.on('badsocket', (data)=>{
        this.setState({message:[...this.state.message, data]})
    })
  }
  componentWillMount() {
    // darom uzklausa i localstorage
    let token = localStorage.getItem('jwt-token')
    if (!token) return this.props.history.push('/login');

    // irasom token i axios headers
    axios.defaults.headers.common['Authorization']= token;

    token = token.split(' ')[1];
    console.log(token);

    // is tokeno istraukiam user info
    const user = jwt.decode(token);
    if(!user ) return this.props.history.push('/login');

    // iskvieciam action (set user) kuris uzpildo state.auth
    this.props.setUser(user)
  }

  render() {
    return (
        <div className="Admin">

          <Nav/>
          <Route exact path="/admin" component={Home}/>
          <Route exact path="/admin/orders" component={ActiveOrders}/>
          <Route exact path="/admin/menu/" component={Menu}/>
          <Route path="/admin/menu/:category" component={Menu}/>
        </div>
    );
  }
}
export default connect(null, {...authActions, ...ordersActions})(Admin)