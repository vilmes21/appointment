import addLog from "./addLog"
import axios from "axios";
import queryString from "qs"

const filenameNow = "src/helpers/bookingApi.js";

const getMyBookings = async toSend => {
    try {
        const {data} = await axios.get("/appointments/mine", queryString.stringify(toSend));
        if (data.success) {
            return data.info;
        }
    } catch (e) {
        addLog(e, `${filenameNow} getMyBookings`);
    }
    return false;
}

export default {
    getMyBookings
}