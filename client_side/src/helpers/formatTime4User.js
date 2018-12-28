import moment from "moment"
import consts from "consts.js"

//string => string
export default dateString => {
    return moment(dateString).format(consts.timeFormat4User);
}