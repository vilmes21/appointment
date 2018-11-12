var express = require('express'),
    router = express.Router();
const db = require("../../db/knex");
const helpers = require("../../helpers");
const constants = require("../../config/constants");
const moment = require("moment");
const rootRequire = require.main.require;

const addLog = rootRequire("./helpers/addLog");
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js")
const areInSameDay = rootRequire("./helpers/areInSameDay.js")
const findDrIdByUrlName = rootRequire("./helpers/findDrIdByUrlName.js")
const isThePast = rootRequire("./helpers/isThePast.js")
const isSlotOpen = rootRequire("./helpers/isSlotOpen.js")


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
        const {drUrlName, start_at, end_at} = req.body;

        if (!drUrlName || !start_at || !end_at){
            result.msg = "Data missing";
            return res.json(result);
        }
        
        const drIdInt = findDrIdByUrlName(drUrlName);
        if (!drIdInt) {
            result.msg = "dr does not exist";
            return res.json(result);
        }

        const start_at_DATE = new Date(start_at);
        const end_at_DATE = new Date(end_at);

        if (isThePast(end_at)) {
            result.msg = "Cannot travel to the past";
            return res.json(result);
        }

        if (!areInSameDay(start_at_DATE, end_at_DATE)) {
            result.msg = "spanning over > 1 day. halt early";
            return res.json(result);
        }

        const beginningOfWantedDay = moment(start_at).startOf('day').toJSON();
        const endOfWantedDay = moment(end_at).endOf('day').toJSON();

        const existingOpenSlots = await db("availabilities")
            .where({doctor_id: drIdInt})
            .andWhere("start_at", ">=", beginningOfWantedDay)
            .andWhere("end_at", "<=", endOfWantedDay);

        if (!isSlotOpen(existingOpenSlots, start_at_DATE, end_at_DATE)) {
            result.msg = "proposed time slot overlaps with other slots, please be careful";
            return res.json(result);
        }

        await db('availabilities').insert({doctor_id: drIdInt, start_at: start_at, end_at: end_at});

        result.success = true;
        result.msg = "New open slot added yow!";

    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
    }

    res.json(result);
});

module.exports = router