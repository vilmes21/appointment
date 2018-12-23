var express = require('express'),
    router = express.Router();
const db = require("../db/knex");
const isLocalHost =rootRequire("./helpers/isLocalHost");
const helpers = require("../helpers");
const bcrypt = require('bcrypt');
const rootRequire = require.main.require;
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js");
const addLog = rootRequire("./helpers/addLog");
const saltRounds = 10;
const emailer = rootRequire("./helpers/emailer.js");
const appkeys = rootRequire("./appkeys.js")
const uuidv1 = require('uuid/v1');

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
        msg: null
    };

    try {
        const {firstname, lastname, email, phone, password} = req.body;

        const existingUsers = await db("users").where({email});

        if (existingUsers.length > 0) {
            _out.msg = "Same email already registered";
            return res.json(_out);
        }

        const hash = await bcrypt.hash(password, saltRounds);

        const insertedReturnArr = await db('users').insert({
            firstname,
            lastname,
            email,
            phone,
            password: hash,
            created_at: new Date(),
            updated_at: new Date(),
            guid_id: uuidv1(),
            email_confirmed: false
        }).returning(['id', 'guid_id']);

        /* 
        [{ id: 398, guid_id: 'a85c6690-067c-11e9-9ea4-3930ef97bd80' }]
        */
        
        const insertedObj = insertedReturnArr[0];
        const userNewId = insertedObj.id;
        const userGuidId = insertedObj.guid_id;
        _out.id = userNewId;

        //email user email-confirmation link
        const {rootUrl, companyName} = appkeys;
        const mailOptions = {
            from: companyName,
            to: email,
            subject: 'Please confirm your email address',
            html: `<h1>Thanks for signing up!</h1><div>Please <a href="${rootUrl}/users/confirmEmail/${userGuidId}">click here </a> to confirm your email.</div><br/><div>Regards,</div><div>${companyName}</div>`
        };

        if (isLocalHost(req)){
            mailOptions.isLocalHost = true;
        }

        const emailSendingResult = await emailer(mailOptions);
        if (!emailSendingResult || !emailSendingResult.success) {
            _out.needResendEmailConfirmation = true;
        }

        //now log the new user in
        const err = await req.logIn(userNewId, ()=>{});

        if (err) {
            _out.msg = "New user created. Please try log in.";
            addLog(null, null, `${_out.msg}; ${req.method} ${req.originalUrl}`);
            return res.json(_out);
        }

        req.session.userInfo = {
            email,
            firstname,
            lastname,
            id: userNewId,
            isAdmin: false
        }

        _out.success = true;
        _out.authenticated = req.isAuthenticated();

        return res.json(_out);

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

        if (current === neww) {
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