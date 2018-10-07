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

export default async(req, res) => {

    try {

        let result = {
            success: false,
            msg: ""
        };

        const {wish_start_at, wish_end_at} = req.body;

        if (!(wish_start_at && wish_start_at.length > 0) || !(wish_end_at && wish_end_at.length > 0)) {
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
            .where({user_id: req.session.passport.user, status: constants.APPOINTMENT_STATUS_BOOKED})
            .andWhere("wish_start_at", ">=", beginningOfWantedDay)
            .andWhere("wish_end_at", "<=", endOfWantedDay);

        if (userAppmtsThatDay.length >= constants.MAX_APPTS_PER_DAY) {
            result.msg = "Your daily max bookings reached";
            return res.json(result);
        }

        const doctors = await db("doctors")
            .where({is_public: true})
            .select("url_name", "id");

        console.log("Found doctors >>> ", doctors)
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
            result.msg = "Doctor out of office"
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

        //END see if other users already booked slot BEGIN insert appointment

        await db('appointments').insert({doctor_id: drId, user_id: req.session.passport.user, wish_start_at: req.body.wish_start_at, wish_end_at: req.body.wish_end_at, status: constants.DEFAULT_APPOINTMENT_STATUS});

        result.success = true;
        result.msg = "new appointment booked!";
        return res.json(result);
        //END insert appointment

    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
    }
}