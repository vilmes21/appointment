const passport = require('passport');

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
    passport.authenticate('local', callback(req, res, next))(req, res, next);
}