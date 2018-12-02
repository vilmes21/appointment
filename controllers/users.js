var express = require('express'),
    router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const rootRequire = require.main.require;
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js")

router.get("/me", helpers.requireLogin, (req, res) => {
    const userId = req.session.passport.user;
    console.log("userId >>>", userId);
    if (!userId || userId < 0) {
        res.json("you hack!");
        res.end();
    }
    db("users")
        .where({id: userId})
        .then((user) => {
            if (user.length < 1) {
                res.json("you hack fake userId!");
                res.end();
                return;
            }
            res.json({email: user[0].email, phone: user[0].phone})

        })
        .catch((err) => {
            console.log(err);
        })
})

router.post('/new', async(req, res) => {
    try {

        const existingUsers = await db("users").where({email: req.body.email});

        if (existingUsers.length > 0) {
            return res.json({success: false, msg: "Same email already registered."});
        }

        const {firstname, lastname, email, phone, password} = req.body;

        const newIdArr = await db('users').insert({
            firstname,
            lastname,
            email,
            phone,
            password, //TODO: later hash it
            created_at: new Date(),
            updated_at: new Date()
        }).returning('id');

        //now log the new user in
        req.logIn(newIdArr[0], err => {
            if (err) {
                return res.json({success: false, msg: "New user created but failed to auto-login."})
            }

            req.session.userInfo = {
                email,
                firstname,
                lastname,
                id: newIdArr[0],
                isAdmin: false
            };

            return res.json({
                success: true,
                authenticated: req.isAuthenticated(),
                msg: "Welcome, new user!",
                id: newIdArr[0]
            })
        })
    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
    }
    return res.json({success: false, msg: "Error"})

});

module.exports = router