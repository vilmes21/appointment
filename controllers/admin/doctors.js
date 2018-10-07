var express = require('express'),
    router = express.Router();
const db = require("../../db/knex");
const rootRequire = require.main.require;
const helpers = rootRequire("./helpers");
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js")

router.get("/", helpers.requireAdmin, async(req, res) => {
    let drs = [];

    try {
        drs = await db('doctors')
            .join('users', 'doctors.user_id', 'users.id')
            .select('users.firstname', 'users.lastname', 'doctors.id', 'doctors.is_public');
    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
    }

    res.json(drs);
})

module.exports = router