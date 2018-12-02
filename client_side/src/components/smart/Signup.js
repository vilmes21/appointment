import React from 'react';
import {signup} from 'actions/users'
import {connect} from 'react-redux';
import {addError} from 'actions/errors';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom'
import isAuthed from 'helpers/isAuthed'
import Redirect from 'react-router-dom/Redirect';

class Signup extends React.Component {
    state = {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
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
        const toSend = {...this.state}
        this.clearSensitive();

        await this
            .props
            .signup(toSend);
    }

    render = () => {
        const {authenticated} = this.props;

        if (authenticated) {
            return <Redirect to="/"/>
        }
        
        return (
            <div className="wrapLoginformxc">
                <form action="" method="post" onSubmit={this.handleSubmit}>

                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            label="First name"
                            name="firstname"
                            onChange={this.handleChange}
                            value={this.state.firstname}/>
                    </div>

                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            label="Last name"
                            name="lastname"
                            onChange={this.handleChange}
                            value={this.state.lastname}/>
                    </div>

                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            type="email"
                            label="Email"
                            name="email"
                            onChange={this.handleChange}
                            value={this.state.email}/>
                    </div>

                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            label="Phone"
                            name="phone"
                            onChange={this.handleChange}
                            value={this.state.phone}/>
                    </div>

                    <div >
                        <TextField
                            required
                            fullWidth={true}
                            label="Create a password"
                            type="password"
                            name="password"
                            onChange={this.handleChange}
                            value={this.state.password}/>
                    </div>

                    <div className="subformbtnParenxg">
                        <Button type="submit" variant="raised">
                            Create Account
                        </Button>
                    </div>
                </form>

                <div className="noaccYetdu">
                    <Link to="/login">Already a user?</Link>
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

export default connect(mapState, {signup, addError})(Signup)