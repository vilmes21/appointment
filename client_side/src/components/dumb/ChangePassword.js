import React from 'react';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import accountApi from "helpers/accountApi.js"
import {Redirect} from 'react-router-dom';

const attemptStatus = {
    pending: 1,
    isSuccessful: 2,
    isFailed: 3
}

export default class ChangePassword extends React.Component {
    state = {
        current: "",
        neww: "",
        confirmation: "",
        status: attemptStatus.pending,
        failureMsg: "Error"
    }

    handleChange = ev => {
        const {name, value} = ev.target;
        this.setState({[name]: value})
    }

    clearForm = () => {
        this.setState({current: "", neww: "", confirmation: ""})
    }

    showMsgBox = status => {
        this.setState({status})
    }

    clearMsgbox = () => {
        setTimeout(() => {
            this.setState({status: attemptStatus.pending})
        }, 8000)
    }

    updateMsg = _msg => {
        this.setState({failureMsg: _msg})
    }

    handleSubmit = async ev => {
        ev.preventDefault();
        const data = await accountApi.updatePassword(this.state);
        if (data && data.success) {
            this.clearForm();
            this.showMsgBox(attemptStatus.isSuccessful);
        } else {
            if (data && data.msg) {
                this.updateMsg(data.msg);
            }
            this.showMsgBox(attemptStatus.isFailed);
        }
        this.clearMsgbox();
    }

    renderMsg = (status, msg) => {
        if (status === attemptStatus.isSuccessful) {
            return (
                <div className="wrappwupdatedc">
                    <div className="alertBoxGeneral pwupdatedc">Password updated!</div>
                </div>
            )
        } else if (status === attemptStatus.isFailed) {
            return (
                <div className="wrappwupdatedc">
                    <div className="alertBoxGeneral pwdUpdateFaild">
                        {msg}
                    </div>
                </div>
            )
        }
    }

    render() {
        const {authenticated, location} = this.props;

        if (!authenticated) {
            return <Redirect
                to={{
                pathname: "/login",
                state: {
                    from: location
                }
            }}/>
        }

        const {current, neww, confirmation, status, failureMsg} = this.state;
        const disableConfirmation = neww.length === 0;
        const isConfirmationSame = neww === confirmation;
        const warnBadConfirmation = neww.length > 0 && confirmation.length > 0 && !isConfirmationSame;
        const canSubmit = current !== neww && current.length > 0 && neww.length > 0 && isConfirmationSame;

        return (
            <div className="wrappwformxcx">
                <form onSubmit={this.handleSubmit}>
                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            label="Current password"
                            value={current}
                            onChange={this.handleChange}
                            name="current"
                            type="password"/>
                    </div>
                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            label="New password"
                            value={neww}
                            onChange={this.handleChange}
                            name="neww"
                            type="password"/>
                    </div>

                    <div className="fieldeachhx">
                        <TextField
                            required
                            value={confirmation}
                            onChange={this.handleChange}
                            name="confirmation"
                            label="Confirm new password"
                            type="password"
                            fullWidth={true}
                            disabled={disableConfirmation}/>

                        <div>
                            {warnBadConfirmation && <div className="textAlignLeft notmatchdf dangerRed">Does not match</div>
}
                        </div>
                    </div>

                    <div className="subformbtnParenxg">
                        <Button type="submit" variant="raised" disabled={!canSubmit}>
                            Change
                        </Button>

                        {this.renderMsg(status, failureMsg)
}

                    </div>
                </form>
            </div>
        )
    }
}
