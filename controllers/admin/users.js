var express = require('express'),
    router = express.Router();
const db = require("../../db/knex");

router.get('/bar', function (req, res) {
    res.send("this is admin/user/bar content");
});

module.exports = router