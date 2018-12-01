import React from 'react';
import {signup} from 'actions/users'
import {connect} from 'react-redux';
import {addError} from 'actions/errors';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom'

class Signup extends React.Component {
    state = {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
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

        const res = await this
            .props
            .signup(_this.state);

        if (!res.success) {
            _this
                .props
                .addError(res.msg)
        }
    }

    render = () => {
        const _this = this;

        return (
            <div className="wrapLoginformxc">
                <form action="" method="post" onSubmit={_this.handleSubmit}>

                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            label="First name"
                            name="firstname"
                            onChange={_this.handleChange}
                            value={_this.state.firstname}/>
                    </div>

                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            label="Last name"
                            name="lastname"
                            onChange={_this.handleChange}
                            value={_this.state.lastname}/>
                    </div>

                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            type="email"
                            label="Email"
                            name="email"
                            onChange={_this.handleChange}
                            value={_this.state.email}/>
                    </div>

                    <div className="fieldeachhx">
                        <TextField
                            required
                            fullWidth={true}
                            label="Phone"
                            name="phone"
                            onChange={_this.handleChange}
                            value={_this.state.phone}/>
                    </div>

                    <div >
                        <TextField
                            required
                            fullWidth={true}
                            label="Create a password"
                            type="password"
                            name="password"
                            onChange={_this.handleChange}
                            value={_this.state.password}/>
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

export default connect(null, {signup, addError})(Signup)