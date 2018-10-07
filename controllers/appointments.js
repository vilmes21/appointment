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

router.post('/create', helpers.requireLogin, post_createAppt);

router.post('/cancel', helpers.requireLogin, async(req, res) => {

    let toReturn = {
        success: []
    };

    try {
        const currentUserId = getUserIdByReq(req);
        const {ids} = req.body; //[3,6,7]

        if (!Array.isArray(ids)) {
            return res.json(toReturn);
        }

        console.log("BE user-side post /cancel. ids >>> ", ids)

        const wantToCancel = await db("appointments")
            .whereIn("id", ids)
            .select("id", "wish_start_at", "wish_end_at", "user_id");
        const cancellableIds = [];
        const unCancellableIds = [];

        for (const appt of wantToCancel) {
            const {id, end} = appt;
            const spanInMinute = 60;

            if (appt.user_id !== currentUserId) {
                unCancellableIds.push(id);
            } else {

                //`* -1` means within `now() + spanInMinute` in near future
                if (isTimeAgo(start, spanInMinute * -1)) {
                    unCancellableIds.push(id);
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
            toReturn.msg = `Cannot cancel ${unCancellableIds.length} appointments from the past.`;
        }

    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
        toReturn.msg = `Cancellation failed`;
    }

    res.json(toReturn);
})

module.exports = router