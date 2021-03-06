import moment from 'moment';
import addLog from 'helpers/addLog.js'

export default thisContext => {
    return async slotInfo => {
        try {
            if (moment() > moment(slotInfo.start)) {
                return;
            }

            const _this = thisContext;

            const {createAppointment, match} = _this.props;
            const {drUrlName} = match.params;

            var wish_end_at = moment(slotInfo.start)
                .add(5, 'minutes')
                .toDate();;

            const confirmMsg = `Book appointment with Dr. ${drUrlName}? \nstart: ` + slotInfo
                .start
                .toLocaleString() + "\nend: " + wish_end_at.toLocaleString();

            if (!window.confirm(confirmMsg)) {
                return;
            }

            createAppointment({drUrlName: drUrlName, wish_start_at: slotInfo.start, wish_end_at: wish_end_at});
        } catch (e) {
            addLog(e, `fn client_side/src/helpers/handleOnSelectSlot.js`);
        }
    }
}