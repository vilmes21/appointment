var express = require('express'),
    router = express.Router();
const db = require("../../db/knex");
const helpers = require("../../helpers");
const constants = require("../../config/constants");
const moment = require("moment");
const rootRequire = require.main.require;

const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js")

// url: /admin/availablity/wang
router.get('/:id', helpers.findDrId, async function (req, res) {
    try {
        const openSlots = await db("availabilities")
            .where({doctor_id: req.params.id})
            .whereBetween("start_at", [
                moment().toDate(),
                moment()
                    .add("28", "days")
                    .toDate()
            ]);

        // openSlots are like: [{start_at: 3, end_at: 5}, {start_at: 5, end_at: 6},
        // {start_at: 7, end_at: 9}] so should simply the overlapping parts such as 5.

        const collect = [];

        for (const slot of openSlots) {
            collect.push(slot.start_at.toISOString());
            collect.push(slot.end_at.toISOString());
        }

        let cleaned = helpers.keepUniqueElems(collect);

        const cleanedCount = cleaned.length;
        if (cleanedCount % 2 !== 0) { //i.e if count is odd, then db has bad data
            return Promise.reject("db has bad data. Count is odd; expected even.");
        }

        const cleanedDates = [];
        for (let c of cleaned) {
            cleanedDates.push(new Date(c));
        }

        cleaned = cleanedDates.sort((a, b) => {
            return a - b;
        })

        const arrOut = [];
        const cleanSlot = {};
        cleanSlot.title = "Dr works now";

        for (let i = 0; i < cleanedCount; i++) {
            if (i % 2 === 0) { //ie. even index, then be start_at
                cleanSlot.start = cleaned[i];
            } else { //ie. odd index, then be end_at
                cleanSlot.end = cleaned[i];
                const cloneForPush = Object.assign({}, cleanSlot);
                arrOut.push(cloneForPush);
            }
        }

        return res.json(arrOut);
    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
    }

});

router.post('/create', helpers.requireAdmin, async function (req, res) {
    /*
  logic:
  -if doctor doesn't exist, halt
  -if propose past, halt
  -if propose spanning > one day, halt
  -fetch all already existing slots of that day
  -loop the slots, if new propose start or end in between any existing slots, halt
  -insert
  */

    let result = {
        success: false,
        msg: ""
    }

    try {
        const drIdInt = helpers.findDrIdByUrlName(req.body.drUrlName);
        if (drIdInt === undefined) {
            result.msg = "dr doesn;t exist";
            console.log(result.msg);
            return res.json(result);
        }

        let want = req.body;
        want.start_at = new Date(want.start_at);
        want.end_at = new Date(want.end_at);

        if (helpers.isSlotInPast(want)) {
            console.log("cannot things in the past");
            result.msg = "cannot things in the past";
            return res.json(result);
        }

        if (!helpers.isWithinOneDay(want)) {
            result.msg = "spanning over > 1 day. halt early";
            console.log(result.msg);
            return res.json(result);
        }

        const beginningOfWantedDay = moment(want.start_at).startOf('day');
        const endOfWantedDay = moment(want.end_at).endOf('day');

        const existingOpenSlots = await db("availabilities")
        // .where({doctor_id: req.body.doctor_id, user_id: req.session.passport.user,
        // wish_start_at: req.body.wish_start_at, wish_end_at: req.body.wish_end_at,
        // status: constants.DEFAULT_APPOINTMENT_STATUS}) //TODO: write real one
            .where({doctor_id: drIdInt})
            .andWhere("start_at", ">=", beginningOfWantedDay)
            .andWhere("end_at", "<=", endOfWantedDay);

        if (helpers.isSlotOpen(existingOpenSlots, want)) {
            return true;
        }

        result.msg = "proposed time slot overlaps with other slots, please be careful";
        res.json(result);
        return Promise.reject(result.msg);

        await db('availabilities').insert({doctor_id: drIdInt, start_at: want.start_at, end_at: want.end_at});

        result.success = true;
        result.msg = "New open slot added yow!";

    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
    }

    res.json(result);
});

module.exports = router