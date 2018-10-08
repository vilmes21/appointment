import moment from "moment";
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");

export default timeString => {
    try {
        return moment() > moment(timeString);
    } catch (e) {
        addLog(null, e, `fn /helpers/isThePast.js. param timeString>>>${timeString}`);
    }
}