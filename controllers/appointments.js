var express = require('express'),
  router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");
const moment = require("moment");
const rootRequire = require.main.require;

// const post_createAppt = rootRequire("./helpers/post_createAppt")
import post_createAppt from '../helpers/post_createAppt'

router.post('/create', helpers.requireLogin, post_createAppt);

router.post('/cancel/:id', helpers.requireLogin, function (req, res) {
  helpers.footprint(33);
  console.log("cancel id>>", req.params.id);
  
  return res.json({
    success: true,
    msg: "testingfake cancel"
  })
})

module.exports = router