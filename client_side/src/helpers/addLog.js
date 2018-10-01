import axios from "axios";

const _caseNum = x => ` CLIENT CASE NUMBER: ${x} ; `;

//arg (object_or_string, string)
export default async (err, notes) => {

    /* Error obj may be passed in here. Must try to convert to string right here. Unable to pass informative Error object to server */

    let message;
    if (!err){
        message = `typeof message >>> ${typeof err}` + _caseNum(1);
    } else if (typeof err === "string") {
        message = err + _caseNum(2);
    } else if (typeof err.message === "string" && err.message) {
        message = err.message + _caseNum(3);
    } else if (typeof err.toString === "function") {
        message = err.toString() + _caseNum(4);
    } else {
        message = _caseNum(5);
    }

    await axios.post("/log/create", {
        message,
        notes
    });
}