var express = require('express'),
    router = express.Router();
const db = require("../../db/knex");
const helpers = require("../../helpers");
const constants = require("../../config/constants");
const moment = require("moment");
// import isTimeAgo from "../../helpers/isTimeAgo";

const rootRequire = require.main.require;
const isTimeAgo = rootRequire("./helpers/isTimeAgo");
const addLog = rootRequire("./helpers/addLog");
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js")

// url: /admin/appointments/wang
router.get('/:id', helpers.requireAdmin, helpers.findDrId, async(req, res) => {
    const out = [];
    const {id} = req.params;

    try {
        const booked = await db("appointments")
            .join('users', 'appointments.user_id', 'users.id')
            .select('users.firstname', 'users.lastname', 'appointments.wish_start_at', 'appointments.wish_end_at', 'appointments.id')
            .where({doctor_id: id, status: constants.APPOINTMENT_STATUS_BOOKED})
            .whereBetween("wish_start_at", [
                moment().toDate(),
                moment()
                    .add("28", "days")
                    .toDate()
            ]);

        for (let i = 0; i < booked.length; i++) {
            const apm = {
                start: booked[i].wish_start_at,
                end: booked[i].wish_end_at,
                title: booked[i].firstname + " " + booked[i].lastname,
                id: booked[i].id
            };
            out.push(Object.assign({}, apm));
        }

    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
    }
    return res.json(out);

});

router.post("/cancel", helpers.requireAdmin, async(req, res) => {

    let toReturn = {
        success: []
    };

    try {
        const {ids} = req.body; //[3,6,7]

        if (!Array.isArray(ids)) {
            return res.json(toReturn);
        }

        console.log("BE admin-side post /cancel. ids >>> ", ids)

        // https://stackoverflow.com/questions/39598051/array-not-being-passed-to-query-
        // i n-knex in reality, need to check if time has past. If ok, then cancel. If
        // not, don't proceed and specify reason.

        const wantToCancel = await db("appointments")
            .whereIn("id", ids)
        .andWhereNot("status", constants.APPOINTMENT_STATUS_CANCELLED)
            .select("id", "wish_start_at", "wish_end_at");

            if (!Array.isArray(wantToCancel) || wantToCancel.length === 0){
                toReturn.msg = `Appointment(s) not found or already cancelled`;
                return res.json(toReturn);
            }
            
        const cancellableIds = [];
        const unCancellableIds = [];

        for (const appt of wantToCancel) {
            const {id, end} = appt;
            const spanInMinute = 60;
            if (isTimeAgo(end, spanInMinute)) {
                unCancellableIds.push(id);
            } else {
                cancellableIds.push(id);
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