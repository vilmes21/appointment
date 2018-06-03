import {ADD_APPOINTMENT} from '../actions/types'

const appintmentReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_APPOINTMENT:
          return state;
        default:
          return state;
      }
}

export default appintmentReducer