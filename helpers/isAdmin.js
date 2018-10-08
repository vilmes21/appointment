const rootRequire = require.main.require;
const constants = rootRequire("./config/constants");
const db = rootRequire("./db/knex");
const getUserIdForLog = rootRequire("./helpers/getUserIdForLog.js")
const addLog = rootRequire("./helpers/addLog");

const getAdminUserIds = async () => {
    let ids = [];

    try {
        const admins = await db("user_roles")
            .where({role_id: constants.ROLE_ADMIN})
            .select("user_id");

        for (let admin of admins) {
            ids.push(admin.user_id);
        }

    } catch (e) {
        addLog(null, e, `fn getAdminUserIds in /helpers/isAdmin.js`);
    }

    return ids;
}

const isAdmin = async req => {
    try {
        if (!req.isAuthenticated()) {
            return false;
        }

        const {adminUserIds, passport} = req.session;
        const userId = passport.user;

        if (adminUserIds) {
            return adminUserIds.indexOf(userId) > -1;
        }

        const _adminUserIds = await getAdminUserIds(req);
        req.session.adminUserIds = _adminUserIds;
        return _adminUserIds.indexOf(userId) > -1;
    } catch (e) {
        addLog(getUserIdForLog(req), e, `${req.method} ${req.originalUrl} fn /helpers/isAdmin.js`);
    }

    return false;
}

module.exports = isAdmin;