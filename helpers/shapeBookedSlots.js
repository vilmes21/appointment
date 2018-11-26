const rootRequire = require.main.require;
const constants = rootRequire("./config/constants");
const addLog = rootRequire("./helpers/addLog");

/*

   ([
       {},
       {}
   ])

   =>

[ 
    { 
        id: 301,
        title: '',
        start: 2018-11-13T17:15:00.000Z,
        end: 2018-11-13T17:20:00.000Z,
        type: 'BOOKED',
        isMine: false,
        firstname: '',
        lastname: '' 
    },
    {}
]

*/

// only give name info when isMine. Admins should view on admin pages instead
module.exports = (booked, userId, isAdmin) => {
    const cleanBooked = [];

    try {
        
        for (let apmt of booked) {

            const {id, user_id, wish_start_at, wish_end_at} = apmt;

            const isMine = user_id === userId;

            let firstname;
            let lastname;
            if (isAdmin) {
                firstname = apmt.firstname;
                lastname = apmt.lastname;
            } else {
                firstname = isMine
                    ? apmt.firstname
                    : "";
                lastname = isMine
                    ? apmt.lastname
                    : "";
            }

            cleanBooked.push({
                // patientUserId: apmt.user_id,
                id,
                title: isMine
                    ? "My appointment"
                    : "",
                start: wish_start_at,
                end: wish_end_at,
                type: constants.slotType.booked,
                isMine: isMine,
                firstname,
                lastname
            });
        }
    } catch (e) {
        addLog(userId, e, `fn shapeBookedSlots.js. param isAdmin>>>${isAdmin} ; booked>>>${JSON.stringify(booked)}`);
    }

    
    return cleanBooked;
}