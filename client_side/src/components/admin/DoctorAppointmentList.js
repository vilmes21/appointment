import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import isAuthed from 'helpers/isAuthed'
import {connect} from 'react-redux';
import isAdmin from 'helpers/isAdmin'
import {getDoctorBooked, cancel} from "actions/appointments"
import DoctorAppointmentLi from "components/admin/dumb/DoctorAppointmentLi"
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import CancelBtn from 'components/admin/CancelBtn.js'

const styles = theme => ({
    root: {
        width: '100%'
    }
});

class DoctorAppointmentList extends Component {
    state = {
        checked: []
    };

    cancelAppts = ids=> {
        return () => {
            this.props.cancel(ids);
        }
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
        }, () => {
            console.log(this.state)
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
        console.log("booked FOUND>>>", booked)
        
        const {classes} = this.props;
        const {checked} = this.state;

        let _list = null;
        if (booked && booked.length > 0) {
            _list = <div className={classes.root}>
                <List>
                    {booked.map(appt => <DoctorAppointmentLi
                        key={appt.id}
                        checked={checked}
                        appt={appt}
                        handleToggle={this.handleToggle}/>)}
                </List>
            </div>
        }

        return (
            <div>
                <h1>
                    Appointments with Dr.
                </h1>
                {
                    checked.length > 0 && <CancelBtn checked={checked} cancelAppts={this.cancelAppts}/>
                }
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

export default connect(mapState, {getDoctorBooked, cancel})(withStyles(styles)(DoctorAppointmentList));