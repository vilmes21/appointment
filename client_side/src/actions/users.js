import {NEW_ERROR, SIGNIN_USER} from './types'
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
                type: SIGNIN_USER, 
                payload: {email, firstname, lastname}
            })

            return true;
        } catch (error) {
            console.log("actions/users.js signup error: ", error)
        }
    }
}

export const loginVerify = (loginForm) => {
    return async (dispatch) => {
        try {
            const {data} = await axios.post('/login', loginForm);
            const res = {
                success: false,
                msg: ""
            }

            if (data && !data.success) {
                res.msg = "Wrong credentials";
                return res;
              }

            const {email, firstname, lastname, id} = data;
            
            await dispatch({
                type: SIGNIN_USER, 
                payload: {email, firstname, lastname, id}
            })

            res.success = true;
            res.msg = "Welcome back";
            return res;
        } catch (error) {
            console.log("actions/doctor.js loginVerify error: ", error)
        }
    }
}
