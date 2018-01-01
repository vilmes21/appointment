var express = require('express'),
    router = express.Router();
const db = require("../../db/knex");

router.get('/foo', function (req, res) {
    res.send("this is admin/index/foo content");

});

router.use("/nest1", require("./users"))

module.exports = router