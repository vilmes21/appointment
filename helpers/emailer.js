const rootRequire = require.main.require;
const addLog = rootRequire("./helpers/addLog");
const nodemailer = require('nodemailer');
const appkeys = rootRequire("./appkeys.js")

const {companyEmailAddress, companyEmailPassword, companyEmailService} = appkeys;

const transporter = nodemailer.createTransport({
    service: companyEmailService,
    auth: {
        user: companyEmailAddress,
        pass: companyEmailPassword
    }
});

const emailer = async mailOptions => {
    const _out = {
        success: false,
        err: {}
    }

    if (mailOptions.isLocalHost){
        mailOptions.to = appkeys.testEmailRecipient;
    }

    try {
        const info = await transporter.sendMail(mailOptions); 
        //todo: use info for auditing
        _out.success = true;

    } catch (e) {
        _out.err = e;
        addLog(null, e, `Backend /helpers/emailer.js`);
    }
    
    return _out;
}

module.exports = emailer;