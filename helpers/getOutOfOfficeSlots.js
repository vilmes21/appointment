import initCollectByDay from "./initCollectByDay"
import getLastMidNight from "./getLastMidNight";
import getComingMidnight from "./getComingMidnight";

const moment = require("moment");
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");
const toYYYYMMDD = rootRequire("./helpers/toYYYYMMDD");
const constants = rootRequire("./config/constants");
const helpers = rootRequire("./helpers");

/*
   ([]) =>
   {
    '2018-11-14':
                   [ 2018-02-25T22:00:00.000Z,
                     2018-02-25T22:30:00.000Z]
   }
   */

export default dbAvas => {

    //   console.log("arg dbAvas: ", dbAvas)

    let collectByDay = {};

    try {

        const collect = [];

        for (let ava of dbAvas) {
            collect.push(ava.start_at);
            collect.push(ava.end_at);
        }

        /*
   collect >>>  [
                    2018-03-05T01:00:00.000Z,
                    2018-03-05T20:30:00.000Z]
   */

        let cleaned = helpers.keepUniqueElems(collect); //[1,3,3,5] becomes [1,5]
        const cleanedCount = cleaned.length;
        if (cleanedCount % 2 !== 0) { //i.e if count is odd, then db has bad data
            addLog(null, "db has bad data. Count is odd; expected even.", `fn /helpers/getOutOfOfficeSlots.js. param dbAvas >>> ${JSON.stringify(dbAvas)} `);
            return false;
        }

        collectByDay = initCollectByDay(constants.USER_PREVIEW_DAYS);

        for (let j = 0; j < cleanedCount; j++) {
            const _keyString = toYYYYMMDD(cleaned[j]);
            const date = new Date(cleaned[j]);
            collectByDay[_keyString].push(date);
        }

        for (let drDay in collectByDay) {
            const dayOpennings = collectByDay[drDay]; // type: []
            if (dayOpennings.length > 0) {
                dayOpennings.sort((a, b) => {
                    return a - b;
                });
            }

            // as suggested by
            // https://stackoverflow.com/questions/43101278/how-to-handle-deprecation-warnin
            // g -in-momentjs/43102805, sometimes , might need specify format

            const drDay_ISO = moment(drDay, constants.KEY_DAY_FORMAT).toJSON();

            dayOpennings.unshift(getLastMidNight(drDay_ISO));
            dayOpennings.push(getComingMidnight(drDay_ISO));
        }

        // cleaned looks like [1, 4, 5, 9] meaning 1-4, 5-9 avaialble. Add 2 elems as
        // [last-mid-night, 1, 4, 5, 9, this-mid-night]
    } catch (e) {
        addLog(null, e, `fn /helpers/getOutOfOfficeSlots.js. param dbAvas >>> ${JSON.stringify(dbAvas)} `);
    }

    return collectByDay;

    /*
 collectByDay >>>  {
 '2018-11-14':
                   [ 2018-02-25T22:00:00.000Z,
                     2018-02-25T22:30:00.000Z]
   }
   */

}
