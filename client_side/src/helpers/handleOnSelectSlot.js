import moment from 'moment';

export default thisContext => {
    return async slotInfo => {
        
        // console.log("enter func handleOnSelectSlot. slotInfo.start >>>", slotInfo.start);

        if (moment() > moment(slotInfo.start)){
            // console.log("Dragging on past. Halt");
            return;
        }

        const _this = thisContext;

        const {booked} = _this;

        

        var wish_end_at = moment(slotInfo.start)
            .add(5, 'minutes')
            .toDate();;

        const confirmMsg = "Continue to book appointment? \nstart: " + slotInfo
            .start
            .toLocaleString() + "\nend: " + wish_end_at.toLocaleString();

        if (!window.confirm(confirmMsg)) {
            return;
        }

console.log(`_this.props.match.params >>> `, _this.props.match.params)        

        let newAppointment = {
            drUrlName: _this.props.match.params.drUrlName,
            wish_start_at: slotInfo.start,
            wish_end_at: wish_end_at
        }

        const res = await _this
            .props
            .createAppointment(newAppointment);

        if (!(res && res.success)) {
            alert(res.msg);
        }

    }
}