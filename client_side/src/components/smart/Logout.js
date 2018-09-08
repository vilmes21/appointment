import React from 'react';
import {signout} from "actions/users";
import {addError} from "actions/errors";
import {connect} from 'react-redux';

const Logout =({signout, addError}) =>{

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

export default connect(null, { signout, addError })(Logout);