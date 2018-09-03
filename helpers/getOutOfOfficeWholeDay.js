import getLastMidNight from "./getLastMidNight";
import getComingMidnight from "./getComingMidnight";

/*

   ("Sun Mar 04 2018")

   =>

   [
     Date_obj_starting_time,
     Date_obj_ending_time,
   ]

*/

export default (dayString) => {
    return [getLastMidNight(dayString), getComingMidnight(dayString)];
}