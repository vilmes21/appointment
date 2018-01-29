var express = require('express'),
  router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");
const moment = require("moment");

router.get('/:id', helpers.findDrId, function (req, res) {

  /*
  logic:
  -fetch all dr availabilities slots, simplify them: 1-3, 3-5 becomes 1-5
  -reverse grey out all non-available hours
  -fetch all appointments booked
  -return array collection of objects, including all non-available slots + booked appms
  */

  const nowDate = new Date();
  const twoWeeksLater = moment().add("14", "days").toDate();

  console.log("inside GET/:id for non-admin ava controller");

  db("availabilities")
  .where({doctor_id: req.params.id})
  .whereBetween("start_at", [nowDate, twoWeeksLater])
  .then((availables) => {

    if (availables.length === 0){
      res.json([]);
      return Promise.reject("0 doctor avaiablities here. Not to mention patients' bookings. Halt.");
    }

    const collect = [];

    for (const ava of availables){
        collect.push(ava.start_at);
        collect.push(ava.end_at);
    }

    let cleaned = helpers.keepUniqueElems(collect);

    // res.json({
    //   beforeClean: collect,
    //   afterClean: cleaned
    // });
    // return Promise.reject(333);

    const cleanedCount = cleaned.length;
    if (cleanedCount % 2 !== 0) { //i.e if count is odd, then db has bad data
      return Promise.reject("db has bad data. Count is odd; expected even.");
    }

    const collectByDay = {};
    
    for (let j = 0; j < cleanedCount; j++){
      const date = new Date(cleaned[j]);
      const str = date.toDateString();
      if (collectByDay[str]){
        collectByDay[str].push(date);
      } else {
        collectByDay[str] = [];
      }
    }

    for (let drDay in collectByDay){
      collectByDay[drDay].sort(function(a, b){
        return a-b;
      });

      const lastMidNight = moment(drDay).startOf('day').toDate();
      const thisMidNight = moment(drDay).endOf('day').toDate();

      collectByDay[drDay].unshift(lastMidNight);
      collectByDay[drDay].push(thisMidNight);
    }

    // res.json(collectByDay);
    // return Promise.reject("testing1");

    //cleaned looks like [1, 4, 5, 9] meaning 1-4, 5-9 avaialble. If add 2 elems to make it [last-mid-night, 1, 4, 5, 9, this-mid-night]

    const unavailables = [];
    const unavailable = {
      title : "Dr does NOT work now",
      type : constants.slotType.outOfOffice
    };

    for (let drDay in collectByDay){
      const eachDayArr = collectByDay[drDay];
      const eachDayArrCount = eachDayArr.length;
      
      for (let i = 0; i < eachDayArrCount; i++){
        if (i % 2 === 0){ //ie. even index, then be start_at
          unavailable.start = eachDayArr[i];
        } else { //ie. odd index, then be end_at
          unavailable.end = eachDayArr[i];
          unavailables.push(unavailable);
        }
      }
    }

    return unavailables;
    
  })
  .then((unavailables) => {

    db("appointments")
    .where({doctor_id: req.params.id})
    .whereBetween("wish_start_at", [nowDate, twoWeeksLater])
      .then((booked) => {
  
        let cleanBooked = [];
        
        for (let apmt of booked){
          const isMine = apmt.user_id === req.session.passport.user;
  
          let title = "";
          if (isMine) {title = "My appm here"}
          
          cleanBooked.push({
            'title': title,
            'start': apmt.wish_start_at,
            'end': apmt.wish_end_at,
            type: constants.slotType.outOfOffice,
            // 'patient': apmt.user_id,
            isMine: isMine
          });
        }
  
        const allBadSlots = unavailables.concat(cleanBooked);
        
        return res.json(allBadSlots);
      })
      .catch((err) => {
        console.log(err)
      })
  })
  .catch((err) => {
    console.log(err)
  })
  
});

module.exports = router