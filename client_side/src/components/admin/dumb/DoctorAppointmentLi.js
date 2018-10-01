import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import isTimeAgo from "helpers/isTimeAgo"
import consts from "consts.js"

export default class DoctorAppointmentLi extends React.Component {

    render() {
        const {handleToggle, checked} = this.props;
        const {id, title, start, end} = this.props.appt;
        const uncancellable = isTimeAgo(end, consts.minutesAgoCancellationAllowed);

        return (
            <ListItem key={id} role={undefined} dense button onClick={handleToggle(id)}>

                <Checkbox disabled={uncancellable} checked={checked.indexOf(id) !== -1} tabIndex={-1} disableRipple/>

                <ListItemText primary={start}/>
                <ListItemText secondary={title}/>
                <ListItemText secondary={end}/>

            </ListItem>

        );
    }

}
