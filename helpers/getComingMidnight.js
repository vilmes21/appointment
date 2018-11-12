const moment = require("moment");
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");

//"Sun Mar 04 2018" => Date_obj
export default dayString => {
    try {
        // console.log("fn getComingMid dayString:", dayString)

        return moment(dayString)
            .endOf('day')
            .toDate();
    } catch (e) {
        addLog(null, e, `fn /helpers/getComingMidnight.js. param dayString>>>${dayString}`);
    }
}