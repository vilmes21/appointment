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

      db("doctors").where({
        url_name: req.body.drUrlName //TODO: change into new column
      })
      .select('id')
      .then((drIds) => {
        console.log("drIds with that urlname (should be only 1 if db set up good) >>>", drIds);
        if (drIds.length !== 1){
          console.log("DB PROBLEM! drIds.length !== 1 >>>", drIds.length !== 1);
          return -1;
        }
        return drIds[0].id;
      })
      .then((drId) => {
        if (drId === -1){   
          return; 
      }
  
      console.log("now in another block, drId >>>", drId);
  
        db('appointments')
          .insert({
            doctor_id : drId,
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

    })
    .catch((err) => {
      console.log(err)
    })

});

module.exports = router