
  //(array, obj)
  const isSlotOpen = (slotsTaken, want) => {
    /* logic:
    if `start_at` is before the start of a booked slot, and `end_at` is after the end of the booked slot: not OK;
    if `start_at` is in the middle a booked slot: not OK;
    if `end_at` is in the middle of a booked slot: not OK.
    */

    if (slotsTaken.length === 0){
        return true;
    }

    //there are 2 versions of key: "start" && "start_at"
    var keyStart1, keyEnd1, keyStart2, keyEnd2;
    if (slotsTaken[0].start_at === undefined){
        keyStart1 = "start";
        keyEnd1 = "end";
    } else {
        keyStart1 = "start_at";
        keyEnd1 = "end_at";
    }

    if (want.start_at === undefined){
        keyStart2 = "start";
        keyEnd2 = "end";
    } else {
        keyStart2 = "start_at";
        keyEnd2 = "end_at";
    }

    for (var bad of slotsTaken){
        if (want[keyStart2] < bad[keyStart1]
            && want[keyEnd2] > bad[keyEnd1]
        ){
            return false;
        }

        if (want[keyStart2] >= bad[keyStart1]
            && want[keyStart2] < bad[keyEnd1]
        ){
            return false;
        }

        if (want[keyEnd2] > bad[keyStart1]
            && want[keyEnd2] <= bad[keyEnd1]
        ){
            return false;
        }
    }
    return true;
}

module.exports = {
    isSlotOpen: isSlotOpen
}