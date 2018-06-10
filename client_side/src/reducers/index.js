import appointments from './appointments'
import doctors from './doctors'
import currentUser from './currentUser'
import errors from './errors'
import { combineReducers } from 'redux';

export default combineReducers({
    errors,
    appointments,
    doctors,
    currentUser
})