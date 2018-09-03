const rootRequire = require.main.require;
const constants = rootRequire("./config/constants");

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

export default() => {
    const cleanBooked = [];

    for (let apmt of booked) {
        //login is required for this entire action, if this fails, the library is guilty
        const isMine = apmt.user_id === req.session.passport.user;

        let title = "";
        if (isMine) {
            title = "My appm here"
        }

        cleanBooked.push({
            'title': title, 'start': apmt.wish_start_at, 'end': apmt.wish_end_at, type: constants.slotType.outOfOffice,
            // 'patient': apmt.user_id,
            isMine: isMine
        });
    }

    return cleanBooked;
}