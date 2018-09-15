import {GET_DOCTORS, GET_DOCTOR_URLS} from './types'
import axios from 'axios'

export const getList = () => {
    console.log("entered doctors getList")

    return async (dispatch) => {
    console.log("2 entered doctors getList")

        try {
            const {data} = await axios.get("/doctors/index");

            const drUrls = {};
            for (const drObj of data) {
                drUrls[drObj.url_name] = drObj.id;
            }

            dispatch({
                type: GET_DOCTOR_URLS, 
                payload: drUrls //{}
            })
            
            return dispatch({
                type: GET_DOCTORS, 
                payload: data //[{}, {}]
            })
        } catch (error) {
            console.log("actions/doctor.js getList error: ", error)
        }
    }
}
