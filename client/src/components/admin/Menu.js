import React from 'react';
import {connect} from 'react-redux';
import * as cActions from '../../actions/categoriesActions';
import * as mActions from '../../actions/menuActions';
import {Link} from 'react-router-dom';
import Dropzone from 'react-dropzone'
import _ from 'lodash';

class Menu extends React.Component {

  state = {
    name: '',
    price: '',
    file: '',
    errors: {}
  };

  onDrop = (files) => {
    console.log(files);
    this.setState({
      file: files[0]
    });
  };

  createMenuItem = () => {
    // validate input data
    const errors = {};
    const {name, price, file} = this.state;
    if (!name) errors.name = 'name is required';
    if (!price) errors.price = 'price is required';
    if (!file) errors.file = 'price is required';
    // jei errors objektas yra ne tuscias setinam stato errors i errors
    if (!_.isEmpty(errors)) return this.setState({errors});
    this.setState({errors});

    const formData = new FormData();		//sukuriam formData objekta
    formData.append('name', this.state.name);	//jam pridedam form values
    formData.append('price', this.state.price);
    formData.append('category', this.props.match.params.category);
    formData.append('image', this.state.file);	//failo pridejimas
    this.props.addMenuItem(formData);
    this.setState({name: '', price: '', file: ''})
  };

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  };

  componentDidMount() {
    this.props.fetchCategories();
    this.props.fetchMenu();
  }

  render() {
    const {category} = this.props.match.params;
    const items = this.props.menu.filter(item => {
      if (!category) return item;
      return category === item.category
    }).map((item, i) => {
      return (
          <div className="item" key={i}>
            <img src={item.img} alt={item.name}/>
            <h3>{item.name}</h3>
            <strong>{item.price}</strong>
            <span onClick={() => this.props.removeItem(item._id)}>
              remove
            </span>
          </div>
      )
    });
    const categories = this.props.categories.map((cat, i) => {
      return (
          <li key={i}>
            <Link to={'/admin/menu/'+cat.name}>{cat.name}</Link>
          </li>
      )
    });
    const {errors} = this.state;
    return (
        <div className="Admin-Menu">
          <ul className="categories">
            {categories}
          </ul>
          <h1>{this.props.match.params.category}</h1>
          {this.props.match.params.category &&
          <div className="create">
            <Dropzone
                style={{
                  height: '100px',
                  border: '1px solid grey',
                  backgroundImage: `url(${this.state.file.preview})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
                onDrop={this.onDrop}>
            </Dropzone>
            {errors.file && <small>{errors.file}</small>}
            <input
                onChange={this.handleChange}
                value={this.state.name}
                name="name"
                type="text"
                placeholder="name"/>
            {errors.name && <small>{errors.name}</small>}
            <input
                onChange={this.handleChange}
                value={this.state.price}
                name="price"
                placeholder="price"
                step="0.1"
                type="number"/>
            {errors.price && <small>{errors.price}</small>}
            <div
                onClick={this.createMenuItem}
                className="btn">
              Add Product
            </div>
          </div>
          }
          <div className="menu-items">
            {items}
          </div>
        </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    categories: state.categories,
    menu: state.menu
  }
};
export default connect(
    mapStateToProps,
    {...cActions, ...mActions}
)(Menu)