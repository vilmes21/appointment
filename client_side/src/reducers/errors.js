import {NEW_ERROR} from '../actions/types'

const errors = (state = [], action) => {
    switch (action.type) {
        case NEW_ERROR:
          return [...state, action.payload];
        default:
          return state;
      }
}

export default errors
