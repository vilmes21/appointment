import {NEW_ERROR, REMOVE_ERROR} from './types'
import axios from 'axios'

export const addError = (e) => {
    return async (dispatch) => {
        try {
            return dispatch({
                type: NEW_ERROR, 
                payload: e //string
            })
        } catch (error) {
            console.log("actions/errors.js addError error: ", error)
        }
    }
}

export const removeError = (e) => {
    return async (dispatch) => {
        try {
            return dispatch({
                type: REMOVE_ERROR, 
                payload: e //string
            })
        } catch (error) {
            console.log("actions/errors.js removeError error: ", error)
        }
    }
}


