var express = require('express'),
  router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");
const moment = require("moment");
import getUnavailabilities from '../helpers/getUnavailabilities'
//====================================================================================

router.get('/:id', helpers.fakeLogin, helpers.requireLogin, helpers.findDrId, getUnavailabilities);

module.exports = router