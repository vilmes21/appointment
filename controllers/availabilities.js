var express = require('express'),
  router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");
const moment = require("moment");

router.get('/:id', function (req, res) {
  db("appointments")
  .where({doctor_id: 211}) //TODO: parse and get doc id later
  .whereBetween("wish_start_at", [moment().toDate(), moment().add("14", "days").toDate()])
    .then((bookedOnes) => {
      console.log("bookedOnes >>>", bookedOnes, " of type>>>", typeof(bookedOnes));
      return true
    })
    .catch((err) => {
      console.log(err)
    })

});

module.exports = router