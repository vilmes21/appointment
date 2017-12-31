import React from 'react';
import axios from "axios";

class MyAccount extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      phone: ""
    }
  }

  componentDidMount() {
    const _this = this;
    console.log("func componentDidMount of MyAccount comp");
    axios
      .get("users/me")
      .then((res) => {
        if (res.data) {
          _this.setState({email: res.data.email, phone: res.data.phone})
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    const _this = this;
    return (
      <div >
        <h1>
          MyAccount Component here
        </h1>
        <div>
          my email: {_this.state.email}
        </div>
        <div>
          my phone: {_this.state.phone}
        </div>
      </div>
    );
  }
}

export default MyAccount;