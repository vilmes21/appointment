const passport = require('passport');
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog");


const callback = (req, res, next) => {
    return (err, user_id, info) => {
        let _out = {
            success: false,
            msg: null,
            other: null
        }

        if (err) {
            _out.other = err;
            _out.msg = "Server error";
            return next(err);
        }

        if (!user_id) {
            _out.msg = "Wrong credentials"
            res.json(_out);
        }

        req.logIn(user_id, err => {
            if (err) {
                return next(err);
            }

            _out.success = req.isAuthenticated(); //should be true by this time

            if (_out.success) {
                const {email, firstname, lastname, id, isAdmin, emailConfirmed} = info;

                //add basic info into session
                req.session.userInfo = {
                    email,
                    firstname,
                    lastname,
                    id,
                    isAdmin
                };

                _out = {
                    ..._out,
                    email,
                    firstname,
                    lastname,
                    id,
                    isAdmin,
                    emailConfirmed
                };
            }

            res.json(_out);
        });

    }
};

export default(req, res, next) => {
    try {
        passport.authenticate('local', callback(req, res, next))(req, res, next);
    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl} ; fn /helpers/post_login.js`);
    }
}