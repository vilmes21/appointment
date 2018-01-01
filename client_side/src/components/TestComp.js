import React from 'react';
import axios from "axios";

class TestComp extends React.Component {
  constructor(){
    super();
  }

  render(){
    const _this = this;

    console.log(this.props)

    return (
      <div>
        I am test Component, prop1: {_this.props.location.param1} <br/>
        prop2:  {_this.props.location.foo} <br/>
        pathname: {_this.props.match.pathname} <br/>
        fei: {_this.props.match.params.fei}
      </div>
    );
  }
}

export default TestComp;