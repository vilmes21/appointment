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
        :drUrlName >>> {_this.props.match.params.drUrlName} <br/>
        id:  {_this.props.location.id} <br/>
      </div>
    );
  }
}

export default TestComp;