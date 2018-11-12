//nov 11, 2018 version
//(array, DateObj, DateObj)
const isSlotOpen = (slotsTaken, start, end) => {
    /* logic:
    if `start` is before the start of a booked slot, and `end` is after the end of the booked slot: not OK;
    if `start` is in the middle a booked slot: not OK;
    if `end` is in the middle of a booked slot: not OK.
    */

    if (slotsTaken.length === 0){
        return true;
    }

    var keyStart1, keyEnd1;
    if (slotsTaken[0].start_at === undefined){
        keyStart1 = "start";
        keyEnd1 = "end";
    } else {
        keyStart1 = "start_at";
        keyEnd1 = "end_at";
    }

    for (var bad of slotsTaken){
        if (start < bad[keyStart1]
            && end > bad[keyEnd1]
        ){
            return false;
        }

        if (start >= bad[keyStart1]
            && start < bad[keyEnd1]
        ){
            return false;
        }

        if (end > bad[keyStart1]
            && end <= bad[keyEnd1]
        ){
            return false;
        }
    }
    return true;
}

module.exports = isSlotOpen