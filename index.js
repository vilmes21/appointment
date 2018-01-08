const express = require('express');
const app = express();
const db = require("./db/knex");
const helpers = require("./helpers");
const session = require('express-session');
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

// Use the session middleware
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

passport.use(new LocalStrategy(
  function (username, password, done) {
    db('users').where({
        email: username
      })
      .then((users) => {
        if (users.length < 1) {
          // what if there's multiple emails? no good, must ensure db level email unique
          return done(null, false, {
            message: 'Incorrect email.'
          });
        }

        const user = users[0];

        // if (!users.validPassword(password)) {
        if (user.password !== password) {
          return done(null, false, {
            message: 'Incorrect password.'
          });
        }

        return done(null, user.id);
      })
      .catch((err) => {
        return done(err);
      })

  } //close LocalStra func
));

passport.serializeUser(function (user_id, done) {
  if (user_id) {
    done(null, user_id);
  }
});

passport.deserializeUser(function (user_id, done) {
  err = null;
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


//BEGIN testing
// var tests = require('./controllers/tests');
// app.use('/tests', tests);

//END testing

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

app.get("/auth/now", (req, res) => {
  let data = {
    auth: false,
    isAdmin: false
  }

  if (req.isAuthenticated()){
    data.auth = true;
    data.isAdmin = helpers.isAdmin(req);
  }
  
  res.json(data);
})

app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user_id, info) {
    let loginResult = {
      success: false,
      msg: "System Error Occured.",
      other: null
    }

    if (err) {
      loginResult.other = err;
      res.json(loginResult);
      next(err);
    }

    if (!user_id) {
      loginResult.msg = "db checked. Wrong credentials."
      res.json(loginResult);
      res.end();
    }

    req.logIn(user_id, function (err) {
      if (err) {
        return next(err);
      }

      loginResult.success = req.isAuthenticated(); //should be true by this time
      loginResult.msg = null;

      res.json(loginResult);
      res.end();
    });

  })(req, res, next);
});

app.get("/logout", (req, res) =>{
  req.logout();
  if (req.session.passport && req.session.passport.user){
    res.json({
      loggedOut: false,
      userId: req.session.passport.user
    });
    res.end();
  }

  res.json({
    loggedOut: true
  });

})


const DOMAIN = 'localhost';
const PORT = '3001';
app.listen(PORT, () => {
  console.log(`Server listenning on http://${DOMAIN}:${PORT}`);
});