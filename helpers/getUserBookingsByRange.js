const moment = require("moment")
const rootRequire = require.main.require;
const db = rootRequire("../db/knex");
const constants = rootRequire("./config/constants");
const addLog = rootRequire("./helpers/addLog.js")
const {cancellableSpanMinute} = rootRequire("./config/constantsNotDb.js")

const apmtTable = "appointments";
const userTable = "users";
const doctorTable = "doctors"
const tableDotField = (tableName, fieldName) => {
    return `${tableName}.${fieldName}`
}

//(int, ISO_string, ISO_string)
const getUserBookingsByRange = async(userId, start, end) => {
    let bookingArr = [];

    try {
        const aptIdAlias = "aptId";
        const aptIdAs = tableDotField(apmtTable, "id") + " as " + aptIdAlias;

        const aptArr = await db(apmtTable).join(userTable, tableDotField(apmtTable, "user_id"), tableDotField(userTable, "id"))
            .where({"users.id": userId})
            .andWhereNot("status", constants.APPOINTMENT_STATUS_CANCELLED)
            .select(aptIdAs, "wish_start_at", "wish_end_at", "user_id", "doctor_id");

            const allDrs = await db('doctors')
            .join('users', 'doctors.user_id', 'users.id')
            .select('users.firstname', 'users.lastname', 'doctors.id', 'doctors.url_name');
            
        const drDict = {}
        for (const dr of allDrs) {
            drDict[dr.id] = dr.firstname + " " + dr.lastname;
        }

        const now = moment();
        for (const apt of aptArr) {
            const drFullName = drDict[apt.doctor_id];

            //end.diff(start, "minutes") will be postive
            const canBeCancelled = now.diff(moment(apt.wish_start_at), "minutes") > cancellableSpanMinute;

            bookingArr.push({id: apt[aptIdAlias], drFullName, start: apt.wish_start_at, end: apt.wish_end_at, canBeCancelled})
        }
    } catch (e) {
        addLog(userId, e, `/helpers/getUserBookingsByRange.js`);
    }

    return bookingArr;
}

module.exports = getUserBookingsByRange