//importation des routes
const users = require('./routes/api/users.routes');
const posts = require('./routes/api/posts.routes');
const conversationRoute = require("./routes/api/conversation.routes");
const messageRoute = require("./routes/api/message.routes");
//importation de body-parser
const bodyParser = require('body-parser');
//importation de cookieParser
const cookieParser = require('cookie-parser');
//middleware de l'authentification
const {checkUser,requireAuth} = require('./middleware/auth.middleware');
const express = require('express');

// init express
const app = express();
//Autorisation les requetes pour CLIENTS_URL
const cors = require('cors');
const corsOptions = {
    origin: process.env.CLIENT_URL,  //request source permited
    credentials: true,  //to allow exposing code to javascript
    'allowedHeaders': ['sessionId', 'Content-Type'], 
    'exposedHeaders': ['sessionId'],  //
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }
//autorisation des requetes
app.use(cors(corsOptions));
// bodyparser middleware
app.use(bodyParser.json());
app.use(cookieParser());
//jwt (chaque fois qu'il y a une requet * cad n'import quelle requête on doit vérifier si le user dispose d'un token)
app.get('/*', checkUser);
app.get('/jwtid',requireAuth,(req,res)=>{
    res.status(200).send(res.locals.user._id);
});
//routes
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use('/api/users',users);
app.use('/api/posts',posts);
//Access to folder image
app.use('/uploads/avatar', express.static(process.cwd() + '/uploads/avatar'));
app.use('/uploads/posts', express.static(process.cwd() + '/uploads/posts'));
app.use('/default', express.static(process.cwd() + '/default'));

module.exports=app;