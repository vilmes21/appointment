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
import moment from "moment"

export default class DoctorAppointmentLi2 extends React.Component {

    formateDateString= dateStringISO => {
        return moment(dateStringISO).format('MMM D, YYYY k:mm');
    }

    render() {
        const {handleToggle, checked} = this.props;
        const {id, title, start, end} = this.props.appt;
        const uncancellable = isTimeAgo(end, consts.minutesAgoCancellationAllowed);

        // console.log("test grandchild with addition key: " + `${id}`)
        
        return (
            <tr key={`${id}`} onClick={handleToggle(id)}>
                <td className="textAlignCenter">
                    <input type="checkbox" disabled={uncancellable} checked={checked.indexOf(id) !== -1} />
                </td>
                <td>
                    {this.formateDateString(start)}
                </td>
                <td>
                    {title}
                </td>
                <td>
                    {this.formateDateString(end)}
                </td>
            </tr>
            
        );
    }

}
