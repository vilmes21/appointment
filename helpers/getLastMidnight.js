const moment = require("moment");

//"Sun Mar 04 2018" => Date_obj
export default dayString => {
    return moment(new Date(dayString)).startOf('day').toDate();
}