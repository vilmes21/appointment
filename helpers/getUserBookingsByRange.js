const rootRequire = require.main.require;
const db = rootRequire("./db/knex");
const constants = rootRequire("./config/constants");

const apmtTable = "appointments";
const userTable = "users";
const fieldOfTable = (tableName, fieldName) => {
    return `${tableName}.${fieldName}`
}

//(int, ISO_string, ISO_string)
const getUserBookingsByRange = async(userId, start, end) => {
    const bookingArr = await db(apmtTable).join(userTable, fieldOfTable(apmtTable, "user_id"), fieldOfTable(userTable, "id"))
        .where({id: userId})
        .andWhereNot("status", constants.APPOINTMENT_STATUS_CANCELLED)
        .select("id", "wish_start_at", "wish_end_at", "user_id");
}

module.exports = getUserBookingsByRange