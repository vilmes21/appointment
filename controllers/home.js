var express = require('express'),
  router = express.Router();
const helpers = require("../helpers");


router.get('/hi',
  helpers.requireLogin,
  function (req, res) {
    console.log("req.user >>>", req.user, "of type>>>", typeof (req.user)); //passport allows session to carry user info, which I have set up to be an integer, the user's id

    //  db.select().table('users').then(x => {
    //    res.json(x);
    //  })
    res.json("nice dude");
  });

module.exports = router