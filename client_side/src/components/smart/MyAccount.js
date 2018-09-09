import React from 'react';
import {connect} from 'react-redux';
import isAuthed from 'helpers/isAuthed'
import Redirect from 'react-router-dom/Redirect';

class MyAccount extends React.Component {

  render() {
    const {currentUser, authenticated} = this.props;

    if (!authenticated){
      return <Redirect to="/login"/>
    }
    
    const {email, firstname, lastname, phone, id, isAdmin } = currentUser;
    
    return (
      <div >

        <div>
          {isAdmin ? "Is Admin" : "Regular User"}
        </div>
        
        <div>
          id: {id}
        </div>
        <div>
          {firstname} {lastname}
        </div>
        <div>
          email: {email}
        </div>
        <div>
          phone: {phone}
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    currentUser: state.currentUser,
    authenticated: isAuthed(state.currentUser)
  };
}

export default connect(mapState, {})(MyAccount);