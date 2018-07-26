const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  name:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    required:true,
    type:String
  }
});

module.exports = mongoose.model('admins', AdminSchema);