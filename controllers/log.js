var express = require('express'),
    router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");

const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");

router.get("/index", helpers.requireAdmin, async(req, res) => {
    try {
        const logs = await db("log")
            .orderBy('time', 'desc')
            .limit(50);

        res.json(logs);
    } catch (e) {
        addLog(null, e, "/log/index GET")
        res.json("500 BAD...");
    }
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