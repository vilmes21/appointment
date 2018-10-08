import moment from 'moment'
import getLastMidnight from './getLastMidnight';
import getComingMidnight from './getComingMidnight'
const rootRequire = require.main.require;
const isThePast = rootRequire("./helpers/isThePast")
const db = rootRequire("./db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");
const toLowerCaseOrUndefined = rootRequire("./helpers/toLowerCaseOrUndefined.js")
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js")
const addLog = rootRequire("./helpers/addLog.js")
const getUserIdByReq = rootRequire("./helpers/getUserIdByReq.js")
const shapeBookedSlots = rootRequire("./helpers/shapeBookedSlots.js")

export default async(req, res) => {
    let result = {
        success: false,
        msg: ""
    };

    const userId = getUserIdByReq(req);

    try {
        const {wish_start_at, wish_end_at} = req.body;

        if (!(typeof wish_start_at === "string" && wish_start_at) || !(typeof wish_end_at === "string" && wish_end_at)) {
            result.msg = "Time formats incorrect";
            return res.json(result);
        }

        const momentWishStart = moment(wish_start_at);
        const momentWishEnd = moment(wish_end_at);

        if (momentWishStart > momentWishEnd) {
            result.msg = "End Time must be after Start Time";
            return res.json(result);
        }

        if (momentWishEnd < moment()) {
            result.msg = "Time travel is temporarily impossible";
            return res.json(result);
        }

        const want = {
            start_at: new Date(req.body.wish_start_at),
            end_at: new Date(req.body.wish_end_at)
        }

        const beginningOfWantedDay = getLastMidnight(wish_start_at);
        // const beginningOfWantedDay = momentWishStart.startOf('day');
        const endOfWantedDay = getComingMidnight(wish_end_at);
        // const endOfWantedDay = momentWishEnd.endOf('day');

        const userAppmtsThatDay = await db("appointments")
            .where({user_id: userId, status: constants.APPOINTMENT_STATUS_BOOKED})
            .andWhere("wish_start_at", ">=", beginningOfWantedDay)
            .andWhere("wish_end_at", "<=", endOfWantedDay);

        if (userAppmtsThatDay.length >= constants.MAX_APPTS_PER_DAY) {
            result.msg = "Your daily max bookings reached";
            return res.json(result);
        }

        const doctors = await db("doctors")
            .where({is_public: true})
            .select("url_name", "id");

        /*
[
    {
        url_name: "dkslfj",
        id: 3
    },
    {
        url_name: "2dkslfj",
        id: 34
    }
]
 */

        const {drUrlName} = req.body;

        const lowerCaseDrUrlName = toLowerCaseOrUndefined(drUrlName);
        if (!lowerCaseDrUrlName) {
            result.msg = "Doctor not found";
            return res.json(result);
        }

        const doctorObj = doctors.find(obj => toLowerCaseOrUndefined(obj.url_name) === lowerCaseDrUrlName);
        if (!doctorObj) {
            result.msg = "Failed to find doctor";
            return res.json(result);
        }

        const drId = doctorObj.id;

        //BEGIN check slot proposed is within the dr's hours

        let drHoursThatDay = await db("availabilities")
            .where({doctor_id: drId})
            .andWhere("start_at", ">=", beginningOfWantedDay)
            .andWhere("end_at", "<=", endOfWantedDay);

        if (drHoursThatDay.length === 0) {
            result.msg = "Doctor out of office";
            return res.json(result);
        }

        drHoursThatDay = helpers.turnStringToDate(drHoursThatDay); //TODO: make sure the initial obj actually uses string as datetimes. If it already is instances of Date(), then no need this.

        if (!helpers.isDuringDrHour(drHoursThatDay, want)) {
            result.msg = "Not within doctor's office hours."
            return res.json(result);
        }

        // END check slot proposed in within the dr's hours BEGIN see if other users
        // already booked slot
        let drBookedThatDay = await db("appointments")
            .where({doctor_id: drId, status: constants.APPOINTMENT_STATUS_BOOKED})
            .andWhere("wish_start_at", ">=", beginningOfWantedDay) //TODO: maybe in the future no need to query all those records for the whole day. Maybe just 2 hours after the `want.end_at`.
            .andWhere("wish_end_at", "<=", endOfWantedDay);

        if (drBookedThatDay.length > 0) {
            drBookedThatDay = helpers.turnStringToDate(drBookedThatDay);

            if (!helpers.isSlotOpen(drBookedThatDay, want)) {
                result.msg = "Oooops... another use just booked that slot. Please refresh page and try again."

                return res.json(result);
            }
        }

        //END see if other users already booked slot

        const newApmtIdArr = await db('appointments')
            .insert({doctor_id: drId, user_id: userId, wish_start_at: wish_start_at, wish_end_at: wish_end_at, status: constants.DEFAULT_APPOINTMENT_STATUS})
            .returning("id");

            if (newApmtIdArr.length === 0){
                return res.json(result);
            }

        result.success = true;
        result.msg = "New appointment booked!";

        const newApmtSavedArr = await db("appointments")
        .innerJoin('users', 'users.id', 'appointments.user_id')
        .select("users.firstname", "users.lastname", "appointments.id", "appointments.doctor_id", "appointments.status", "appointments.wish_start_at", "appointments.wish_end_at", "appointments.user_id")
        .where({"appointments.id": newApmtIdArr[0]});
        
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
user_id: 345 }
]
*/
        result.newApmtSaved = shapeBookedSlots(newApmtSavedArr, userId, false)[0];
/* 
{
                id: 445,
                title: "My appointment",
                start: 2018-10-11T16:35:00.000Z,
                end: 2018-10-11T16:40:00.000Z,
                type: 123,
                isMine: true,
                firstname: "Joe",
                lastname: "Doe"
            }
 */
    } catch (e) {
        addLog(userId, e, `${req.method} ${req.originalUrl} in helpers/post_createAppt.js`);
    }

    return res.json(result);
}