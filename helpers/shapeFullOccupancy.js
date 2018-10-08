import initCollectByDay from "./initCollectByDay";
import getLastMidNight from "./getLastMidNight";
import getComingMidnight from "./getComingMidnight";
import shapeOutOfOfficeSlots from "./shapeOutOfOfficeSlots";
import getOutOfOfficeWholeDay from "./getOutOfOfficeWholeDay";

const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");

/*

   (435)

   =>

   [
     { title: 'Dr does NOT work now',
     type: 'OUT_OF_OFFICE',
     start: 2018-02-25T08:00:00.000Z,
     end: 2018-02-26T07:59:59.999Z },

     { title: 'Dr does NOT work now',
     type: 'OUT_OF_OFFICE',
     start: 2018-02-25T08:00:00.000Z,
     end: 2018-02-26T07:59:59.999Z },
   ]

*/

export default(dayCount) => {
    try {
        const collectByDay = initCollectByDay(dayCount);

        for (let _dayString in collectByDay) {
            collectByDay[_dayString] = getOutOfOfficeWholeDay(_dayString);
        }

        const busys = shapeOutOfOfficeSlots(collectByDay);

        return busys;
    } catch (e) {
        addLog(null, e, `fn helpers/shapeFullOccupancy.js. param dayCount>>>${dayCount}`);
    }
}