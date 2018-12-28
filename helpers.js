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
        success: false,
        serverBadAuth: true,
        msg: "Please log in"
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




const findDrId = (req, res, next) => {
    
    let idGiven = req.params.id;
  
    if (idGiven == parseInt(idGiven)) {
      // then it's int already
      next();
      return;
    }

    if (typeof(idGiven) === "string"){
        idGiven = idGiven.toLowerCase();
    }

    //at this point, it's string like "Jack"
    
    const drs = { //TODO: go into db grab and then cache in session
      hermann: 205,
      a_last: 211,
      b_last: 212,
      wang: 210
    };
  
    if (!drs[idGiven]){
      res.json("yow bad url, no such dr");
      return;
      // res.end();
    }
    
    req.params.id= drs[idGiven];
    req.params.drId= drs[idGiven]; //should use this. Later on remove previous line and take care of its old references
    next();
  }

// params slot is object, must have properties start_at  and end_at of type Date
const isSlotInPast = (slot) => {
    return slot.start_at < new Date() || slot.end_at < new Date();
}



//(array, array, obj)
const isSlotValid = (goodHours, slotsTaken, want) => {
    return false;

    //TODO
    // return isDuringDrHour(goodHours, want) && isSlotOpen(slotsTaken, want);
}

const turnStringToDate = (arrayOfObj) => {
    let converted = [];
    for (var slot of arrayOfObj){
        slot.start_at = new Date(slot.start_at);
        slot.end_at = new Date(slot.end_at);

        converted.push(slot)
      }
      return converted;
}

const keepUniqueElems = (arr) => {
    // console.log("fn keepUniqueElems. arr >> ", arr)
    
    const dict = {};

    for (let a of arr){
        // console.log("fn loop keepUniqueElems. a >> ", a, "of type >>", typeof(a))

        let item;
        if (typeof(a) === "object"){
            item = a.toISOString();
        } else {
            item = a;
        }

        // console.log("fn loop keepUniqueElems. item >> ", item, "of type should STRING >>", typeof(item))
        
        if (dict[item]){
            dict[item] += 1;
        } else {
            dict[item] = 1;
        }
    }

    // console.log("fn keepUniqueElems. dict >> ", dict)
    
    const uniques = [];
    
    for (let key in dict){
        if (dict[key] === 1){
            uniques.push(key);
        }
    }
    
    // console.log("fn keepUniqueElems. uniques >> ", uniques)
    
    return uniques;
}


module.exports = {
    requireLogin: requireLogin,
    requireAdmin: requireAdmin,
    footprint: footprint,
    findDrId: findDrId,
    isSlotValid: isSlotValid,
    isSlotInPast: isSlotInPast,
    turnStringToDate: turnStringToDate,
    keepUniqueElems: keepUniqueElems
}