import React from 'react';
import accountApi from "helpers/accountApi.js"
import {Redirect} from 'react-router-dom';
import Spinner from "./Spinner"
import Snackbarr from "components/smart/Snackbarr.js"

const statuses = {
    isWorking: 1,
    isSuccessful: 2,
    isFailure: 3
}

const secondsUntilRedirect = 5;

export default class ConfirmEmail extends React.Component {
    state = {
        status: statuses.isWorking,
        timeLeft: secondsUntilRedirect,
        msg: ""
    }

    goToHomeInSeconds = () => {
        const myInterval = setInterval(() => {
            const {timeLeft} = this.state;
            if (timeLeft === 0) {
                clearInterval(myInterval);
            } else {
                this.setState({
                    timeLeft: timeLeft - 1
                })
            }
        }, 1000);
    }

    componentDidMount = async() => {
        const {userGuid} = this.props.match.params;
        if (typeof userGuid === "string" && userGuid) {
            const res = await accountApi.confirmEmail({userGuid});
            if (res) {
                if (res.success){
                    this.setState({status: statuses.isSuccessful});
                    this.goToHomeInSeconds(secondsUntilRedirect);
                    return;
                }
                
                if (res.msg){
                    this.setState({
                        msg: res.msg
                    })
                }
            }

            this.setState({status: statuses.isFailure});
        }
    }

    render() {
        const {status, timeLeft, msg} = this.state;

        if (timeLeft === 0) {
            return <Redirect to="/"/>
        }

        const {isWorking, isSuccessful, isFailure} = statuses;

        if (status === isWorking) {
            return <Spinner/>
        } else if (status === isFailure) {
            const msgShown = msg ? msg : "Error";
            return <Snackbarr msgShown={`${msgShown}. Please re-try`}/>
        }

        const redirectWarning = `Redirecting in ${timeLeft} seconds...`;

        return <Snackbarr
            msgShown={`Email confirmed! ${redirectWarning}`}
            myVariant="success"/>
    }
}
