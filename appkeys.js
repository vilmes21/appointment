require('dotenv').config();
const addLog = require("./helpers/addLog");

const getProcEnv = key => {
    const val = process.env[key];
    if (!val) {
        addLog(null, `process.env.${key} is falsy: ${val}`, `/appkeys.js`);
    }
    return val;
}

const envVarCenter = {
    nodeEnv: getProcEnv("NODE_ENV"),
    companyEmailAddress: getProcEnv("COMPANY_EMAIL_ADDRESS"),
    companyEmailPassword: getProcEnv("COMPANY_EMAIL_PASSWORD"),
    companyEmailService: getProcEnv("COMPANY_EMAIL_SERVICE"),
    testEmailRecipient: getProcEnv("TEST_EMAIL_RECIPIENT")
};

// console.log("so HHHHHHH +++++++++++++++++ envVarCenter: \n", envVarCenter)

module.exports = envVarCenter