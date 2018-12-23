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

const confirmEmail = async toSend => {
    /*
    toSend = {
        userGuid: "0700ef50-06e5-11e9-b6e9-4f31c135b5fd"
    }
    */
    
    try {
        const {data} = await axios.post("/users/confirmEmail", queryString.stringify(toSend));
        if (data) {
            return data;
        }
    } catch (e) {
        addLog(e, `${filenameNow} confirmEmail`);
    }
    return false;
}

export default {
    updatePassword,
    confirmEmail
}