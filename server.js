//importation de mongoose
const mongoose = require('mongoose');

//importation de socketio
const socketio = require("socket.io");
//importation et utilisation de dotenv
require('dotenv').config({path:'./config/.env'});

//middleware de socket
const {connection} = require('./middleware/socket.middleware');
//import app.js
const app =require("./app");

// init our socket 
const httpServer = require("http").createServer(app);
const io = socketio(httpServer).sockets;

//db config
const db = require('./config/keys').mongoURI;
//connect to DB
mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})
.then(()=>console.log("Connected ..."))
.catch(err => console.log(err));

//listen to port
const port = process.env.PORT
httpServer.listen(port , ()=>console.log(`server listening on ${port}`));