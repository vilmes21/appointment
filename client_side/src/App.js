import React, { Component } from 'react';
import './App.css';
import axios from "axios";

class App extends Component {

  constructor(){
    super();
    this.state = {
      msg: null
    }

    this.fetchMsg = this.fetchMsg.bind(this);
  }
  
  fetchMsg(){
    const _this = this;
    
    axios.get('/hi')
    .then(function (response) {
      console.log(response);
      _this.setState({
        msg: response.data[0].yow
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Appointments</h1>
        </header>

        <h1>{this.state.msg}</h1>

        <h2 onClick={this.fetchMsg}>
          Click to axios GET
        </h2>
      </div>
    );
  }
}

export default App;


//============
