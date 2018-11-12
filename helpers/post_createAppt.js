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

const buildNewApmtSavedForFrontend = async (userId, isAdmin) => {
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
    return shapeBookedSlots(newApmtSavedArr, userId, false)[0];
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
}

/*
([{start_at: string, end_at: string}], stringISO, stringISO) => bool
 */
const isSlotOpen = (badHrArr, wish_start_at, wish_end_at) => {
    /*
    LOGIC:
    -for every `bad` slot, if
     */

    const wish_start_at_DATE = new Date(wish_start_at);
    const wish_end_at_DATE = new Date(wish_end_at);

    for (const bad of badHrArr) {
        const badStart_DATE = new Date(bad.start_at);
        const badEnd_DATE = new Date(bad.end_at);

        //if not "proposed-slot is entirely before current bad-slot"
        if (!(wish_start_at_DATE < badStart_DATE && wish_end_at_DATE <= badStart_DATE)) {
            return false;

            //if not "proposed-slot is entirely after current bad-slot"
        } else if (!(wish_start_at_DATE >= badEnd_DATE)) {
            return false
        }
    }

    return true;
}

const isProposedSlotStillOpen = async (wish_start_at, wish_end_at, drId) => {
    const dayMorning = getLastMidnight(wish_start_at);
    const dayEve = getLastMidnight(wish_end_at);

    let drBookedThatDay = await db("appointments")
        .where({doctor_id: drId, status: constants.APPOINTMENT_STATUS_BOOKED})
        .andWhere("wish_start_at", ">=", dayMorning)
        .andWhere("wish_end_at", "<=", dayEve);

    // TODO: maybe in the future no need to query all those records for the whole
    // day. Maybe just 2 hours after the `want.end_at`.

    if (drBookedThatDay.length > 0) {
        if (!isSlotOpen(drBookedThatDay, wish_start_at, wish_end_at)) {
            return false;
        }
    }
    return true;
}

/*
([{start_at: string, end_at: string}], stringISO, stringISO) => bool
 */
const isDuringDrHour = (goodHrArr, wish_start_at, wish_end_at) => {
    const wish_start_at_DATE = new Date(wish_start_at);
    const wish_end_at_DATE = new Date(wish_end_at);

    for (const good of goodHrArr) {
        const goodStart_DATE = new Date(good.start_at);
        const goodEnd_DATE = new Date(good.end_at);

        if (wish_start_at_DATE >= goodStart_DATE && wish_end_at_DATE <= goodEnd_DATE) {
            return true;
        }
    }
    return false;
}

const isProposalDuringDrWorkHours = async (wish_start_at, wish_end_at, drId) => {

    const dayMorning = getLastMidnight(wish_start_at);
    const dayEve = getLastMidnight(wish_end_at);

    let drHoursThatDay = await db("availabilities")
        .where({doctor_id: drId})
        .andWhere("start_at", ">=", dayMorning)
        .andWhere("end_at", "<=", dayEve);

    if (drHoursThatDay.length === 0) {
        return false;
    }

    if (!isDuringDrHour(drHoursThatDay, wish_start_at, wish_end_at)) {
        return false;
    }

    return true;
}

const areStartEndParamsValid = (wish_start_at, wish_end_at) => {

    if (!(typeof wish_start_at === "string" && wish_start_at) || !(typeof wish_end_at === "string" && wish_end_at)) {
        return false;
    }


    const momentWishStart = new Date(wish_start_at);
    const momentWishEnd = new Date(wish_end_at);

    if (momentWishStart > momentWishEnd) {
        return false;
    }



    if (momentWishEnd < new Date()) {
        return false;
    }



    return true;
}

const isAtDailyMax = async (userId, wish_start_at, wish_end_at) => {
    const dayMorning = getLastMidnight(wish_start_at);
    const dayEve = getLastMidnight(wish_end_at);

    const userAppmtsThatDay = await db("appointments")
        .where({user_id: userId, status: constants.APPOINTMENT_STATUS_BOOKED})
        .andWhere("wish_start_at", ">=", dayMorning)
        .andWhere("wish_end_at", "<=", dayEve);

        // console.log(`userAppmtsThatDay.length (${userAppmtsThatDay.length}) >= constants.MAX_APPTS_PER_DAY (${constants.MAX_APPTS_PER_DAY})`, "of type: ", typeof constants.MAX_APPTS_PER_DAY)
        
    if (userAppmtsThatDay.length >= constants.MAX_APPTS_PER_DAY) {
        return true;
    }

    return false;
}

const getDoctorFromDB = async (drUrlName) => {
    const lowerCaseDrUrlName = toLowerCaseOrUndefined(drUrlName);
    if (!lowerCaseDrUrlName) {
        return false;
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

    const doctorObj = doctors.find(obj => toLowerCaseOrUndefined(obj.url_name) === lowerCaseDrUrlName);
    return doctorObj;
}

export default async(req, res) => {
    /*
    LOGIC:
    1. validate parameters
    2.
     */

    let result = {
        success: false,
        msg: ""
    };

    const userId = getUserIdByReq(req);

    try {
        const {wish_start_at, wish_end_at} = req.body;

        if (!areStartEndParamsValid(wish_start_at, wish_end_at)) {
            result.msg = "Bad start or end time";
            return res.json(result);
        }

        const want = {
            start_at: new Date(req.body.wish_start_at),
            end_at: new Date(req.body.wish_end_at)
        }

        if (await isAtDailyMax(userId, wish_start_at, wish_end_at)) {
            result.msg = `Daily max bookings (${constants.MAX_APPTS_PER_DAY}) reached`;
            return res.json(result);
        }

        const {drUrlName} = req.body;
        const doctorObj = await getDoctorFromDB(drUrlName);

        if (!doctorObj) {
            result.msg = "Failed to find doctor";
            return res.json(result);
        }

        const drId = doctorObj.id;

        if (!(await isProposalDuringDrWorkHours(wish_start_at, wish_end_at, drId))) {
            result.msg = "Doctor not working at that time";
            return res.json(result);
        }

        if (!(await isProposedSlotStillOpen(wish_start_at, wish_end_at, drId))) {
            result.msg = "Oooops... another user just booked that slot. Please refresh page and try again."

            return res.json(result);
        }

        const newApmtIdArr = await db('appointments')
            .insert({doctor_id: drId, user_id: userId, wish_start_at: wish_start_at, wish_end_at: wish_end_at, status: constants.DEFAULT_APPOINTMENT_STATUS})
            .returning("id");

        if (newApmtIdArr.length === 0) {
            result.msg = "Insertion failure."
            return res.json(result);
        }

        result.success = true;
        result.msg = "New appointment booked!";
        result.newApmtSaved = await buildNewApmtSavedForFrontend(userId, false);
    } catch (e) {
        addLog(userId, e, `${req.method} ${req.originalUrl} in helpers/post_createAppt.js`);
    }

    return res.json(result);
}