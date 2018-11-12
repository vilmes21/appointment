import addLog from "./addLog"
import axios from "axios";
import queryString from "querystring"

const filenameNow = "adminAvailabilityApi.js fn";
const baseUrl = "/admin/availabilities";

const getAvailabilitiesList = async drUrlName => {
    try {

        const {data} = await axios.get(baseUrl + "/" + drUrlName);
        if (Array.isArray(data)) {
            return data;
        }
    } catch (e) {
        addLog(e, `${filenameNow} getAvailabilitiesList`);
    }
    return false;
}

const create = async newAvailability => {
    try {

        newAvailability.start_at = newAvailability.start_at.toJSON();
        newAvailability.end_at = newAvailability.end_at.toJSON();
        const toSend = queryString.stringify(newAvailability);
        console.log("to send toSend:", toSend)
   
        const {data} = await axios.post(baseUrl + "/create", toSend);

        if (!data) {
            window.alert("Internal server err");
            return false;
        }

        if (!data.success) {
            window.alert("Failed db insert. Server msg:" + data.msg);
            return false;
        }

        return true;
    } catch (e) {
        addLog(e, `${filenameNow} newAvailability`);
    }
    return false;
}

export default {
    getAvailabilitiesList,
    create
}