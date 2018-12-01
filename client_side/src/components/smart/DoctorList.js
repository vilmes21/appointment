import React from 'react';
import {getList} from 'actions/doctors'
import {connect} from 'react-redux';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Doctor from 'components/dumb/Doctor'

class DoctorList extends React.Component {

  componentDidMount() {
    this
      .props
      .getList();
  }

  render() {
    const {drs} = this.props;

    if (!drs || drs.length === 0) {
      return null;
    }

    const _list = drs.map(dr => <Doctor key={dr.id} dr={dr}/>);

    return (
      <div className="drlistcontandch">
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
      </div>
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