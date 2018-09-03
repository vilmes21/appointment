const moment = require("moment");

export default dayCount => {

    const collectByDay = {};

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

    return collectByDay;
}