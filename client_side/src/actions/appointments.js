import {UPDATE_DR_BOOKED, NEW_ERROR, GET_BOOKED, ADD_APPOINTMENT, UPDATE_BOOKED} from './types'
import axios from 'axios'
import addLog from "helpers/addLog.js"

const buildSlotFrontend = slotObjBackend => {
    const {start, end} = slotObjBackend;

    return {
        ...slotObjBackend,
        start: new Date(start),
        end: new Date(end)
    };
}

export const getList = (drUrlName) => {
    return async(dispatch) => {
        try {
            const {data} = await axios.get("/availabilities/" + drUrlName);

            // console.log("Ooooooooop: data has id? no \n:", data)

            if (!Array.isArray(data)) {
                return;
            }

            const slotsFrontend = [];

            for (let c of data) {
                slotsFrontend.push(buildSlotFrontend(c));
            }

            return dispatch({type: GET_BOOKED, payload: slotsFrontend});
        } catch (error) {
            addLog(error, "actions/appointments.js fn getList")
        }
    }
}

export const createAppointment = proposal => {
    return async(dispatch) => {
        try {

            let _msg = "Server error";

            const {data} = await axios.post("/appointments/create", proposal);

            if (!data) {
                return dispatch({type: NEW_ERROR, payload: _msg});
            }

            if (data.serverBadAuth) {
                return dispatch({type: NEW_ERROR, payload: "Please log in first"});
            }

            if (!data.success) {
                if (typeof data.msg === "string" && data.msg) {
                    _msg = data.msg;
                }
                return dispatch({type: NEW_ERROR, payload: _msg});
            }

            console.log("FE about to add aptm, data >>>> ", data)
            dispatch({
                type: ADD_APPOINTMENT,
                payload: buildSlotFrontend(data.newApmtSaved)
            });
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
                type: UPDATE_DR_BOOKED, payload: data //[{}, {}]
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
                const currentAppts = [...getState().drBookedArr];
                /* [{start: "2018-10-05T16:25:00.000Z", end: "2018-10-05T16:30:00.000Z", title: "Joe Doe", id: 211}, {}] */

                console.log("currentAppts HHHHH: ",currentAppts)
                const remainingAppts = currentAppts.filter(x => !data.success.includes(x.id));

                dispatch({
                    type: UPDATE_DR_BOOKED, payload: remainingAppts //[{}, {}]
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

// ============ right now basically a clone of `cancelAdminSide`; should only be
// 1 int in array `apptIds`
export const cancelApmtUserSide = apptIds => {
    return async(dispatch, getState) => {

        try {
            if (!Array.isArray(apptIds) || apptIds.length === 0) {
                return;
            }

            const {data} = await axios.post("/appointments/cancel", {ids: apptIds});

            if (!data || !Array.isArray(data.success)) {
                return;
            }

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
            addLog(e, "actions/appointments.js fn cancelApmtUserSide");
        }
    }
}