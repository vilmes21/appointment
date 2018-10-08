import moment from 'moment'
import getLastMidnight from './getLastMidnight';
import getComingMidnight from './getComingMidnight'
const rootRequire = require.main.require;
const isThePast = rootRequire("./helpers/isThePast")
const db = rootRequire("./db/knex");
const helpers = require("../helpers");
const constants = require("../config/constants");

let errWhenLoggingCount = 0;

const _caseNum = x => ` SERVER CASE NUMBER: ${x} ; `;

//arg (int, object_or_string, string_or_null)
const addLog = async(userId, err, notes = null) => {
    try {

        const newLog = {
            user_id: typeof userId === "number" && userId > 0
                ? userId
                : null,
            time: (new Date()),
            notes
        };

        /* Must try to conver potential error object to string here. Server-side code usually passes err object here */

        let message;
        if (!err) {
            message = `typeof message >>> ${typeof err}` + _caseNum(1);
        } else if (typeof err === "string") {
            message = err + _caseNum(2);
        } else if (typeof err.message === "string" && err.message) {
            message = err.message + _caseNum(3);
        } else if (typeof err.toString === "function") {
            message = err.toString() + _caseNum(4);
        } else {
            message = _caseNum(5);
        }

        newLog.message = message;

        await db('log').insert(newLog);
    } catch (err) {
        console.log(`in func addLog. errWhenLoggingCount >>> ${errWhenLoggingCount}. err >>>`, err);

        if (errWhenLoggingCount === 0) {
            errWhenLoggingCount++;
            addLog(userId, err, "fn clinic_app/helpers/addLog.js ITSELF");
        }
    }
}

module.exports = addLog;
