import moment from 'moment'
import getLastMidnight from './getLastMidnight';
import getComingMidnight from './getComingMidnight'
const rootRequire = require.main.require;
const isThePast = rootRequire("./helpers/isThePast")
const db = rootRequire("./db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");

let errWhenLoggingCount = 0;

const addLog = async (erroringUserId, message, notes = null) => {
    try {
        const newLog = {
            userId: typeof erroringUserId === "number"? erroringUserId : null,
            message: typeof message === "string"? message: message.toString(),
            time: (new Date()),
            notes
        }
       
        await db('log').insert(newLog);
    } catch (err) {
        console.log(`in func addLog. errWhenLoggingCount >>> ${errWhenLoggingCount}. err >>>`, err);

        if (errWhenLoggingCount === 0){
            errWhenLoggingCount++;
            addLog(erroringUserId, err.toString(), "ERR while logging error");
        }
    }
}

module.exports = addLog;