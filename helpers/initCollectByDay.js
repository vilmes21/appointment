const moment = require("moment");
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");

export default dayCount => {

    const collectByDay = {};

    try {

        for (let i = 0; i <= dayCount; i++) {
            const keyStr = moment().add(i.toString(), "days")
                .toDate()
                .toDateString();
            collectByDay[keyStr] = [];
        }

        /*
   collectByDay>> {
                    'Sat Mar 17 2018': [],
                    'Sun Mar 18 2018': [] }
    */
    } catch (e) {
        addLog(null, e, `fn /helpers/initCollectByDay.js. param dayCount>>>${dayCount}`);
    }
    return collectByDay;
}