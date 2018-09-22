import {UPDATE_LOADING_STATUS} from '../actions/types'

const isLoading = (state = true, action) => {
    switch (action.type) {
        case UPDATE_LOADING_STATUS:
          return action.payload;
        default:
          return state;
      }
}

export default isLoading
