import axios from "axios";

//arg (string, string)
export default async (message, notes) => {
    await axios.post("/log/create", {
        message,
        notes
    });
}