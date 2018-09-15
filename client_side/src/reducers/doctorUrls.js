import {GET_DOCTOR_URLS} from '../actions/types'

export default (state = {}, action) => {
    switch (action.type) {
        case GET_DOCTOR_URLS:
          return action.payload;
        default:
          return state;
      }
}