const rootRequire = require.main.require;
const constants = rootRequire("./config/constants");
const addLog = rootRequire("./helpers/addLog");
const moment = require("moment");

/*

   ({
        '2018-11-14':
                   [ 2018-02-25T22:00:00.000Z,
                     2018-02-25T22:30:00.000Z]
   })

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

export default(collectByDay) => {

    // console.log("arg collectByDay:", collectByDay)
    
    const busyArr = [];

    try {
        const busy = {
            title: constants.UNAVAILABLE_SLOT_TITLE,
            type: constants.slotType.outOfOffice
        };

        let counter = 1;
        for (let drDay in collectByDay) {
            const eachDayArr = collectByDay[drDay];
            const eachDayArrCount = eachDayArr.length;

            for (let i = 0; i < eachDayArrCount; i++) {
                if (i % 2 === 0) { //ie. even index, then be start_at
                    busy.start = eachDayArr[i];
                } else { //ie. odd index, then be end_at
                    busy.end = eachDayArr[i];
                    busyArr.push({
                        ...busy,
                        id: `bad_${counter++}`
                        //id might be helpful for React Calendar
                    });
                }

            }
        }

    } catch (e) {
        addLog(null, e, `fn helpers/shapeOutOfOfficeSlots.js. param collectByDay>>>${JSON.stringify(collectByDay)}`);
    }

    return busyArr;
}