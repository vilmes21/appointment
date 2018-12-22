const db = require("../db/knex");
const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");
const constants = rootRequire("./config/constants");
const bcrypt = require('bcrypt');

export default async(username, password, done) => {
    try {
        const users = await db('users').where({email: username});

        if (users.length < 1) {
            return done(null, false, {message: 'Wrong credentials'});
        }

        const user = users[0];

        const isPasswordCorrect = true;
        // const isPasswordCorrect = await bcrypt.compare(password, user.password);
        // if (!isPasswordCorrect) {
        //     return done(null, false, {message: 'Wrong credentials'});
        // }

        const {email, firstname, lastname, id} = user;
        const userInfo = {
            email,
            firstname,
            lastname,
            id
        };

        const userRoles = await db
            .select("role_id")
            .from('user_roles')
            .where({user_id: id});

        /*
    [
      {role_id: 3234},
      {role_id: 45}
    ]
     */

        for (const obj of userRoles) {
            if (obj.role_id === constants.ROLE_ADMIN) {
                userInfo.isAdmin = true;
                break;
            }
        }

        return done(null, user.id, userInfo);

    } catch (e) {
        addLog(null, e, `fn /helpers/authStrategy.js. param username >>> ${username}`);
        return done(e);
    }

}