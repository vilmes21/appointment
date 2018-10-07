const getUserIdByReq = require("./getUserIdByReq.js")

const getUserIdForLog = req => {
    const id = getUserIdByReq(req);
    if (id > 0) {
        return id;
    }
    return null;
}

module.exports = getUserIdForLog;