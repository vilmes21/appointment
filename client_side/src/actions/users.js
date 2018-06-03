import {NEW_USER, NEW_ERROR} from './types'
import axios from 'axios'

export const signup = (user) => {
    return async (dispatch) => {
        try {
            const {data} = await axios.post("/users/new", user);

            if (!data.success){
                dispatch({
                    type: NEW_ERROR, 
                    payload: {
                        what: "Sign up failed: " + data.Msg ? data.Msg : "",
                        where: "sign up"
                    }
                });
                return false;
            }

            const {email, firstname, lastname} = user;
            
            dispatch({
                type: NEW_USER, 
                payload: {email, firstname, lastname}
            })

            return true;
        } catch (error) {
            console.log("actions/users.js signup error: ", error)
        }
    }
}
