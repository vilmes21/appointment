import getOutOfOfficeSlots from "./getOutOfOfficeSlots";
import shapeOutOfOfficeSlots from "./shapeOutOfOfficeSlots";
import shapeBookedSlots from "./shapeBookedSlots";
import shapeFullOccupancy from "./shapeFullOccupancy";
const rootRequire = require.main.require;
const constants = rootRequire("./config/constants");
const moment = require("moment");
const db = rootRequire("./db/knex");
const helpers = rootRequire("./helpers");
const getUserIdByReq = rootRequire("./helpers/getUserIdByReq.js")
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js")
const addLog = rootRequire("./helpers/addLog");
const isAdmin = rootRequire("./helpers/isAdmin");

export default async(req, res) => {

    /*
    logic:
    -fetch all dr availabilities slots, simplify them: 1-3, 3-5 becomes 1-5
    -reverse grey out all non-available hours
    -fetch all appointments booked
    -return array collection of objects, including all non-available slots + booked appms
    */

    let allBadSlots = [];
    const userId = getUserIdByReq(req);

    try {
        const {id} = req.params;
        const now = moment().toJSON();
        const endOfRange = moment().add(constants.USER_PREVIEW_DAYS.toString(), "days").toJSON();

        const availables = await db("availabilities")
            .where({doctor_id: id})
            .whereBetween("start_at", [now, endOfRange]);

        if (availables.length === 0) {
            return res.json(shapeFullOccupancy(constants.USER_PREVIEW_DAYS));
        }

        const collectByDay = getOutOfOfficeSlots(availables);
        if (!collectByDay){
            //errored in getOutOfOfficeSlots
            return res.json(false);
        }

        const unavailables = shapeOutOfOfficeSlots(collectByDay);

        // console.log("unavailables:999 unavailables: ", unavailables)

        const booked = await db("appointments")
            .innerJoin('users', 'users.id', 'appointments.user_id')
            .select("users.firstname", "users.lastname", "appointments.id", "appointments.doctor_id", "appointments.status", "appointments.wish_start_at", "appointments.wish_end_at", "appointments.user_id")
            .where({doctor_id: id, status: constants.APPOINTMENT_STATUS_BOOKED})
            .whereBetween("wish_start_at", [now, endOfRange]);

    /* 
    [
        {
            firstname: 'Jack',
            lastname: 'Smithe',
            id: 254,
            doctor_id: 205,
            status: 304,
            wish_start_at: 2018-10-11T16:35:00.000Z,
            wish_end_at: 2018-10-11T16:40:00.000Z,
            user_id: 345 
        }
    ]
    */

        let cleanBooked = [];
        if (booked && booked.length > 0) {
            cleanBooked = shapeBookedSlots(booked, userId, await isAdmin(req));
        }

        allBadSlots = unavailables.concat(cleanBooked);

        console.log("66666 allBadSlots: ", allBadSlots)

    } catch (e) {
        addLog(userId > 0 ? userId : null, e, `${req.method} ${req.originalUrl} fn getUnavailabilities.js`);
    }

    return res.json(allBadSlots);
}
