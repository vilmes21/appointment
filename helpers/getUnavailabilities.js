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

    try {
        const now = new Date();
        const twoWeeksLater = moment().add(constants.USER_PREVIEW_DAYS.toString(), "days").toDate();

        const availables = await db("availabilities")
            .where({doctor_id: req.params.id})
            .whereBetween("start_at", [now, twoWeeksLater]);

        if (availables.length === 0) {
            return res.json(shapeFullOccupancy(constants.USER_PREVIEW_DAYS));
        }

        const collectByDay = getOutOfOfficeSlots(availables);
        const unavailables = shapeOutOfOfficeSlots(collectByDay);

        // const booked = await db("appointments")
        //     .where({doctor_id: req.params.id, status: constants.APPOINTMENT_STATUS_BOOKED })
        //     .whereBetween("wish_start_at", [now, twoWeeksLater]);

            const booked = await db("appointments")
            .innerJoin('users', 'users.id', 'appointments.user_id')
            .select("users.firstname", "users.lastname", "appointments.id", "appointments.doctor_id", "appointments.status", "appointments.wish_start_at", "appointments.wish_end_at", "appointments.user_id")
            .where({doctor_id: req.params.id, status: constants.APPOINTMENT_STATUS_BOOKED})
            .whereBetween("wish_start_at", [now, twoWeeksLater]);

        let cleanBooked = [];
        if (booked && booked.length > 0) {
            cleanBooked = shapeBookedSlots(booked, getUserIdByReq(req), await isAdmin(req));
        }

        allBadSlots = unavailables.concat(cleanBooked);

        // console.log("right before return result allBadSlots converted>>") for (let b
        // in allBadSlots) {     console.log("allBadSlots[b].start.toString() >>",
        // allBadSlots[b].start.toString())
        // console.log("allBadSlots[b].end.toString()   >>",
        // allBadSlots[b].end.toString()) }

    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl} fn getUnavailabilities.js`);
    }

    return res.json(allBadSlots);
}
