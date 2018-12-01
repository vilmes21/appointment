import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import isAuthed from 'helpers/isAuthed'
import {connect} from 'react-redux';
import isAdmin from 'helpers/isAdmin'
import {getDoctorBooked, cancel} from "actions/appointments"
import DoctorAppointmentLi2 from "components/admin/dumb/DoctorAppointmentLi2"
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import CancelBtn2 from 'components/admin/CancelBtn2.js'


class DoctorAppointmentList2 extends Component {
    state = {
        checked: []
    };

    clearChecked = ()=> {
        this.setState({checked: []})
    }

    cancelAppts = ids=> {
            this.props.cancel(ids);
    }

    handleToggle = value => () => {
        const {checked} = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked
        });
    };

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
        const {checked} = this.state;

        let _list = null;
        if (booked && booked.length > 0) {
            _list = <div>
                <table>
                    <thead>
                        <tr>
                        <th>Select</th>
                        <th>Start</th>
                        <th>Patient</th>
                        <th>End</th>
                        </tr>
                    </thead>

                    <tbody>
                    {booked.map(appt => <DoctorAppointmentLi2
                        key={appt.id}
                        checked={checked}
                        appt={appt}
                        handleToggle={this.handleToggle}/>)}
                    </tbody>
                </table>
            </div>
        }

        return (
            <div>
                <h1>
                    Appointments with Dr.
                </h1>
                <CancelBtn2 checked={checked} cancelAppts={this.cancelAppts} clearChecked={this.clearChecked}/>
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

export default connect(mapState, {getDoctorBooked, cancel})(DoctorAppointmentList2);