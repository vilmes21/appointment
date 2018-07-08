import React from 'react';
import {Link} from 'react-router-dom'
import {getList} from 'actions/doctors'
import {connect} from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class DoctorList extends React.Component {

  componentDidMount() {
    this
      .props
      .getList();
  }

  render() {
    const _this = this;
    const {drs} = _this.props;

    if (!drs || drs.length === 0) {
      return null;
    }

    const _list = drs.map((dr) => {
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
    });

    return (
      <Grid container spacing={16}>
        <Grid item xs={12} md={6}>
          <Typography variant="title">
            Doctors
          </Typography>
          <div >
            <List>

              {_list}

            </List>
          </div>
        </Grid>
      </Grid>
    );
  }
}

const mapState = (state) => {
  return {drs: state.doctors};
}

export default connect(mapState, {getList})(DoctorList);

// //this may work, but better to use short hand:
// https://stackoverflow.com/questions/34458261/how-to-get-simple-dispatch-from-t
// his-props-using-connect-w-redux?utm_medium=organic&utm_source=google_rich_qa&u
// tm_campaign=google_rich_qa
// https://blog.benestudio.co/5-ways-to-connect-redux-actions-3f56af4009c8 const
// mapDispatchToProps = (dispatch) => {   return {     getList:
// bindActionCreators(getList, dispatch)   } }