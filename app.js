// const express = require('express');
import express from 'express'
const app = express();
const db = require("./db/knex");
const helpers = require("./helpers");
const session = require('express-session');
var bodyParser = require('body-parser');
import authStrategy from "./helpers/authStrategy"
import post_login from './helpers/post_login';

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
  // cookie: { secure: true }
}))

//BEGIN passport config
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(authStrategy));

passport.serializeUser( (user_id, done) => {
  if (user_id) {
    done(null, user_id);
  }
});

passport.deserializeUser( (user_id, done) => {
  const err = null;
  done(err, user_id);
});
//END passport config

//morgan is a logger for development
var morgan = require('morgan');
// const myMorgan = morgan("dev");
// const myMorgan =morgan('combined', {
//   skip: function (req, res) { return res.statusCode < 400 }
// })
const myMorgan = morgan(":method :url :status :response-time ms - :res[content-length]");
app.use(myMorgan);

var home = require('./controllers/home');
app.use('/', home);

var users = require('./controllers/users');
app.use('/users', users);

var doctors = require('./controllers/doctors');
app.use('/doctors', doctors);

var appointments = require('./controllers/appointments');
app.use('/appointments', appointments);

var availabilities = require('./controllers/availabilities');
app.use('/availabilities', availabilities);

app.use("/admin", require("./controllers/admin/index"))

//begin DEV mess

//====================================================================================

//simply a copy of .post devlogin - for browser direct dev requests
app.get('/devlogin', function (req, res, next) {

  let loginResult = {
      success: false,
      msg: "System Error Occured.",
      other: null
    }

    //338 is test@test.com
    req.logIn(338, function (err) {
      if (err) {
        return next(err);
      }

      loginResult.success = req.isAuthenticated(); //should be true by this time
      loginResult.msg = null;

      res.json(loginResult);
      res.end();
    });

  // passport.authenticate('local', function (err, user_id, info) {
   

  // })(req, res, next);
});

//====================================================================================


app.post('/devlogin', function (req, res, next) {

  let loginResult = {
      success: false,
      msg: "System Error Occured.",
      other: null
    }

    //338 is test@test.com
    req.logIn(335, function (err) {
      if (err) {
        return next(err);
      }

      loginResult.success = req.isAuthenticated(); //should be true by this time
      loginResult.msg = null;

      res.json(loginResult);
      res.end();
    });

  // passport.authenticate('local', function (err, user_id, info) {
   

  // })(req, res, next);
});

//end DEV mess

//====================================================================================


app.get("/auth/now", (req, res) => {
  console.log("should have. +++ req.session.userInfo >>> ", req.session.userInfo);
  
  let data = {
    auth: false,
    isAdmin: false
  }

  if (req.isAuthenticated()){
    data.auth = true;
    data.isAdmin = helpers.isAdmin(req);
    data.userInfo = req.session.userInfo;
  }
  
  res.json(data);
})

//====================================================================================

app.post('/login', post_login);

//====================================================================================

app.post("/logout", (req, res) =>{
  req.logout();

  console.log(`req.session.userInfo might exist still: `, req.session.userInfo);
  req.session.userInfo = null;

  const result = {
    success: false,
    msg: "",
    id: -1
  }
  
  if (req.session.passport && req.session.passport.user){
    result.msg = "Logout failed on server";
    result.id = req.session.passport.user;

    return res.json(result);
  }

  result.success = true;

  return res.json(result);
})

//====================================================================================


const DOMAIN = 'localhost';
const PORT = '3001';
app.listen(PORT, () => {
  console.log(`Server listenning on http://${DOMAIN}:${PORT}`);
});