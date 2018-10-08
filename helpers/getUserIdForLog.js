const getUserIdByReq = require("./getUserIdByReq.js")
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");

const getUserIdForLog = req => {
    try {

        if (!req) {
            return null;
        }

        const id = getUserIdByReq(req);
        if (id > 0) {
            return id;
        }
    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}. fn /helpers/getUserIdForLog.js`);
    }
    return null;
}

module.exports = getUserIdForLog;