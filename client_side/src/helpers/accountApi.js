import addLog from "./addLog"
import axios from "axios";
import queryString from "querystring"

const filenameNow = "src/helpers/accountApi.js";

const updatePassword = async toSend => {
    try {
        const {data} = await axios.post("/users/updatePassword", queryString.stringify(toSend));
        if (data) {
            return data;
        }
    } catch (e) {
        addLog(e, `${filenameNow} updatePassword`);
    }
    return false;
}

export default {
    updatePassword
}