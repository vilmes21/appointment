import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

class CancelBtn extends React.Component {
    state = {
        askConfirm: false
    };

    handleToggle = () => {
        this.setState(state => ({
            askConfirm: !state.askConfirm
        }));
    };

    handleConfirmCancel = () => {
        const {checked, cancelAppts, clearChecked} = this.props;

        cancelAppts(checked);
        this.handleToggle();
        clearChecked();
    }

    render() {
        const {askConfirm} = this.state;
        const {checked} = this.props;

        return (
            <div className="wrapCancelBtn">

                <button className="btn1" disabled={checked.length === 0} onClick={this.handleToggle}>
                    {askConfirm
                        ? "Forget it"
                        : `Cancel appointments (${checked.length})`}
                </button>

                {askConfirm && <button className="btn1" onClick={this.handleConfirmCancel}>
                    Confirm Cancel ({checked.length})
                </button>
}

            </div>
        );
    }
}

export default CancelBtn;
