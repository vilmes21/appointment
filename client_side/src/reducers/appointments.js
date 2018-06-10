import {GET_BOOKED, ADD_APPOINTMENT} from '../actions/types'

const appintmentReducer = (state = [], action) => {
  switch (action.type) {
    case GET_BOOKED:
      return action.payload;
    case ADD_APPOINTMENT:
      return [
        ...state,
        action.payload
      ];
    default:
      return state;
  }
}

export default appintmentReducer