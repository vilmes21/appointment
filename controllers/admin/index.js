var express = require('express'),
    router = express.Router();
const db = require("../../db/knex");
const helpers = require("../../helpers");

router.get('/foo', function (req, res) {
    res.send("this is admin/index/foo content");

});

// router.use("/nest1", require("./users"))

router.get("/doctors", helpers.requireAdmin, (req, res) => {
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

router.use("/availabilities", require("./availabilities"))

module.exports = router