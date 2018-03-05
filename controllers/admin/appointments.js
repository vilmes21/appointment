var express = require('express'),
  router = express.Router();
const db = require("../../db/knex");
const helpers = require("../../helpers");
const constants = require("../../config/constants");
const moment = require("moment");

//================================================================================================

// url: /admin/appointments/wang
router.get('/:id', helpers.findDrId, function (req, res) {
  db("appointments")
  .join('users', 'appointments.user_id', 'users.id')
  .select('users.firstname', 'users.lastname', 'appointments.wish_start_at', 'appointments.wish_end_at')
  .where({
    doctor_id: req.params.id,
    status: constants.APPOINTMENT_STATUS_BOOKED
  })
  .whereBetween("wish_start_at", [moment().toDate(), moment().add("28", "days").toDate()])
    .then((booked) => {

      const out = [];

      for (let i = 0; i < booked.length; i++){
        const apm = {
          start: booked[i].wish_start_at,
          end: booked[i].wish_end_at,
          title: booked[i].firstname + " " + booked[i].lastname
        };
        out.push(Object.assign({}, apm));
      }
      
      return res.json(out);
    })
    .catch((err) => {
      console.log(err)
    })

});

module.exports = router