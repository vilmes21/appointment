const moment = require("moment");
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");

//"Sun Mar 04 2018" => Date_obj
export default dayString => {
    try {
        return moment(new Date(dayString))
            .startOf('day')
            .toDate();

    } catch (e) {
        addLog(null, e, `fn /helpers/getLastMidnight.js. param dayString>>>${dayString}`);
    }
}