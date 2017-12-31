var express = require('express'),
  router = express.Router();
const db = require("../db/knex");
const helpers = require("../helpers");

router.get("/me", 
            helpers.requireLogin,
            (req, res) => {
              const userId = req.session.passport.user;
              console.log("userId >>>", userId);
              if (!userId || userId < 0) { 
                res.json("you hack!");
                res.end();
              }
              db("users").where({id: userId})
              .then((user) => {
                if (user.length < 1){
                  res.json("you hack fake userId!");
                  res.end();
                  return;
                }
                res.json({
                  email: user[0].email,
                  phone: user[0].phone
                })

              })
              .catch((err) => {
                console.log(err);
              })
            })

router.get('/:id', (req, res) => {
  res.json({
    email: "good",
    phone: "nice"
  });
});

router.post('/new',
  function (req, res) {
    db("users").where({
      email: req.body.email
    })
    .then((existingUsers) => {
      console.log("existingUsers >>>", existingUsers);
      if (existingUsers.length > 0){
        res.json({
          success: false,
          msg: "Email already taken."
        });
        res.end();
        return false;
      }
      return true
    })
    .then((shouldContinue) => {
      if (!shouldContinue){
        console.log("shouldContinue" >> shouldContinue);
        return;
      }
      db('users').insert({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password, //TODO: later hash it
        created_at: new Date(), // TODO: JS - use UTC
        updated_at: new Date()
      })
      .returning('id')
      .then((x) => {
        console.log("x >>> " , x, "of type >>", typeof(x)); //I think x should be the new user obj, but it's not

        //now log the new user in
        req.logIn(x[0], (err) => {
          if (err){
            res.json({
              success: false,
              msg: "New user created but failed to auto-login."
            })
          }
          res.json({
            success: true,
            authenticated: req.isAuthenticated(),
            msg: "Welcome, new user!"
          })
        })
        
      })
    })
    .catch((err) => {
      console.log(err)
    })

  });

module.exports = router