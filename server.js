const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const chalk = require('chalk');
const catRoutes = require('./routes/catRoutes');
const menuRoutes = require('./routes/menuRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const createAdmin = require('./auth/createAdmin');

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true});
mongoose.connection
    .once('open', () => console.log('connected to DB'))
    .on('error', (err) => console.log(err));
mongoose.Promise = global.Promise;

// create admin user
// argumentai pasiekiami process.argv
// create admin:   node server adminname adminpassword
console.log(process.argv);
if (process.argv[2] && process.argv[3]) {
  createAdmin(process.argv[2], process.argv[3]);
}

// config.
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/api/categories', catRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api', authRoutes);

app.get('/test', (req,res)=>{
    res.send('ok')
});

if(process.env.NODE_ENV==='production'){
  app.use(express.static(__dirname+'/client/build'));
  app.get('/*', (req,res)=>{
    res.sendFile(__dirname+'/client/build/index.html');
  })
}

const port = process.env.PORT;
const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/thecat.lt/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/thecat.lt/privkey.pem')
};


const server = app.listen(port, () => {
  console.log(chalk.bgGreen(`server is running on port ${port}`));
});

const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('new user has connected');
  socket.on('test', (data) => {
    console.log(data);
    if(data!=='socket'){
      socket.emit('badsocket', 'gg')
    }
  })
});
https.createServer(options, app).listen(9443);
app.set('socketio', io);
app.use(require('helmet')());