var express = require('express'),
    router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const moment = require("moment")

const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js");

router.get("/index", helpers.requireAdmin, async(req, res) => {
    let logs = [];
    
    try {
        logs = await db("log")
            .orderBy('time', 'desc')
            .limit(50);

        for (const log of logs) {
            log.humanTime = moment(log.time).format('MMM D, YYYY k:mm');
        }    

    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
        logs.push("500 bad...");
    }
    
    res.json(logs);
})

router.post("/create", (req, res) => {
    const currentUserId = req.isAuthenticated()
        ? req.session.passport.user
        : null;

    try {

        /* message type expected: string. Any object type should be have been converted on client before reaching here */
        const {message, notes} = req.body;

        const notesToLog = typeof notes === "string"
            ? "frontend error: " + notes
            : "from frontend";

        addLog(currentUserId, message, notesToLog);
    } catch (e) {
        addLog(currentUserId, e, "/log/create errored");
    }

    res.end();
})

module.exports = router