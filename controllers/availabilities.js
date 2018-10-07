var express = require('express'),
  router = express.Router();
const helpers = require("../helpers");
const rootRequire = require.main.require;
import getUnavailabilities from '../helpers/getUnavailabilities'

router.get('/:id', helpers.findDrId, getUnavailabilities);

module.exports = router