const db = require("../db/knex");
const rootRequire = require.main.require;
const constants = rootRequire("./config/constants");

export default async (username, password, done) => {
  try {
  
    const users = await db('users').where({
      email: username
    });

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

    const userRoles = await db.select("role_id").from('user_roles').where({
      user_id: id
    });

    /* 
    [
      {role_id: 3234},
      {role_id: 45}
    ]
     */

    console.log("userRoles >>> ", userRoles)

    for(const obj of userRoles){
      if (obj.role_id === constants.ROLE_ADMIN){
        userInfo.isAdmin = true;
        break;
      }
    }

    console.log("userInfo >>> ", userInfo);
    
    return done(null, user.id, userInfo);
    
  } catch (err) {
    return done(err);    
  }

  } //close LocalStra func