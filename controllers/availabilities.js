var express = require('express'),
  router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");
const moment = require("moment");

findDrId = (req, res, next) => {
  console.log("req.params.id >>>", req.params.id, "of type >>>", typeof(req.params.id));
  console.log("parseInt(req.params.id) >>>", parseInt(req.params.id), "of type >>>", typeof(parseInt(req.params.id)));
  
  if (req.params.id == parseInt(req.params.id)) {// then it's int already
    helpers.footprint(33);
    console.log("YES, req.params.id == parseInt(req.params.id)")
    next();
    return;
  }

  const drs = { //TODO: go into db grab and then cache in session
    Hermann: 205,
    A_last: 211,
    B_last: 212,
    Wang: 210
  };

  if (!drs[req.params.id]){
    res.json("yow bad url, no such dr");
    return;
    // res.end();
  }

  console.log("parsed Dr id from fake obj, next to >>>", drs[req.params.id]);
  
  req.params.id= drs[req.params.id];
  next();
}

router.get('/:id', findDrId, function (req, res) {
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