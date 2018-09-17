import {GET_CURRENT_USER, SIGNIN_USER, SIGNOUT_USER} from './types'
import axios from 'axios'

export const signup = (user) => {
    return async (dispatch) => {
        try {
            const {data} = await axios.post("/users/new", user);

            const res = {
                success: false,
                msg: ""
            }
            
            if (!data.success){
                res.msg = data.Msg ? data.Msg : "sign up faild";
                return res;
            }

            const {email, firstname, lastname} = user;
            const {id, isAdmin} = data;
            
            await dispatch({
                type: SIGNIN_USER, 
                payload: {email, firstname, lastname, id, isAdmin}
            })

            res.success = true;
            return res;
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
                res.msg = data.Msg || "Login failed";
                return res;
            }

            const {email, firstname, lastname, id, isAdmin} = data;
            
            await dispatch({
                type: SIGNIN_USER, 
                payload: {email, firstname, lastname, id, isAdmin}
            })

            res.success = true;
            return res;
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

            if (!data.auth){
                return; //not error. Simply not logged in.
            }

            await dispatch({
                payload: data.userInfo,
                type: GET_CURRENT_USER
            })
        } catch (error) {
            console.log("actions/users.js checkAuthNow error: ", error)
        }
    }
}

