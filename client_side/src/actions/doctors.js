import {GET_DOCTORS} from './types'
import axios from 'axios'

export const getList = () => {
    return async (dispatch) => {
        try {
            const {data} = await axios.get("doctors/index");

            return dispatch({
                type: GET_DOCTORS, 
                payload: data //[{}, {}]
            })
        } catch (error) {
            console.log("actions/doctor.js getList error: ", error)
        }
    }
}
