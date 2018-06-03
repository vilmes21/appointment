import {GET_DOCTORS} from '../actions/types'

const doctors = (state = [], action) => {
    switch (action.type) {
        case GET_DOCTORS:
          return action.payload;
        default:
          return state;
      }
}

export default doctors
