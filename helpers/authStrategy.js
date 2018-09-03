const db = require("../db/knex");

export default function(username, password, done) {
    db('users').where({
        email: username
      })
      .then((users) => {
        if (users.length < 1) {
          // what if there's multiple emails? no good, must ensure db level email unique
          return done(null, false, {
            message: 'Incorrect email.'
          });
        }

        const user = users[0];

        // if (!users.validPassword(password)) {
          //for now fake everyone to be authenticated:
        if (user.password !== password) {
          // return done(null, false, {
          //   message: 'Incorrect password.'
          // });
        }
        
        const {email, firstname, lastname, id} = user;
        const userInfo = {email, firstname, lastname, id};
             
        return done(null, user.id, userInfo);
      })
      .catch((err) => {
        return done(err);
      })

  } //close LocalStra func