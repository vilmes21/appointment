import {GET_DOCTORS, ADMIN_GET_DOCTORS} from '../actions/types'

const doctors = (state = [], action) => {
    switch (action.type) {
        case GET_DOCTORS:
            return action.payload;
        case ADMIN_GET_DOCTORS:
            return action.payload;
        default:
            return state;
    }
}

export default doctors
