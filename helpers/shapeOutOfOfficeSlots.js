const rootRequire = require.main.require;
const constants = rootRequire("./config/constants");

/*

   ({ 
 'Sun Feb 25 2018': 
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
    //BEGIN create out-of-office slots into array of obj
    const unavailables = [];

    for (let drDay in collectByDay) {
        const eachDayArr = collectByDay[drDay];
        const eachDayArrCount = eachDayArr.length;

        const unavailable = {
            title: constants.UNAVAILABLE_SLOT_TITLE,
            type: constants.slotType.outOfOffice
        };

        for (let i = 0; i < eachDayArrCount; i++) {
            if (i % 2 === 0) { //ie. even index, then be start_at
                unavailable.start = eachDayArr[i];
            } else { //ie. odd index, then be end_at
                unavailable.end = eachDayArr[i];
                unavailables.push({
                    ...unavailable
                });
            }

        }
    }

    //  console.log("right before return result unavailables human readable>>")  for
    // (let b in unavailables){    console.log("unavailables[b].start.toString()
    // >>", unavailables[b].start.toString())
    // console.log("unavailables[b].end.toString()   >>",
    // unavailables[b].end.toString())  } END create out-of-office slots into array
    // of obj

    return unavailables;
}