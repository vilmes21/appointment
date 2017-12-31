import React from 'react';
import axios from "axios";

class Logout extends React.Component {
  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    axios('/logout')
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  render(){
    const _this = this;
    return (
      <div>
      <button onClick={_this.handleClick}>
        Log out!
      </button>
      <button onClick={_this.props.reactLogOut}>
        Fake Log out!
      </button>
      </div>
    );
  }
}

export default Logout;