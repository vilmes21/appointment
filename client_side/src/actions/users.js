import {NEW_ERROR, GET_CURRENT_USER, SIGNIN_USER, SIGNOUT_USER, UPDATE_LOADING_STATUS} from './types'
import axios from 'axios'

export const signup = (user) => {
    return async (dispatch) => {
        try {
            const {data} = await axios.post("/users/new", user);

            let _msg = "Server error: sign up";
            if (!data){
                return dispatch({type: NEW_ERROR, payload: _msg});
            }
            
            if (!data.success){
                if (data.msg){
                    _msg = data.msg;
                }
                return dispatch({type: NEW_ERROR, payload: _msg});
            }

            const {email, firstname, lastname} = user;
            const {id} = data;
            
            dispatch({
                type: SIGNIN_USER, 
                payload: {email, firstname, lastname, id, isAdmin: false}
            })
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
                res.msg = data.msg || "Login failed";
                return dispatch({type: NEW_ERROR, payload: res.msg});
            }

            const {email, firstname, lastname, id, isAdmin} = data;
            
            return dispatch({
                type: SIGNIN_USER, 
                payload: {email, firstname, lastname, id, isAdmin}
            })
        } catch (error) {
            console.log("actions/users.js loginVerify error: ", error)
        }
    }
}

export const signout = () => {
    return async (dispatch) => {
        try {
            const {data} = await axios.post('/logout');

            const res = {
                success: false,
                msg: ""
            }

            if (data && !data.success) {
                res.msg = data.Msg? data.Msg : "Logout failed";
                return res;
            }

            await dispatch({
                type: SIGNOUT_USER
            })

            res.success = true;
            return res;
        } catch (error) {
            console.log("actions/users.js signout error: ", error)
        }
    }
}

//=============

export const checkAuthNow = () => {
    return async (dispatch) => {
        try {
            const {data} = await axios.get('/auth/now');

            console.log("data} >>", data)

            if (!data) {
                //pls log error
                return;
            }
            
            const userInfo = data.auth? data.userInfo : null;

            await dispatch({
                payload: userInfo,
                type: GET_CURRENT_USER
            })

            await dispatch({
                payload: false,
                type: UPDATE_LOADING_STATUS
            })


        } catch (error) {
            console.log("actions/users.js checkAuthNow error: ", error)
        }
    }
}

