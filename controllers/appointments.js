var express = require('express'),
  router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");

router.post('/create', helpers.requireLogin, function (req, res) {
  helpers.footprint(44);
  console.log("req.params >>", req.params)
  
  db("appointments")
    // .where({doctor_id: req.body.doctor_id, user_id: req.session.passport.user, wish_start_at: req.body.wish_start_at, wish_end_at: req.body.wish_end_at, status: constants.DEFAULT_APPOINTMENT_STATUS}) //TODO: write real one
    .where("id", "<", 0)
    .then((existingApms) => {
      // console.log("existingApms >>>", existingApms);
      // if (existingApms.length > 0) {
      //   res.json({success: false, msg: "Sorry, you can only book 1 appointment per day."});
      //   res.end();
      //   return false;
      // }
      return true;
    })
    .then((shouldContinue) => {
      if (!shouldContinue){   
        console.log("should NOT Continue becuz" >> shouldContinue);
      return; }

      db('appointments')
        .insert({
          doctor_id : req.body.doctor_id,
          user_id : req.session.passport.user,
          wish_start_at : req.body.wish_start_at,
          wish_end_at : req.body.wish_end_at,
          status : constants.DEFAULT_APPOINTMENT_STATUS
      })
        .then((x) => {
          res.json({
            success: true,
            msg: "Appointment Booked!"
          })
        })
    })
    .catch((err) => {
      console.log(err)
    })

});

module.exports = router