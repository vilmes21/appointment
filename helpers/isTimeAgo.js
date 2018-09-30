import moment from "moment";

//arg: string, int
module.exports = (timeString, spanInMinute) => {
    const pastTimePoint = moment().subtract(spanInMinute, 'minutes')
    return moment(timeString) <= pastTimePoint;
}