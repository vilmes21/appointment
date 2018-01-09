const db = require("./db/knex");
const constants = require("./config/constants");
  var session = require('express-session');

// Use the session middleware
// router.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }})); //TODO: change secret

function requireLogin(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    // res.send("pls log in first");
    // req.loggedIn = false;
    // const loginUrl = "http://localhost:3000/sign_up";
    // return res.redirect(loginUrl);
    return res.json({
        serverBadAuth: true
    })
}

const footprint = (x) => {
    console.log("+++++++++++++++++++++++++++++++++++++ " + x);
  }

const requireAdmin = (req, res, next) => {
    //TODO change fake :
    return next();
    
    // if (!req.isAuthenticated()) {
    //     return res.json({
    //         serverBadAuth: true
    //     })
    // }
   
    // db("user_roles")
    // .where({
    //     role_id: constants.ROLE_ADMIN
    // })
    // .select("user_id")
    // .then((admins) => {
    //     footprint(55);
    //     console.log("admins >>>>", admins);
    //     let _admins = [];

    //     for (let admin of admins){
    //         _admins.push(admin.user_id);
    //     }

    //     if (_admins.includes(req.session.passport.user)) {
    //         //TODO: fetched admin id array and save it in session for quick lookup
    //         return next();
    //     }      
    //     return res.json({
    //         nonAdminAuth: true
    //     })
    // })
}

// const cacheUserAdmins = (req) => {
//     db("user_roles")
//     .where({
//         role_id: constants.ROLE_ADMIN
//     })
//     .select("user_id")
//     .then((admins) => {
//         let _admins = [];

//         for (let admin of admins){
//             _admins.push(admin.user_id);
//         }

//         footprint(56, "should see me BEFORE")

//         req.session.admins = _admins;
//     })
// }

const isAdmin = (req) => {
    footprint(57 + "func helpers.isAdmin: i am being called ")
    
    if (!req.isAuthenticated()){
        return false;
    }

    if (req.session.admins){
        return req.session.admins.indexOf(req.session.passport.user) > -1;
    }

    return false;
    // const x = cacheUserAdmins(req);
    // footprint(56 + " should see me AFTER. req.session.admins >>>" + req.session.admins)
    
    // isAdmin(req);
}

const findDrId = (req, res, next) => {
  
    if (req.params.id == parseInt(req.params.id)) {
      // then it's int already
      next();
      return;
    }
  
    const drs = { //TODO: go into db grab and then cache in session
      Hermann: 205,
      A_last: 211,
      B_last: 212,
      Wang: 210
    };
  
    if (!drs[req.params.id]){
      res.json("yow bad url, no such dr");
      return;
      // res.end();
    }
    
    req.params.id= drs[req.params.id];
    next();
  }

module.exports = {
    requireLogin: requireLogin,
    requireAdmin: requireAdmin,
    isAdmin: isAdmin,
    footprint: footprint,
    findDrId: findDrId
}