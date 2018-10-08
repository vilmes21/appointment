var express = require('express'),
    router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");
const moment = require("moment");
const rootRequire = require.main.require;
const getUserIdByReq = rootRequire("./helpers/getUserIdByReq.js")
// const post_createAppt = rootRequire("./helpers/post_createAppt")
import post_createAppt from '../helpers/post_createAppt'
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js")
const addLog = rootRequire("./helpers/addLog");
const isTimeAgo = rootRequire("./helpers/isTimeAgo");
const isNearlyOrPastTime = rootRequire("./helpers/isNearlyOrPastTime");

//test method to be removed OR at least admin-only
router.get('/index/:id', async(req, res) => {
    let booked = [];
    try {
        const now = new Date();
        const twoWeeksLater = moment().add(constants.USER_PREVIEW_DAYS.toString(), "days").toDate();

        booked = await db("appointments")
            .innerJoin('users', 'users.id', 'appointments.user_id')
            .select("users.firstname", "users.lastname", "appointments.id", "appointments.doctor_id", "appointments.status", "appointments.wish_start_at", "appointments.wish_end_at", "appointments.user_id")
            .where({doctor_id: req.params.id, status: constants.APPOINTMENT_STATUS_BOOKED})
            .whereBetween("wish_start_at", [now, twoWeeksLater]);
    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
    }
    return res.json(booked);

    /* shape:
    
    [
  {
    "firstname": "Jack",
    "lastname": "Smithe",
    "id": 247,
    "doctor_id": 205,
    "status": 304,
    "wish_start_at": "2018-10-10T16:20:00.000Z",
    "wish_end_at": "2018-10-10T16:25:00.000Z",
    "user_id": 345
  },
  {
    "firstname": "Jack",
    "lastname": "Smithe",
    "id": 246,
    "doctor_id": 205,
    "status": 304,
    "wish_start_at": "2018-10-11T16:50:00.000Z",
    "wish_end_at": "2018-10-11T16:55:00.000Z",
    "user_id": 345
  }
]
  */
    
})

router.post('/create', helpers.requireLogin, post_createAppt);

router.post('/cancel', helpers.requireLogin, async(req, res) => {

    console.log("JUST ENTERED user-side post /cancel.  ")

    let toReturn = {
        success: []
    };

    try {
        const {ids} = req.body; //[3,6,7]
        console.log("BE user-side post /cancel. ids >>> ", ids)
        
        
        if (!Array.isArray(ids)) {
            return res.json(toReturn);
        }
        
        const wantToCancel = await db("appointments")
        .whereIn("id", ids)
        .andWhereNot("status", constants.APPOINTMENT_STATUS_CANCELLED)
        .select("id", "wish_start_at", "wish_end_at", "user_id");

        /* 
        [ {
    id: 242,
    wish_start_at: 2018-10-09T16:40:00.000Z,
    wish_end_at: 2018-10-09T16:45:00.000Z,
    user_id: 345 } ]
         */

        if (!Array.isArray(wantToCancel) || wantToCancel.length === 0){
            toReturn.msg = `Appointment not found or already cancelled`;
            return res.json(toReturn);
        }
        
        const cancellableIds = [];
        const unCancellableIds = [];
        const _msgs = [];
        
        const currentUserId = getUserIdByReq(req);
        for (const appt of wantToCancel) {
            const {id, wish_start_at} = appt;
            const spanInMinute = 60;

            if (appt.user_id !== currentUserId) {
                unCancellableIds.push(id);
                _msgs.push("It is not your appointment.")
            } else {
                if (isNearlyOrPastTime(wish_start_at, spanInMinute)) {
                    unCancellableIds.push(id);
                    _msgs.push("Too late to cancel.")
                } else {
                    cancellableIds.push(id);
                }
            }
        }

        await db("appointments")
            .whereIn("id", cancellableIds)
            .update({status: constants.APPOINTMENT_STATUS_CANCELLED});

        toReturn = {
            success: cancellableIds,
            fail: unCancellableIds
        };

        if (unCancellableIds.length > 0) {
            toReturn.msg = `Cannot cancel ${unCancellableIds.length} appointment(s). ` + _msgs.join(" ");
        }

    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
        toReturn.msg = `Cancellation failed`;
    }

    console.log("44444 toReturn >>", toReturn)
    
    res.json(toReturn);
})

module.exports = router