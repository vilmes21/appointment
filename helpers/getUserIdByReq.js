const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");
const getNestedPropByPath = require("./getNestedPropByPath.js")

const getUserIdByReq = req => {
    let userId = -1
    try {
        if (!(req && req.isAuthenticated())) {
            return -1;
        }

        userId = getNestedPropByPath(req, "session.passport.user");
        if (typeof userId === "undefined") {
            return -1;
        }
    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}. fn /helpers/getUserIdByReq.js`);
    }
    return userId;
}

module.exports = getUserIdByReq
