import express from 'express'
const app = express();
// require('module-alias/register');
const db = require("./db/knex");
const helpers = require("./helpers");
const isAdmin = require("./helpers/isAdmin")
const session = require('express-session');
var bodyParser = require('body-parser');
import authStrategy from "./helpers/authStrategy"
import post_login from './helpers/post_login';

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.use(session({
    secret: 'keyboard cat', resave: false, saveUninitialized: false
    // cookie: { secure: true }
}))

//BEGIN passport config

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(authStrategy));

passport.serializeUser((user_id, done) => {
    if (user_id) {
        done(null, user_id);
    }
});

passport.deserializeUser((user_id, done) => {
    const err = null;
    done(err, user_id);
});
//END passport config 

//morgan is a logger for development
var morgan = require('morgan');
// const myMorgan = morgan("dev"); const myMorgan =morgan('combined', {   skip:
// function (req, res) { return res.statusCode < 400 } })
const myMorgan = morgan(":method :url :status :response-time ms - :res[content-length]");
app.use(myMorgan);

app.use('/log', require('./controllers/log'));

var users = require('./controllers/users');
app.use('/users', users);

var doctors = require('./controllers/doctors');
app.use('/doctors', doctors);

var appointments = require('./controllers/appointments');
app.use('/appointments', appointments);

var availabilities = require('./controllers/availabilities');
app.use('/availabilities', availabilities);

app.use("/admin", require("./controllers/admin/index"))


app.post('/login', post_login);

app.post("/logout", (req, res) => {
    req.logout();
    req.session.userInfo = null;

    const result = {
        success: false,
        msg: "",
        id: -1
    }

    if (req.session.passport && req.session.passport.user) {
        result.msg = "Logout failed on server";
        result.id = req.session.passport.user;

        return res.json(result);
    }

    result.success = true;

    return res.json(result);
})

const DOMAIN = 'localhost';
const PORT = '3001';
app.listen(PORT, () => {
    console.log(`Server listenning on http://${DOMAIN}:${PORT}`);
});