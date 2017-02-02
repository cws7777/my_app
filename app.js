var express  = require('express');
var app      = express();                 //Calling express.js package into app variable.
var path     = require('path');           //package for directory path.
var mongoose = require('mongoose');       //the most common package for controlling MONGO_DB in express.js
var session  = require('express-session');//package that is like a flag which can control user is logged in or out.
var flash    = require('connect-flash');  //package that can save session data as flash.
var bodyParser     = require('body-parser');    //package that can read and analyze json file.
var methodOverride = require('method-override');

// database
mongoose.connect(process.env.MONGO_DB);   //Connecting to mongoDB that I've already built in MongoDB.
var db = mongoose.connection;
db.once("open",function () {              //Status of Database from mongoDB is connected or not.
  console.log("DB connected!");
});
db.on("error",function (err) {
  console.log("DB ERROR :", err);
});

// view engine
app.set("view engine", 'ejs');          //Noticing to express that ejs will be used as view engine.

// middlewares which are commands that implements in all signals between router and arriving server.
app.use(express.static(path.join(__dirname, 'public')));      //Setting static folder directory. path.join makes automatic '/' even developers don't put '/'.
app.use(bodyParser.json());                                   //Read and analyzing json file.
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:'MySecret'}));                      //To keep logging in the user. Secret which is secret hash key encrypts session

// passport
var passport = require('./config/passport');
app.use(passport.initialize());       //Initializing and utilizing log in process.
app.use(passport.session());

// routes
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));

// start server
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server On!');
});
