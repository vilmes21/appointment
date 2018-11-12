const moment = require("moment");
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");

//ISO_date_string => Date_obj
export default dayString => {
    try {
        // console.log("fn getLastMid dayString:", dayString)
        
        return moment(dayString)
            .startOf('day')
            .toDate();

    } catch (e) {
        addLog(null, e, `fn /helpers/getLastMidnight.js. param dayString>>>${dayString}`);
    }
}