import {GET_DOCTORS} from './types'
import axios from 'axios'

export const getList = () => {
    console.log("entered doctors getList")

    return async (dispatch) => {
    console.log("2 entered doctors getList")

        try {
            const {data} = await axios.get("/doctors/index");

            return dispatch({
                type: GET_DOCTORS, 
                payload: data //[{}, {}]
            })
        } catch (error) {
            console.log("actions/doctor.js getList error: ", error)
        }
    }
}
