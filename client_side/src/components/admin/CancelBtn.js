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
        open: false
    };

    handleToggle = () => {
        this.setState(state => ({
            open: !state.open
        }));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({open: false});
    };

    handleConfirmCancel = () => {
        alert("confirmed to cancel. send ajax pls")
    }

    render() {
        const {open} = this.state;
        const {checked, cancelAppts} = this.props;

        return (
            <div className="wrapCancelBtn">
                <Button
                    buttonRef={node => {
                    this.anchorEl = node;
                }}
                    aria-owns={open
                    ? 'menu-list-grow'
                    : null}
                    aria-haspopup="true"
                    onClick={this.handleToggle}>
                    Cancel appointments ({checked.length})
                </Button>
                <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{
                            transformOrigin: placement === 'bottom'
                                ? 'center top'
                                : 'center bottom'
                        }}>
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        <MenuItem onClick={this.handleClose}>Never mind</MenuItem>
                                        <MenuItem onClick={cancelAppts(checked)}>Confirm cancellation</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        );
    }
}

CancelBtn.propTypes = {};

export default CancelBtn;
