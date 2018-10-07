import {NEW_ERROR, GET_BOOKED, ADD_APPOINTMENT, UPDATE_BOOKED} from './types'
import axios from 'axios'
import addLog from "helpers/addLog.js"

export const getList = (drUrlName) => {
    return async(dispatch) => {
        const res = {
            success: false,
            msg: null
        }

        try {
            const {data} = await axios.get("/availabilities/" + drUrlName);

            const clone = [...data];

            for (let c of clone) {
                c.start = new Date(c.start);
                c.end = new Date(c.end);
            }

            dispatch({
                type: GET_BOOKED, payload: clone //[{}, {}]
            })

            res.success = true;
            return res;
        } catch (error) {
            addLog(error, "actions/appointments.js fn getList")
            res.msg = error.toString();
            return res;
        }
    }
}

export const createAppointment = (newAppointment) => {
    console.log("entered createAppointment, newApp >>> ", newAppointment)

    return async(dispatch) => {
        try {

            console.log("2 entered createAppointment, newApp >>> ", newAppointment)

            const res = {
                success: false,
                msg: "",
                id: -1
            }

            const {data} = await axios.post("/appointments/create", newAppointment);
            console.log("data >>> ", data)

            if (data.serverBadAuth) {
                res.msg = "Log in first! Server saw that you're not logged in.";
                return res;
            }

            if (!data.success) {
                if (data.msg) {
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

            dispatch({type: ADD_APPOINTMENT, payload: newAppointmentFrontend})

            res.success = true;
            return res;

        } catch (e) {
            addLog(e, "actions/appointments.js fn createAppointment")
        }
    }
}

//=============

export const updateList = newList => {

    console.log("entering updateList. newList>>> ", newList)

    return async(dispatch) => {

        console.log("2 entering updateList. newList>>> ", newList)

        const res = {
            success: false,
            msg: null
        }

        try {
            dispatch({
                type: UPDATE_BOOKED, payload: newList //[{}, {}]
            })

            res.success = true;
            return res;
        } catch (error) {
            addLog(error, "actions/appointments.js fn updateList");
            res.msg = error.toString();
            return res;
        }
    }
}

//===========

export const getDoctorBooked = drId => {

    return async(dispatch) => {

        try {
            const {data} = await axios.get("/admin/appointments/" + drId);

            dispatch({
                type: UPDATE_BOOKED, payload: data //[{}, {}]
            })
        } catch (error) {
            addLog(error, "client_side/src/actions/appointments.js fn getDoctorBooked");
        }
    }
}

//============

export const cancel = apptIds => {
    return async(dispatch, getState) => {

        try {
            if (!Array.isArray(apptIds) || apptIds.length === 0) {
                return;
            }

            const {data} = await axios.post("/admin/appointments/cancel", {ids: apptIds});

            if (data.success.length > 0) {
                const currentAppts = [...getState().appointments];
                /* [{start: "2018-10-05T16:25:00.000Z", end: "2018-10-05T16:30:00.000Z", title: "Joe Doe", id: 211}, {}] */

                const remainingAppts = currentAppts.filter(x => !data.success.includes(x.id));

                dispatch({
                    type: UPDATE_BOOKED, payload: remainingAppts //[{}, {}]
                })
            }

            if (typeof data.msg === "string" && data.msg) {
                dispatch({type: NEW_ERROR, payload: data.msg});
            }
        } catch (e) {
            addLog(e, "actions/appointments.js fn cancel");
        }
    }
}