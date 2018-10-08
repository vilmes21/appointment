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
     { title: 'Dr does NOT work now',
     type: 'OUT_OF_OFFICE',
     start: 2018-02-25T08:00:00.000Z,
     end: 2018-02-26T07:59:59.999Z },

     { title: 'Dr does NOT work now',
     type: 'OUT_OF_OFFICE',
     start: 2018-02-25T08:00:00.000Z,
     end: 2018-02-26T07:59:59.999Z },
   ]

*/

// only give name info when isMine. If admin, you should view these on admin
// pages instead
export default(booked, userId, isAdmin) => {
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
                    ? "My appm here"
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