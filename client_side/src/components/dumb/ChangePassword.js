import React from 'react';

export default class ChangePassword extends React.Component {
    state = {
        current: "",
        neww: "",
        confirmation: ""
    }

    handleChange = ev => {
        const {name, value} = ev.target;
        this.setState({[name]: value})
    }

    handleSubmit = ev => {
        ev.preventDefault();
        console.log("submitting")
    }

    render() {
        const {current, neww, confirmation} = this.state;
        const disableConfirmation = neww.length === 0;
        const isConfirmationSame = neww === confirmation;
        const warnBadConfirmation = confirmation.length > 0 && !isConfirmationSame;
        const canSubmit = current.length > 0 && neww.length > 0 && isConfirmationSame;

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <input
                            value={current}
                            onChange={this.handleChange}
                            name="current"
                            placeholder="Current password"
                            type="password"/>
                    </div>
                    <div>
                        <input
                            value={neww}
                            onChange={this.handleChange}
                            name="neww"
                            placeholder="New password"
                            type="password"/>
                    </div>
                    <div>
                        <input
                            value={confirmation}
                            onChange={this.handleChange}
                            name="confirmation"
                            placeholder="Confirm new password"
                            type="password"
                            disabled={disableConfirmation}/>

                        <div>
                            {warnBadConfirmation && <div className="dangerRed">Does not match</div>
}
                        </div>
                    </div>

                    <div>
                        <input type="submit" value="Change" disabled={!canSubmit}/>
                    </div>
                </form>
            </div>
        )
    }
}
