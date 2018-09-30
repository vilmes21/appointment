import moment from "moment";

//arg: string, int
export default (timeString, spanInMinute) => {
    const pastTimePoint = moment().subtract(spanInMinute, 'minutes')
    return moment(timeString) <= pastTimePoint;
}