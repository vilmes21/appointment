var express = require('express'),
    router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");

const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");

router.get("/index", helpers.requireAdmin, async(req, res) => {
    const logs = await db("log")
        .orderBy('time', 'desc')
        .limit(50);

    res.json(logs);
})

router.post("/create", async(req, res) => {
    const currentUserId = req.isAuthenticated()
        ? req.session.passport.user
        : null;

    const {message, notes} = req.body;
    
    const messageToLog = typeof message === "string"
        ? message
        : message.toString();
        
    const notesToLog = typeof notes === "string"? "frontend error: " + notes : "from frontend";

    await addLog(currentUserId, messageToLog, notesToLog);

    res.end();
})

module.exports = router