import React from 'react';
import axios from "axios";

export default class Availability extends React.Component {
  // constructor(){
  //   super();
  // }
 
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