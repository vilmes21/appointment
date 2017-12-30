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
      <div 
      onClick={_this.handleClick}      
      >
      <h1>
        Log out!
      </h1>
      </div>
    );
  }
}

export default Logout;