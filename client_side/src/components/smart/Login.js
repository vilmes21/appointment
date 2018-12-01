import React from 'react';
import {loginVerify} from 'actions/users'
import {addError} from 'actions/errors'
import {connect} from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import isAuthed from 'helpers/isAuthed'
import { Link } from 'react-router-dom'

class Login extends React.Component {
    state = {
        username: "",
        password: ""
    }

    handleChange = (ev) => {
        const _this = this;
        const obj = {};
        const _name = ev.target.name;
        obj[_name] = ev.target.value;

        _this.setState(obj);
    }

    handleSubmit = async(ev) => {
        const _this = this;
        ev.preventDefault();
        await _this
            .props
            .loginVerify(_this.state);

    }

    render() {
        const _this = this;
        const {authenticated} = _this.props;

        if (authenticated) {
            return <h2>Already logged in</h2>;
        }

        return (
            <div className="wrapLoginformxc">
                <form onSubmit={_this.handleSubmit} action="/login" method="post">

                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            label="Email"
                            value={_this.state.username}
                            onChange={_this.handleChange}
                            name="username"/>
                    </div>

                    <div>
                        <TextField
                            required
                            fullWidth={true}
                            label="Password"
                            value={_this.state.password}
                            onChange={_this.handleChange}
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