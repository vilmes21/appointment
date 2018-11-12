const rootRequire = require.main.require;
const constants = rootRequire("./config/constants");
const moment = require("moment");

//string => string
const toYYYYMMDD = dateString => {
    return moment(dateString).format(constants.KEY_DAY_FORMAT);
}

module.exports = toYYYYMMDD