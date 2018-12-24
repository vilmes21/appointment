import {UPDATE_DR_BOOKED} from '../actions/types'

export default  (state = [], action) => {
    switch (action.type) {
        case UPDATE_DR_BOOKED:
            return action.payload;
        default:
            return state;
    }
}