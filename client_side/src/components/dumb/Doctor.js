import React from 'react';
import {Link} from 'react-router-dom'

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

export default class Doctor extends React.Component {
  render() {
    const {dr} = this.props;

    return (

        <Link key={dr.id} to={"/calendar/" + dr.lastname}>

          <ListItem >
            <ListItemAvatar>
              <Avatar>
                <img
                  src="https://i.pinimg.com/originals/3a/ff/84/3aff849766b881ebe9640caf996e915a.jpg"/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={dr.firstname + " " + dr.lastname} secondary={dr.bio}/>
          </ListItem>
        </Link>

      );
 
  }
}
