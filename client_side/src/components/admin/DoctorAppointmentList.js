import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import isAuthed from 'helpers/isAuthed'
import {connect} from 'react-redux';
import isAdmin from 'helpers/isAdmin'
import {getDoctorBooked} from "actions/appointments"
import DoctorAppointmentLi from "components/admin/dumb/DoctorAppointmentLi"

class DoctorAppointmentList extends Component {

    componentDidMount() {
        const {drId} = this.props.match.params;
        this
            .props
            .getDoctorBooked(drId);
    }

    render() {
        const {authenticated, isAdmin} = this.props;

        if (!authenticated) {
            return <Redirect to="/login"/>;
        }

        if (!isAdmin) {
            return <Redirect to="/"/>;
        }

        const {booked} = this.props;

        let _list = null;
        if (booked && booked.length > 0) {
            _list = booked.map(appt => <DoctorAppointmentLi key={appt.id} appt={appt}/>)
        }

        return (
            <div>
                <h1>
                    Appointments with Dr.
                </h1>
                {_list}
            </div>
        );
    }
}

const mapState = (state) => {
    return {
        authenticated: isAuthed(state.currentUser),
        isAdmin: isAdmin(state.currentUser),
        booked: state.appointments
    };
}

export default connect(mapState, {getDoctorBooked})(DoctorAppointmentList);