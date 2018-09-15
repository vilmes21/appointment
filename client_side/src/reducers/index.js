import appointments from './appointments'
import doctors from './doctors'
import doctorUrls from './doctorUrls'
import currentUser from './currentUser'
import errors from './errors'
import { combineReducers } from 'redux';

export default combineReducers({
    errors,
    appointments,
    doctors,
    doctorUrls,
    currentUser
})