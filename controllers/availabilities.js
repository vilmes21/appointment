var express = require('express'),
  router = express.Router();
const helpers = require("../helpers");
import getUnavailabilities from '../helpers/getUnavailabilities'

router.get('/:id', helpers.findDrId, getUnavailabilities);

module.exports = router