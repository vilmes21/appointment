var express = require('express'),
  router = express.Router();
const helpers = require("../helpers");
const rootRequire = require.main.require;
import getUnavailabilities from '../helpers/getUnavailabilities'
const addLog = rootRequire("./helpers/addLog");


router.get('/:id', helpers.findDrId, getUnavailabilities);

module.exports = router