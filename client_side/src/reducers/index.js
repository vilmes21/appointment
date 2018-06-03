import appointments from './appointments'
import doctors from './doctors'
import currentUser from './currentUser'
import { combineReducers } from 'redux';

export default combineReducers({
    appointments,
    doctors,
    currentUser
})