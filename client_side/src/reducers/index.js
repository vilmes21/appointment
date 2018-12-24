import appointments from './appointments'
import doctors from './doctors'
import doctorUrls from './doctorUrls'
import currentUser from './currentUser'
import errors from './errors'
import drBookedArr from "./drBookedArr"
import isLoading from './isLoading'
import { combineReducers } from 'redux';

export default combineReducers({
    isLoading,
    errors,
    appointments,
    doctors,
    doctorUrls,
    currentUser,
    drBookedArr
})