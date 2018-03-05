var express = require('express'),
  router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");
const moment = require("moment");
//====================================================================================

router.get('/:id', helpers.requireLogin, helpers.findDrId, function (req, res) {

  /*
  logic:
  -fetch all dr availabilities slots, simplify them: 1-3, 3-5 becomes 1-5
  -reverse grey out all non-available hours
  -fetch all appointments booked
  -return array collection of objects, including all non-available slots + booked appms
  */

  const now = new Date();
  const twoWeeksLater = moment().add("14", "days").toDate();

  // console.log("inside GET/:id for non-admin ava controller. req.params.id >>> ", req.params.id);

  db("availabilities")
  .where({doctor_id: req.params.id})
  .whereBetween("start_at", [now, twoWeeksLater])
  .then((availables) => {

    // helpers.footprint(1)

    if (availables.length === 0){
      res.json([]);
      return Promise.reject("0 doctor avaiablities. Not to say patient bookings. Halt.");
    }

    const collect = [];

    for (const ava of availables){
        collect.push(ava.start_at);
        collect.push(ava.end_at);
    }

    // helpers.footprint(2)
    // console.log("collect >>> ", collect);
    /*
    collect >>>  [ 2018-03-04T22:30:00.000Z,
  2018-03-05T01:00:00.000Z,
  2018-03-05T20:30:00.000Z,
  2018-03-05T23:30:00.000Z ]
    */
    

    let cleaned = helpers.keepUniqueElems(collect);

    // console.log("cleaned >>> ", cleaned);
    
    /*
cleaned >>>  [ '2018-03-04T22:30:00.000Z',
  '2018-03-05T01:00:00.000Z',
  '2018-03-05T20:30:00.000Z',
  '2018-03-05T23:30:00.000Z' ]
    */
    

    // res.json({
    //   beforeClean: collect,
    //   afterClean: cleaned
    // });
    // return Promise.reject(333);

    const cleanedCount = cleaned.length;
    if (cleanedCount % 2 !== 0) { //i.e if count is odd, then db has bad data
      return Promise.reject("db has bad data. Count is odd; expected even.");
    }

    // helpers.footprint(3)
    

    const collectByDay = {};

    for (let i = 0; i < 15; i++){
      // const keyStr = moment().add(i.toString(), "days").toDate().toDateString();
      const keyStr = moment().add(i.toString(), "days").toDate().toDateString();
      collectByDay[keyStr] = [];
    }

    /* 
    after all initation. collectByDay>> { 'Sun Mar 04 2018': [],
  'Mon Mar 05 2018': [],
  'Tue Mar 06 2018': [],
  'Wed Mar 07 2018': [],
  'Thu Mar 08 2018': [],
  'Fri Mar 09 2018': [],
  'Sat Mar 10 2018': [],
  'Sun Mar 11 2018': [],
  'Mon Mar 12 2018': [],
  'Tue Mar 13 2018': [],
  'Wed Mar 14 2018': [],
  'Thu Mar 15 2018': [],
  'Fri Mar 16 2018': [],
  'Sat Mar 17 2018': [],
  'Sun Mar 18 2018': [] }
     */
    
    for (let j = 0; j < cleanedCount; j++){
      const date = new Date(cleaned[j]);
      const str = date.toDateString();
      /* 
      str >>>  Sun Mar 04 2018
str >>>  Sun Mar 04 2018
str >>>  Mon Mar 05 2018
str >>>  Mon Mar 05 2018
       */

       //all keys should be have initiated into [] already. So can just push to it.
      collectByDay[str].push(date);
       
       
      // if (collectByDay[str]){
      //   collectByDay[str].push(date);
      // } else {
      //   collectByDay[str] = [date];
      // }
    }

    // helpers.footprint(4)

    // console.log("collectByDay >>> ", collectByDay)
    /* 
collectByDay >>>  { 'Sun Feb 25 2018': 
   [ 2018-02-25T22:00:00.000Z,
     2018-02-25T22:30:00.000Z,
     2018-02-26T01:30:00.000Z,
     2018-02-26T02:00:00.000Z,
     2018-02-26T02:30:00.000Z ] }
    */

    for (let drDay in collectByDay){
      if (collectByDay[drDay].length > 0){
        collectByDay[drDay].sort(function(a, b){
          return a-b;
        });
      }

  //     console.log("Before insert top and bottom. collectByDay[drDay] human readable>>")
  // for (let b of collectByDay[drDay]){
  //   console.log("b.start.toString() >>", b.toString())
  // }
      
      // as suggested by https://stackoverflow.com/questions/43101278/how-to-handle-deprecation-warning-in-momentjs/43102805, sometimes , might need specify format
      // const lastMidNight = moment(drDay, moment.ISO_8601).startOf('day').toDate();
      const lastMidNight = moment(new Date(drDay)).startOf('day').toDate();
      const thisMidNight = moment(new Date(drDay)).endOf('day').toDate();

      // console.log("lastMidNight >>> ", lastMidNight)
      // console.log("thisMidNight >>> ", thisMidNight)
      /* lastMidNight >>>  2018-03-04T08:00:00.000Z
thisMidNight >>>  2018-03-05T07:59:59.999Z */
    // helpers.footprint(9)
      
      collectByDay[drDay].unshift(lastMidNight);
      collectByDay[drDay].push(thisMidNight);

      //console.log("collectByDay[drDay] >>> ", collectByDay[drDay])
      /* collectByDay[drDay] >>>  [ 2018-03-05T08:00:00.000Z,
  2018-03-05T23:30:00.000Z,
  2018-03-06T07:59:59.999Z ] */

  // console.log("collectByDay[drDay] human readable>>")
  // for (let b of collectByDay[drDay]){
  //   console.log("b.start.toString() >>", b.toString())
  //   console.log("b.end.toString()   >>", b.toString())
  // }

  // helpers.footprint(" a");

    }



    //cleaned looks like [1, 4, 5, 9] meaning 1-4, 5-9 avaialble. If add 2 elems to make it [last-mid-night, 1, 4, 5, 9, this-mid-night]

    // helpers.footprint(5)
    
    const unavailables = [];


    for (let drDay in collectByDay){
      const eachDayArr = collectByDay[drDay];
      const eachDayArrCount = eachDayArr.length;

      // console.log("PRE loop, eachDayArr >>> ", eachDayArr)

      const unavailable = {
        title : "Dr does NOT work now",
        type : constants.slotType.outOfOffice
      };

      for (let i = 0; i < eachDayArrCount; i++){        
        if (i % 2 === 0){ //ie. even index, then be start_at
          unavailable.start = eachDayArr[i];
          // console.log("unavailable in first if >>> ", unavailable);
          
        } else { //ie. odd index, then be end_at
          unavailable.end = eachDayArr[i];
          const fixed = Object.assign({}, unavailable);
          unavailables.push(fixed);

          // console.log("in loop, fixed >>> ", fixed)
          
        }
          
      }
    }

    // helpers.footprint(6)
    // console.log("unavailables >>>", unavailables);
    /*
    unavailables >>> 
    [ 
      { title: 'Dr does NOT work now',
    type: 'OUT_OF_OFFICE',
    start: 2018-02-25T08:00:00.000Z,
    end: 2018-02-26T07:59:59.999Z },
  { title: 'Dr does NOT work now',
    type: 'OUT_OF_OFFICE',
    start: 2018-02-25T08:00:00.000Z,
    end: 2018-02-26T07:59:59.999Z },
  { title: 'Dr does NOT work now',
    type: 'OUT_OF_OFFICE',
    start: 2018-02-25T08:00:00.000Z,
    end: 2018-02-26T07:59:59.999Z },
    ]
    */
    
  //  console.log("right before return result unavailables human readable>>")
  //  for (let b in unavailables){
  //    console.log("unavailables[b].start.toString() >>", unavailables[b].start.toString())
  //    console.log("unavailables[b].end.toString()   >>", unavailables[b].end.toString())
  //  }

    return unavailables;
    
  })
  .then((unavailables) => {

    db("appointments")
    .where({doctor_id: req.params.id})
    .whereBetween("wish_start_at", [now, twoWeeksLater])
      .then((booked) => {
  
        let cleanBooked = [];
        
        for (let apmt of booked){
          //login is required for this entire action, if this fails, the library is guilty
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

    // helpers.footprint(7)
        
  
        const allBadSlots = unavailables.concat(cleanBooked);

        console.log("right before return result allBadSlots converted>>")
        for (let b in allBadSlots){
          console.log("allBadSlots[b].start.toString() >>", allBadSlots[b].start.toString())
          console.log("allBadSlots[b].end.toString()   >>", allBadSlots[b].end.toString())
        }
        
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