const moment = require("moment");
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");
const toYYYYMMDD = rootRequire("./helpers/toYYYYMMDD");
const constants = rootRequire("./config/constants");


        /*
why this fn is necessary? it pairs arr with a date string like "2018-11-13", even if it is empty, this empty arr will be needed in calendar.

   int => { 
    '2018-11-13': [],
    '2018-11-25': []
   }
    */

export default dayCount => {

    const collectByDay = {};

    try {
        //WARNING: cannot cache moment() in a variable and keep looping using the var!
        for (let i = 0; i <= dayCount; i++) {
            const keyISO = moment().add(i.toString(), "days").toJSON();
            
            //toYYYYMMDD is redundant here but necessary to be consistent
            collectByDay[toYYYYMMDD(keyISO)] = [];
        }
        
    } catch (e) {
        addLog(null, e, `fn /helpers/initCollectByDay.js. param dayCount>>>${dayCount}`);
    }
    return collectByDay;
}