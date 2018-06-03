import React from 'react';
import axios from "axios";
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Calendar from "./Calendar"
import {connect} from 'react-redux';
import {getList} from '../actions/doctors'
import {bindActionCreators} from 'redux'

class DoctorList extends React.Component {

  componentDidMount() {
    this.props.getList();
  }

  render() {
    const _this = this;

    if (_this.props.drs.length === 0) {
      return null;
    }

    return (
      <div>
        {_this
          .props
          .drs
          .map((dr) => {
            return (
              <div key={dr.id}>
                <Link to={"/calendar/" + dr.lastname}>
                  {dr.firstname}
                  {dr.lastname}
                  | Bio: {dr.bio}
                </Link>
                <hr/>
              </div>
            );
          })
}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {drs: state.doctors};
}


////this may work, but better to use short hand: https://stackoverflow.com/questions/34458261/how-to-get-simple-dispatch-from-this-props-using-connect-w-redux?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

//https://blog.benestudio.co/5-ways-to-connect-redux-actions-3f56af4009c8

// const mapDispatchToProps = (dispatch) => {
//   return {
//     getList: bindActionCreators(getList, dispatch)
//   }
// }
 
export default connect(mapStateToProps, { getList })(DoctorList);