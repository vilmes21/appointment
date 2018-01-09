var express = require('express'),
  router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");
const moment = require("moment");

router.get('/:id', helpers.findDrId, function (req, res) {
  db("appointments")
  .where({doctor_id: req.params.id})
  .whereBetween("wish_start_at", [moment().toDate(), moment().add("14", "days").toDate()])
    .then((bookedOnes) => {
      console.log("bookedOnes >>>", bookedOnes, " of type>>>", typeof(bookedOnes));

      let arrOut = [];
      // for (let i = 0; i < bookedOnes.length; i++){
      for (let apmt of bookedOnes){
        const isMine = apmt.user_id === req.session.passport.user;

        let title = "";
        if (isMine) {title = "My appm here"}
        
        arrOut.push({
          'title': title,
          'start': apmt.wish_start_at,
          'end': apmt.wish_end_at,
          'patient': apmt.user_id,
          isMine: isMine
        });
      }
      
      return res.json(arrOut);
    })
    .catch((err) => {
      console.log(err)
    })

});

module.exports = router