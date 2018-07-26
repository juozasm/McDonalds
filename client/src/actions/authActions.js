import * as types from './types';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export function login(data, history) {
  return async function (dispatch) {
    try{

      // darom uzklausa i Backend /api/login
      const res = await axios.post('/api/login', data);
      // uzsaugom token i localstorage
      localStorage.setItem('jwt-token', 'Bearer '+res.data);
      console.log(res);
      // is token istraukiam user
      const user = jwt.decode(res.data);
      console.log(user);
      history.push('/admin');
      dispatch({
        type:types.LOG_IN,
        payload:user
      })

    }catch (err){
      console.log(err.response);
      // issiunciam errors
      dispatch({
        type:types.GET_ERRORS,
        payload:err.response.data
      })
    }
  }
}

export function setUser(user) {
  return {
    type:types.LOG_IN,
    payload:user
  }
}

export function logout() {
  // istrinam token is localstorage
  localStorage.removeItem('jwt-token');
  return {
    type:types.LOG_OUT
  }
}