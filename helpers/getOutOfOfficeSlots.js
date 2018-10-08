import initCollectByDay from "./initCollectByDay"
import getLastMidNight from "./getLastMidNight";
import getComingMidnight from "./getComingMidnight";

const moment = require("moment");
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");
const constants = rootRequire("./config/constants");
const helpers = rootRequire("./helpers");

   /* 

   ([], ) => 
   { 
    'Sun Feb 25 2018': 
                   [ 2018-02-25T22:00:00.000Z,
                     2018-02-25T22:30:00.000Z] 
   }
   */

export default availables => {

    /*
    logic:
    */
   let collectByDay={};
   try {
   
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
 
    collectByDay = initCollectByDay(constants.USER_PREVIEW_DAYS);
   
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
 
     dayOpennings.unshift(getLastMidNight(drDay));
     dayOpennings.push(getComingMidnight(drDay));
 
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
  } catch (e) {
    addLog(null, e, `fn /helpers/getOutOfOfficeSlots.js. param availables >>> ${JSON.stringify(availables)} `);
}

   return collectByDay;
   /* 
 collectByDay >>>  { 
 'Sun Feb 25 2018': 
                   [ 2018-02-25T22:00:00.000Z,
                     2018-02-25T22:30:00.000Z] 
   }
   */ 

  }

