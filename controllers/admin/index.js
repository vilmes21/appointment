var express = require('express'),
    router = express.Router();

const rootRequire = require.main.require;
const helpers = rootRequire("./helpers");
const db = require("../../db/knex");

router.use("/doctors", require("./doctors"))
router.use("/availabilities", require("./availabilities"))
router.use("/appointments", require("./appointments"))

module.exports = router