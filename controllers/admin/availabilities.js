var express = require('express'),
  router = express.Router();
const db = require("../../db/knex");
const helpers = require("../../helpers");
const constants = require("../../config/constants");
const moment = require("moment");

router.get('/:id', helpers.findDrId, function (req, res) {
  db("availabilities")
  .where({doctor_id: req.params.id})
  .whereBetween("start_at", [moment().toDate(), moment().add("28", "days").toDate()])
    .then((openSlots) => {

      let arrOut = [];
      
      for (let slot of openSlots){
        arrOut.push({
          'title': "Dr works during this time slot",
          'start': slot.start_at,
          'end': slot.end_at
        });
      }
      
      return res.json(arrOut);
    })
    .catch((err) => {
      console.log(err)
    })

});

router.post('/create', helpers.requireAdmin, function (req, res) {
  helpers.footprint(44 + " admin");
  console.log("req.params >>", req.params)
  
  db("availabilities")
    // .where({doctor_id: req.body.doctor_id, user_id: req.session.passport.user, wish_start_at: req.body.wish_start_at, wish_end_at: req.body.wish_end_at, status: constants.DEFAULT_APPOINTMENT_STATUS}) //TODO: write real one
    .where("id", "<", 0)
    .then((existingOpenSlots) => {
      // console.log("existingApms >>>", existingApms);
      // if (existingApms.length > 0) {
      //   res.json({success: false, msg: "Sorry, you can only book 1 appointment per day."});
      //   res.end();
      //   return false;
      // }

      //TODO: check if existingOpenSlots overlap any with the to-be new slot
      return true;
    })
    .then((shouldContinue) => {
      if (!shouldContinue){   
        console.log("should NOT Continue becuz" >> shouldContinue);
      return; }

      db("doctors").where({
        url_name: req.body.drUrlName
      })
      .select('id')
      .then((drIds) => {
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
  
        db('availabilities')
          .insert({
            doctor_id : drId,
            start_at : req.body.start_at,
            end_at : req.body.end_at,
        })
          .then((x) => {
            res.json({
              success: true,
              msg: "New open slot added!"
            })
          })
      })

    })
    .catch((err) => {
      console.log(err)
    })

});

module.exports = router