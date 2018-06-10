import React from 'react';
import axios from "axios";
import {loginVerify} from 'actions/users'
import {connect} from 'react-redux';

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

  handleSubmit =(ev)=> {
    const _this = this;

    ev.preventDefault();

    const res = _this.props.loginVerify(_this.state);

    console.log("hadnle sub, res ???", res)

    if (!res.success){
      alert(res.msg);
    }
  }

  render() {
    const _this = this;
    const {authenticated} = _this.props;

    if (authenticated){
      return <h2>Already logged in</h2>;
    }

    return (
      <div>
        <form onSubmit={_this.handleSubmit} action="/login" method="post">
          <div>
            <label>Username:</label>
            <input
              value={_this.state.username}
              onChange={_this.handleChange}
              type="text"
              name="username"/>
          </div>
          <div>
            <label>Password:</label>
            <input
              value={_this.state.password}
              onChange={_this.handleChange}
              type="password"
              name="password"/>
          </div>
          <div>
            <input type="submit" value="Log In"/>
          </div>
        </form>

      </div>
    );
  }
}

const mapState = (state) => {
  return {authenticated: !!state.currentUser && !!state.currentUser.email};
}

export default connect(mapState, { loginVerify })(Login);