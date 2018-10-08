import moment from "moment";
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");
const isThePast = rootRequire("./helpers/isThePast");


//arg: string, int
module.exports = (timeString, spanInMinute) => {
    console.log("ENTER fn isNearlyOrPastTime" + `param timeString>>>${timeString} ; spanInMinute>>>${spanInMinute}`);
    try {
        if (isThePast(timeString)){
            return true;
        }

        const futureTimePoint = moment().add(spanInMinute, 'minutes')
        return moment(timeString) <= futureTimePoint;
    } catch (e) {
        addLog(null, e, `fn /helpers/isNearlyOrPastTime.js. param timeString>>>${timeString} ; spanInMinute>>>${spanInMinute}`);
        return false;
    }
}