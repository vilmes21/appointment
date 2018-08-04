import {GET_BOOKED, ADD_APPOINTMENT} from './types'
import axios from 'axios'

export const getList = (drUrlName) => {
    console.log("entered getList")

    
    return async (dispatch) => {

    console.log("2 entered getList")


        try {
            const {data} = await axios.get("/availabilities/" + drUrlName); 

            const clone = [...data];

            for (let c of clone){
              c.start = new Date(c.start);
              c.end = new Date(c.end);
            }

            return dispatch({
                type: GET_BOOKED, 
                payload: clone //[{}, {}]
            })
        } catch (error) {
            console.log("actions/appointments.js getList error: ", error)
        }
    }
}

export const createAppointment = (newAppointment) => {
    console.log("entered createAppointment, newApp >>> ",newAppointment)

    return async (dispatch) => {
        try {

            console.log("2 entered createAppointment, newApp >>> ",newAppointment)
            
            const res = {
                success: false,
                msg: "",
                id: -1
            }

            const {data} = await axios.post("/appointments/create", newAppointment);
            console.log("data >>> " , data)

            if (data.serverBadAuth){
                res.msg = "Log in first! Server saw that you're not logged in.";
                return res;
              }
        
            if (!data.success){
                if (data.msg){
                    res.msg = data.msg;
                } else {
                    res.msg = "ajax good, but performance failed";
                }
                return res;
            }

            const newAppointmentFrontend = {
                title: "My new appointment!",
                start: newAppointment.wish_start_at,
                end: newAppointment.wish_end_at,
                isMine: true
              };

            dispatch({
                type: ADD_APPOINTMENT, 
                payload: newAppointmentFrontend
            })

            res.success = true;
            return res;

        } catch (error) {
            console.log("actions/appointments.js createAppointment error: ", error)
        }
    }
}
