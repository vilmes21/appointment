import React from 'react';
import {signout} from "actions/users";
import {addError} from "actions/errors";
import {connect} from 'react-redux';

const Logout =({authenticated, signout, addError}) =>{
  if (!authenticated){
    return null;
  }
  
  const handleClick = async () => {
    const res = await signout();
    if (!res.success){
      addError(res.msg);
    }
  }
  
  return (
    <div>
      <button onClick={handleClick}>
        Log out!
      </button>
    </div>
  );
}

const mapState = (state) => {
  return {authenticated: !!state.currentUser && !!state.currentUser.email};
}
 
export default connect(mapState, { signout, addError })(Logout);