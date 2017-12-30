import React, { Component } from 'react';
import './App.css';
import axios from "axios";
// import MyCalendar from "./components/MyCalendar"
import Login from "./components/Login"
import Logout from "./components/Logout"

class App extends Component {

  constructor(){
    super();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Appointments</h1>
        </header>

        <Login />
        <Logout />
      </div>
    );
  }
}

export default App;


//============
