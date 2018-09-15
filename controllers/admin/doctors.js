var express = require('express'),
    router = express.Router();
const db = require("../../db/knex");
const rootRequire = require.main.require;
const helpers = rootRequire("./helpers");

router.get("/", helpers.requireAdmin, (req, res) => {
    db('doctors')
        .join('users', 'doctors.user_id', 'users.id')
        .select('users.firstname', 'users.lastname', 'doctors.id', 'doctors.is_public')
        .then((drs) => {
            res.json(drs);
        })
        .catch((err) => {
            console.log(err)
        })
})

module.exports = router