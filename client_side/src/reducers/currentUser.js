import {GET_CURRENT_USER, SIGNIN_USER, SIGNOUT_USER} from '../actions/types'

const currentUser = (state = null, action) => {
    switch (action.type) {
        case SIGNIN_USER:
            return action.payload;
        case SIGNOUT_USER:
            return null;
        case GET_CURRENT_USER:
            return action.payload
        default:
            return state;
    }
}

export default currentUser

/*
{
  email: "test@test.com"
firstname: "Vic"
id: 338
lastname: "Wang"
}
 */