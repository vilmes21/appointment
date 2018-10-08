import moment from "moment";
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");


//arg: string, int
module.exports = (timeString, spanInMinute) => {
    try {
        const pastTimePoint = moment().subtract(spanInMinute, 'minutes')
        return moment(timeString) <= pastTimePoint;
    } catch (e) {
        addLog(null, e, `fn /helpers/isTimeAgo.js. param timeString>>>${timeString} ; spanInMinute>>>${spanInMinute}`);
        return false;
    }
}