var express = require('express'),
  router = express.Router();
const db = require("../db/knex");

// const helpers = require("../helpers"); const constants =
// require("../config/constants"); const moment = require("moment");

router.get('/index', function (req, res) {
  // db("doctors") .where("id", ">", "0")
  db('doctors')
    .join('users', 'doctors.user_id', 'users.id')
    .select('users.firstname', 'users.lastname', 'doctors.id', 'doctors.photo', 'doctors.bio', 'doctors.url_name')
    .then((drs) => {
      res.json(drs);
      return true;
    })
    .catch((err) => {
      console.log(err)
    })

});

module.exports = router