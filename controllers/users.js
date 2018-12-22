var express = require('express'),
    router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const bcrypt = require('bcrypt');
const rootRequire = require.main.require;
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js");
const addLog = rootRequire("./helpers/addLog");
const saltRounds = 10;

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
    const _out = {
        success: false,
        msg: "Server error"
    };
    
    try {
        const {firstname, lastname, email, phone, password} = req.body;

        const existingUsers = await db("users").where({email});

        if (existingUsers.length > 0) {
            if (existingUsers.length > 1) {
                addLog(null, null, `Bad data integrity! ${req.method} ${req.originalUrl} multiple users (${existingUsers.length}) with email ${email}`);
            }

            _out.msg = "Same email already registered";
            return res.json(_out);
        }

        const hash = await bcrypt.hash(password, saltRounds);

        console.log("password plain: ", password, " hash: ", hash)

        const newIdArr = await db('users').insert({
            firstname,
            lastname,
            email,
            phone,
            password: hash,
            created_at: new Date(),
            updated_at: new Date()
        }).returning('id');

        //now log the new user in
        req.logIn(newIdArr[0], err => {
            if (err) {
                _out.msg = "New user created. Please try log in.";
                addLog(null, null, `${_out.msg}; ${req.method} ${req.originalUrl}`);
                return res.json(_out);
            }

            req.session.userInfo = {
                email,
                firstname,
                lastname,
                id: newIdArr[0],
                isAdmin: false
            };

            _out.success = true;
            _out.authenticated = req.isAuthenticated();
            _out.id = newIdArr[0]
            return res.json(_out);
        })
    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
    }

    return res.json(_out);
});

router.post('/updatePassword', helpers.requireLogin, async(req, res) => {
    const _out = {
        success: false,
        msg: "Error"
    }

    try {
        const {current, neww} = req.body;

        if (current === neww){
            _out.msg = "Current and new passwords cannot be same";
            return res.json(_out);
        }

        const userId = req.session.passport.user;

        const userArr = await db("users").where({id: userId});
        const isCurrentCorrect = await bcrypt.compare(current, userArr[0].password);

        if (!isCurrentCorrect) {
            _out.msg = "Current password incorrect";
            return res.json(_out);
        }

        const newHash = await bcrypt.hash(neww, saltRounds);

        await db('users')
            .where({id: userId})
            .update({password: newHash});

        _out.success = true;
    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
    }

    return res.json(_out)
});

module.exports = router