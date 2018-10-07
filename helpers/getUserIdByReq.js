const getNestedPropByPath = require("./getNestedPropByPath.js")

const getUserIdByReq = req => {
    if (!req.isAuthenticated()){
        return -1;
    }

    const userId = getNestedPropByPath(req, "session.passport.user");
    if (typeof userId === "undefined"){
        return -1;
    }
    
    return userId;
}

module.exports = getUserIdByReq

