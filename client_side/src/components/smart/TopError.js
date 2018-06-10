import React from 'react';
import {connect} from 'react-redux';
import {removeError} from 'actions/errors'

const TopError = ({errors, removeError}) => {
    if (!errors) {
        return null;
    }

    if (errors.length < 1) {
        return null;
    }

    return errors.map((e, i) => {
        return <div key={i}>
            Error: {e}

            <button onClick={() => {removeError(e)}}>
                got it
            </button>
        </div>;
    })
}

const mapState = (state) => {
    return {errors: state.errors};
}

export default connect(mapState, {removeError})(TopError);