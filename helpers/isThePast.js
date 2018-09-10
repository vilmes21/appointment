import moment from "moment";

export default timeString => {
    return moment() > moment(timeString);
}