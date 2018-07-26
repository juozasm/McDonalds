const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../auth/auth');

router.post('/login',async (req,res)=>{
   // surandam admin
  console.log(req.body);
  const admin = await Admin.findOne({name:req.body.name});
  if(!admin) return res.status(400).json({message:'bad login credentials'});
  // kai surandam admin tikrinam ivesta password
  const match = await bcrypt.compare(req.body.password, admin.password);
  if(!match) return res.status(400).json({message:'bad login credentials'});

  // jei viskas ok grazinam JWT token
  // sugeneruojam JWT
  const token = jwt.sign(
      {name:admin.name, _id:admin._id},
      process.env.JWT_KEY);
  res.send(token)
});


router.post('/test', auth, (req,res)=>{
  console.log(req.user);
  console.log(req.kazkas);
    res.send('authorized')
});




module.exports = router;