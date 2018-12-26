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
import {adminGetList} from "actions/doctors.js"

class DoctorAppointmentList2 extends Component {
    state = {
        checked: []
    };

    clearChecked = () => {
        this.setState({checked: []})
    }

    cancelAppts = ids => {
        this
            .props
            .cancel(ids);
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

        this.setState({checked: newChecked});
    };

    componentDidMount() {
        const {drId} = this.props.match.params;
        this
            .props
            .getDoctorBooked(drId);
    }

    getDoctorLastname = doctorArr => {
        if (!doctorArr || doctorArr.length === 0) {
            this
                .props
                .adminGetList();
            return "";
        }

        const {drId} = this.props.match.params;
        const drIdInt = parseInt(drId);
        const dr = doctorArr.find(x => x.id === drIdInt);

        return dr
            ? dr.lastname
            : "Error";
    }

    renderList = booked => {
        if (!booked || booked.length === 0) {
            return <div>No upcoming appointments</div>;
        }

        const {checked} = this.state;

        return (
            <div>
                <CancelBtn2
                    checked={checked}
                    cancelAppts={this.cancelAppts}
                    clearChecked={this.clearChecked}/>

                <table className="bookedAppAdminTable">
                    <thead>
                        <tr>
                            <th className="textAlignLeft">Select</th>
                            <th className="textAlignLeft">Start</th>
                            <th className="textAlignLeft">Patient</th>
                            <th className="textAlignLeft">End</th>
                        </tr>
                    </thead>

                    <tbody>
                        {booked.map(appt => {
                            return <DoctorAppointmentLi2
                                key={`${appt.id}`}
                                checked={checked}
                                appt={appt}
                                handleToggle={this.handleToggle}/>
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        const {authenticated, isAdmin, booked, doctors, location} = this.props;

        if (!authenticated) {
            return <Redirect
                to={{
                pathname: "/login",
                state: {
                    from: location
                }
            }}/>
        }

        if (!isAdmin) {
            return <Redirect to="/"/>;
        }

        return (
            <div>
                <h1>
                    Appointments with Dr. {this.getDoctorLastname(doctors)}
                </h1>

                {this.renderList(booked)}
            </div>
        );
    }
}

const mapState = (state) => {
    return {
        authenticated: isAuthed(state.currentUser),
        isAdmin: isAdmin(state.currentUser),
        booked: state.drBookedArr,
        doctors: state.doctors || []
    };
}

export default connect(mapState, {getDoctorBooked, cancel, adminGetList})(DoctorAppointmentList2);