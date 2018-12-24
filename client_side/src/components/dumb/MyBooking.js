import React from 'react';
import accountApi from "helpers/accountApi.js"
import {Redirect} from 'react-router-dom';
import Spinner from "./Spinner"
import Snackbarr from "components/smart/Snackbarr.js"

export default class MyBooking extends React.Component {
    render() {
        const {
            id,
            drFullName,
            start,
            end,
            canBeCancelled,
            remove
        } = this.props.data;
        
        return <div>
            <div>id: {id}</div>
            <div>doctor: {drFullName}</div>
            <div>start: {start}</div>
            <div>end: {end}</div>
            <div>
                <button
                    disabled={!canBeCancelled}
                    title={canBeCancelled
                    ? ""
                    : "Too late to cancel this appointment"}
                    onClick=
                    { () => { remove(id) } }>
                    Cancel
                </button>
            </div>
        </div>
    }
}
