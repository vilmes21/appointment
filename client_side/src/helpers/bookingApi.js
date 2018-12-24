import addLog from "./addLog"
import axios from "axios";
import queryString from "qs"

const filenameNow = "src/helpers/bookingApi.js";

const getMyBookings = async toSend => {
    try {
        const {data} = await axios.get("/users/getMyBookings", queryString.stringify(toSend));
        if (data) {
            return data;
        }
    } catch (e) {
        addLog(e, `${filenameNow} getMyBookings`);
    }
    return false;
}

export default {
    getMyBookings
}