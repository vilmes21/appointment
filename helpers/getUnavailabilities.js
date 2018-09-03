import getOutOfOfficeSlots from "./getOutOfOfficeSlots";
import shapeOutOfOfficeSlots from "./shapeOutOfOfficeSlots";
const rootRequire = require.main.require;
const constants = rootRequire("./config/constants");
const moment = require("moment");
const db = rootRequire("./db/knex");
const helpers = rootRequire("./helpers");

export default async (req, res) => {

    /*
    logic:
    -fetch all dr availabilities slots, simplify them: 1-3, 3-5 becomes 1-5
    -reverse grey out all non-available hours
    -fetch all appointments booked
    -return array collection of objects, including all non-available slots + booked appms
    */
  
    const now = new Date();
    const twoWeeksLater = moment().add(constants.USER_PREVIEW_DAYS.toString(), "days").toDate();
  
    const availables = await db("availabilities")
        .where({doctor_id: req.params.id})
        .whereBetween("start_at", [now, twoWeeksLater]);

        if (availables.length === 0){
            //TODO: instead of [], return full occupancy for next 14 days
            res.json([]);
            return Promise.reject("0 doctor avaiablities. Not to say patient bookings. Halt.");
          }
        
        const collectByDay = getOutOfOfficeSlots(availables);
        const unavailables = shapeOutOfOfficeSlots(collectByDay);

        const booked = await  
        db("appointments")
        .where({doctor_id: req.params.id})
        .whereBetween("wish_start_at", [now, twoWeeksLater]);
    
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
         
      
    
  }

