import React from 'react';
import axios from "axios";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: ""
    }

    this.handleChange = this
      .handleChange
      .bind(this);
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
  }

  handleChange(ev) {
    const _this = this;
    const obj = {};
    const _name = ev.target.name;
    obj[_name] = ev.target.value;

    _this.setState(obj);
  }

  handleSubmit(ev) {
    const _this = this;

    ev.preventDefault();

    console.log("in handleSubit, _this.state >>>", _this.state);

    axios
      .post('/login', _this.state)
      .then(function (response) {
        console.log(response.data);
        if (response.data.success) {
          // TODO: if logged in in backend
          _this
            .props
            .reactLogIn();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const _this = this;

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

        <button onClick={_this.props.reactLogIn}>
          Fake login
        </button>

      </div>
    );
  }
}

export default Login;