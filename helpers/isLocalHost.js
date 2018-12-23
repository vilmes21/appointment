const addLog = require("./addLog");

module.exports = req => {
    try {
        return req.get("host").toLowerCase().indexOf("localhost") > -1;
    } catch (err) {
        addLog(null, err, "fn clinic_app/helpers/isLocalHost.js");
    }
    return false;
}