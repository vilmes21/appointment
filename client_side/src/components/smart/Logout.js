import React from 'react';
import {signout} from "actions/users";
import {addError} from "actions/errors";
import {connect} from 'react-redux';

const Logout = ({signout, addError}) => {

    const handleClick = async() => {
        const res = await signout();
        if (!res.success) {
            addError(res.msg);
        }
    }

    return (
        <span className="navitemdx floatRight" onClick={handleClick}>
            Log out!
        </span>
    );
}

export default connect(null, {signout, addError})(Logout);