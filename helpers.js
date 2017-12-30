
function requireLogin(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    // res.send("pls log in first");
    // req.loggedIn = false;
    const loginUrl = "http://localhost:3000/login";
    return res.redirect(loginUrl);
}

const footprint = (x) => {
    console.log("+++++++++++++++++++++++++++++++++++++ " + x);
  }

module.exports = {
    requireLogin: requireLogin,
    footprint: footprint
}