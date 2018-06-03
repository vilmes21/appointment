import {NEW_USER} from '../actions/types'

const currentUser = (state = null, action) => {
    switch (action.type) {
        case NEW_USER:
          return action.payload;
        default:
          return state;
      }
}

export default currentUser