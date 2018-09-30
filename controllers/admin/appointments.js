var express = require('express'),
    router = express.Router();
const db = require("../../db/knex");
const helpers = require("../../helpers");
const constants = require("../../config/constants");
const moment = require("moment");
import isTimeAgo from "../../helpers/isTimeAgo";

// url: /admin/appointments/wang
router.get('/:id', helpers.requireAdmin, helpers.findDrId, function (req, res) {
    db("appointments")
        .join('users', 'appointments.user_id', 'users.id')
        .select('users.firstname', 'users.lastname', 'appointments.wish_start_at', 'appointments.wish_end_at', 'appointments.id')
        .where({doctor_id: req.params.id, status: constants.APPOINTMENT_STATUS_BOOKED})
        .whereBetween("wish_start_at", [
            moment().toDate(),
            moment()
                .add("28", "days")
                .toDate()
        ])
        .then((booked) => {

            const out = [];

            for (let i = 0; i < booked.length; i++) {
                const apm = {
                    start: booked[i].wish_start_at,
                    end: booked[i].wish_end_at,
                    title: booked[i].firstname + " " + booked[i].lastname,
                    id: booked[i].id
                };
                out.push(Object.assign({}, apm));
            }

            return res.json(out);
        })
        .catch((err) => {
            console.log(err)
        })

});

router.post("/cancel", helpers.requireAdmin, async(req, res) => {

  console.log("isTimeAgo requie???", isTimeAgo, "8*****************")
  
    try {

        const {ids} = req.body; //[3,6,7]

        console.log("BE post /cancel. ids >>> ", ids)

        //https://stackoverflow.com/questions/39598051/array-not-being-passed-to-query-i
        // n-knex in reality, need to check if time has past. If ok, then cancel. If not,
        // don't proceed and specify reason.

        const wantToCancel = await db("appointments").whereIn("id", ids);
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

        const toReturn = {
            success: cancellableIds,
            fail: unCancellableIds
        };

        if (unCancellableIds.length > 0) {
            toReturn.msg = `Cannot cancel ${unCancellableIds.length} appointments from the past.`;
        }

    } catch (e) {
      console.log("catch block of /admin/appt/cancel. e >>>", e)
    }

    res.json(toReturn);

})

module.exports = router