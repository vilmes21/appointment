const rootRequire = require.main.require;
const constants = rootRequire("./config/constants");
const moment = require("moment");
const helpers = rootRequire("./helpers");
   /* 

   ([], ) => 
   { 
    'Sun Feb 25 2018': 
                   [ 2018-02-25T22:00:00.000Z,
                     2018-02-25T22:30:00.000Z] 
   }
   */

export default (availables) => {

    /*
    logic:
    */
   const collect = [];
        
   for (let ava of availables){
       collect.push(ava.start_at);
       collect.push(ava.end_at);
   }
 
   /*
   collect >>>  [ 
 2018-03-05T01:00:00.000Z,
 2018-03-05T20:30:00.000Z]
   */
 
   let cleaned = helpers.keepUniqueElems(collect); //[1,3,3,5] becomes [1,5]
 
   /*
 cleaned >>>  [  
 '2018-03-05T01:00:00.000Z',
 '2018-03-05T20:30:00.000Z']
   */
 
   const cleanedCount = cleaned.length;
   if (cleanedCount % 2 !== 0) { //i.e if count is odd, then db has bad data
     return Promise.reject("db has bad data. Count is odd; expected even.");
   }
 
   const collectByDay = {};
 
   for (let i = 0; i <= constants.USER_PREVIEW_DAYS; i++){
     const keyStr = moment().add(i.toString(), "days").toDate().toDateString();
     collectByDay[keyStr] = [];
   }
 
   /* 
   after all initation. collectByDay>> { 
                                         'Sat Mar 17 2018': [],
                                         'Sun Mar 18 2018': [] }
    */
   
   for (let j = 0; j < cleanedCount; j++){
     const date = new Date(cleaned[j]);
     const str = date.toDateString();
     /* 
 str >>>  Sun Mar 04 2018
 str >>>  Mon Mar 05 2018
      */
 
      //all keys are initialized already. So just push
     collectByDay[str].push(date);
   }
 
   for (let drDay in collectByDay){
     const dayOpennings = collectByDay[drDay]; // type: []
     if (dayOpennings.length > 0){
       dayOpennings.sort((a, b) => {
         return a-b;
       });
     }
     
     // as suggested by https://stackoverflow.com/questions/43101278/how-to-handle-deprecation-warning-in-momentjs/43102805, sometimes , might need specify format
     // const lastMidNight = moment(drDay, moment.ISO_8601).startOf('day').toDate();
     const lastMidNight = moment(new Date(drDay)).startOf('day').toDate();
     const thisMidNight = moment(new Date(drDay)).endOf('day').toDate();
 
     /* lastMidNight >>>  2018-03-04T08:00:00.000Z
 thisMidNight >>>  2018-03-05T07:59:59.999Z */
     
     dayOpennings.unshift(lastMidNight);
     dayOpennings.push(thisMidNight);
 
     /* dayOpennings >>>  [ 2018-03-05T08:00:00.000Z,
 2018-03-05T23:30:00.000Z,
 2018-03-06T07:59:59.999Z ] */
 
 // console.log("dayOpennings human readable>>")
 // for (let b of dayOpennings){
 //   console.log("b.start.toString() >>", b.toString())
 //   console.log("b.end.toString()   >>", b.toString())
 // }
 
   }
 
   //cleaned looks like [1, 4, 5, 9] meaning 1-4, 5-9 avaialble. Add 2 elems as [last-mid-night, 1, 4, 5, 9, this-mid-night]

   return collectByDay;
   /* 
 collectByDay >>>  { 
 'Sun Feb 25 2018': 
                   [ 2018-02-25T22:00:00.000Z,
                     2018-02-25T22:30:00.000Z] 
   }
   */ 

  }

