import {NEW_ERROR, REMOVE_ERROR} from '../actions/types'

const errors = (state = [], action) => {
    switch (action.type) {
        case NEW_ERROR:
          return [...state, action.payload];
        case REMOVE_ERROR:
          return state.filter((e) => {
            return e != action.payload;
          })
        default:
          return state;
      }
}

export default errors
