import {SIGNIN_USER} from '../actions/types'

const currentUser = (state = null, action) => {
    switch (action.type) {
        case SIGNIN_USER:
          return action.payload;
        default:
          return state;
      }
}

export default currentUser