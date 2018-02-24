var express = require('express'),
  router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");
const moment = require("moment");

//====================================================================================

router.post('/create', helpers.requireLogin, function (req, res) {
  helpers.footprint(44);
  console.log("req.params >>", req.params)

  let result = {
    success: false,
    msg: ""
  };

  const want = {
    start_at: new Date(req.body.wish_start_at),
    end_at: new Date(req.body.wish_end_at)
  }

  const beginningOfWantedDay = moment(want.start_at).startOf('day');
  const endOfWantedDay = moment(want.end_at).endOf('day');

  if (helpers.isSlotInPast(want)){
    result.msg = "Cannot time travel..."

    res.json(result);
    return;
  }
  
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

      if (false){
        return Promise.reject("halt early");
      }
    })
    .then(() => {
      
      db("doctors").where({
        url_name: req.body.drUrlName
      })
      .select('id')
      .then((drIds) => {
        console.log("drIds with that urlname (should be only 1 if db set up good) >>>", drIds);
        if (drIds.length !== 1){
          return Promise.reject("halt early for DB PROBLEM! drIds.length");
        }
        return drIds[0].id;
      })
      .then((drId) => {
      //BEGIN check slot proposed in within the dr's hours

      db("availabilities")
      .where({ doctor_id: drId })
      .andWhere("start_at", ">=", beginningOfWantedDay)
      .andWhere("end_at", "<=", endOfWantedDay)
      .then((drHoursThatDay) => {
        if (drHoursThatDay.length === 0){
          result.msg = "Doctor does not work on that day."

          res.json(result);
          return Promise.reject("halt early Doctor does not work on that day.");
        }

        drHoursThatDay = helpers.turnStringToDate(drHoursThatDay); //TODO: make sure the initial obj actually uses string as datetimes. If it already is instances of Date(), then no need this.

        if (!helpers.isDuringDrHour(drHoursThatDay, want)){
          result.msg = "Your appointment must be during the doctor's office hours."

          res.json(result);
          return Promise.reject("halt early");
        }
      })

      //END check slot proposed in within the dr's hours
      
      .then(() => {
        //BEGIN see if other users already booked slot

        db("appointments")
        .where({
          doctor_id: drId,
          status: constants.APPOINTMENT_STATUS_BOOKED
        })
        .andWhere("start_at", ">=", beginningOfWantedDay) //TODO: maybe in the future no need to query all those records for the whole day. Maybe just 2 hours after the `want.end_at`.
        .andWhere("end_at", "<=", endOfWantedDay)
        .then((bookedThatDay) => {
          if (bookedThatDay.length > 0){
            bookedThatDay = helpers.turnStringToDate(bookedThatDay);

            if (!helpers.isSlotOpen(bookedThatDay, want)){
              result.msg = "Oooops... another use just booked that slot. Please refresh page and try again."
  
              res.json(result);
              return Promise.reject("halt early >>> Oooops... another use just booked that slot. Ple");
            }
          }
         
        })

        //END see if other users already booked slot
        
      })
      .then(() => {
        //BEGIN insert appointment

        db('appointments')
        .insert({
          doctor_id : drId,
          user_id : req.session.passport.user,
          wish_start_at : req.body.wish_start_at,
          wish_end_at : req.body.wish_end_at,
          status : constants.DEFAULT_APPOINTMENT_STATUS
      })
        .then((x) => {
          result.success = true;
          result.msg = "new appointment booked!";

          res.json(result)
        })

        //END insert appointment

      })
      })

    })
    .catch((err) => {
      console.log(err)
    })

});

module.exports = router