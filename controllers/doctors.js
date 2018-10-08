var express = require('express'),
    router = express.Router();
const db = require("../db/knex");
const rootRequire = require.main.require;
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js")
const addLog = rootRequire("./helpers/addLog");

// const helpers = require("../helpers"); const constants =
// require("../config/constants"); const moment = require("moment");

router.get('/index', async function (req, res) {
    let drs = [];

    try {
        drs = await db('doctors')
            .join('users', 'doctors.user_id', 'users.id')
            .select('users.firstname', 'users.lastname', 'doctors.id', 'doctors.photo', 'doctors.bio', 'doctors.url_name');

    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl}`);
    }
    
    return res.json(drs);
});

module.exports = router