import axios from 'axios'

export function fetchCategories() {

  return async function (dispatch) {
    // uzklausa i db
    const res = await axios.get('/api/categories');
    console.log(res);
    // res.data bus is serverio gaunama info
    dispatch({
      type:'FETCH_CATEGORIES',
      payload:res.data
    })
  }
}