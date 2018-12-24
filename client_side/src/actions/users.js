import {NEW_ERROR, GET_CURRENT_USER, SIGNIN_USER, SIGNOUT_USER, UPDATE_LOADING_STATUS} from './types'
import axios from 'axios'
import queryString from "qs"

export const signup = (user) => {
    return async(dispatch) => {
        try {
            const {data} = await axios.post("/users/new", user);

            let _msg = "Server error: sign up";
            if (!data) {
                return dispatch({type: NEW_ERROR, payload: _msg});
            }

            if (!data.success) {
                if (data.msg) {
                    _msg = data.msg;
                }
                return dispatch({type: NEW_ERROR, payload: _msg});
            }

            const {email, firstname, lastname} = user;
            const {id} = data;

            dispatch({
                type: SIGNIN_USER,
                payload: {
                    email,
                    firstname,
                    lastname,
                    id,
                    isAdmin: false
                }
            })
        } catch (error) {
            console.log("actions/users.js signup error: ", error)
        }
    }
}

export const loginVerify = (loginForm) => {
    return async(dispatch) => {
        try {
            const {data} = await axios.post('/login', loginForm);

            let _msg2 = "Error";
            if (!data) {
                return dispatch({type: NEW_ERROR, payload: _msg2});
            }

            if (!data.success) {
                _msg2 = data.msg || _msg2;
                return dispatch({type: NEW_ERROR, payload: _msg2});
            }

            const {
                email,
                firstname,
                lastname,
                id,
                isAdmin,
                emailConfirmed
            } = data;

            return dispatch({
                type: SIGNIN_USER,
                payload: {
                    email,
                    firstname,
                    lastname,
                    id,
                    isAdmin,
                    emailConfirmed
                }
            })
        } catch (error) {
            console.log("actions/users.js loginVerify error: ", error)
        }
    }
}

export const signout = () => {
    return async(dispatch) => {
        try {
            const {data} = await axios.post('/logout');

            const res = {
                success: false,
                msg: ""
            }

            if (data && !data.success) {
                res.msg = data.Msg
                    ? data.Msg
                    : "Error";
                return dispatch({type: NEW_ERROR, payload: res.msg});
                return res;
            }

            dispatch({type: SIGNOUT_USER})

            res.success = true;
            return res;
        } catch (error) {
            console.log("actions/users.js signout error: ", error)
        }
    }
}

//=============

export const checkAuthNow = () => {
    //need to get back for Layout component: isAdmin, firstname, id
    return async(dispatch) => {
        let _msg3 = "Server error";

        try {
            const {data} = await axios.get('/users/me/true');
            const {id, firstname, isAdmin} = data;

            dispatch({
                payload: {
                    id,
                    firstname,
                    isAdmin
                },
                type: GET_CURRENT_USER
            })

            dispatch({payload: false, type: UPDATE_LOADING_STATUS})
        } catch (error) {
            console.log("actions/users.js checkAuthNow error: ", error)
            // since Layout won't be ready, so even NEW_ERROR dispatch won't be visible. So
            // fallback to alerting
            alert(_msg3)
        }
    }
}
