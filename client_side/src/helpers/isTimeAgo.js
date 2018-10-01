import moment from "moment"

export default (timeString, spanInMinute) => {
    const pastTimePoint = moment().subtract(spanInMinute, 'minutes')
    return moment(timeString) <= pastTimePoint;
}