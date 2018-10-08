const passport = require('passport');
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog");


const callback = (req, res, next) => {
    return (err, user_id, info) => {

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

        req.logIn(user_id, err => {
            if (err) {
                return next(err);
            }

            loginResult.success = req.isAuthenticated(); //should be true by this time
            loginResult.msg = null;

            if (loginResult.success) {
                const {email, firstname, lastname, id, isAdmin} = info;

                //add basic info into session
                req.session.userInfo = {
                    email,
                    firstname,
                    lastname,
                    id,
                    isAdmin
                };

                loginResult = {
                    ...loginResult,
                    email,
                    firstname,
                    lastname,
                    id,
                    isAdmin
                };
            }

            res.json(loginResult);
            res.end();
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