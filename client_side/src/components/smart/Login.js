import React from 'react';
import {loginVerify} from 'actions/users'
import {addError} from 'actions/errors'
import {connect} from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import isAuthed from 'helpers/isAuthed'
import {Link} from 'react-router-dom'
import Redirect from 'react-router-dom/Redirect';

class Login extends React.Component {
    state = {
        username: "",
        password: ""
    }

    clearSensitive = () => {
        this.setState({password: ""})
    }

    handleChange = (ev) => {
        const obj = {};
        const _name = ev.target.name;
        obj[_name] = ev.target.value;

        this.setState(obj);
    }

    handleSubmit = async(ev) => {
        ev.preventDefault();
        const toSend = {...this.state};
        this.clearSensitive();
        await this
            .props
            .loginVerify(toSend);
    }

    render() {
        const {authenticated, location} = this.props;

        const {from} = location.state || {from: {pathname: "/"}}

        if (authenticated) {
            return <Redirect to={from}/>
        }

        return (
            <div className="wrapLoginformxc">
                <form onSubmit={this.handleSubmit} action="/login" method="post">

                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            label="Email"
                            value={this.state.username}
                            onChange={this.handleChange}
                            name="username"/>
                    </div>

                    <div>
                        <TextField
                            required
                            fullWidth={true}
                            label="Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                            name="password"/>
                    </div>

                    <div className="subformbtnParenxg">
                        <Button type="submit" variant="raised">
                            Log in
                        </Button>
                    </div>

                </form>

                <div className="noaccYetdu">
                    <Link to="/sign_up">No account yet?</Link>
                </div>
            </div>
        );
    }
}

const mapState = (state) => {
    return {
        authenticated: isAuthed(state.currentUser)
    };
}

export default connect(mapState, {loginVerify, addError})(Login);