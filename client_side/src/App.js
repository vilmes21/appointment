import React, { Component } from 'react';
import './App.css';
import axios from "axios";

// import MyCalendar from "./components/MyCalendar"
import Layout from "./components/Layout"

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

        <Layout />
      </div>
    );
  }
}

export default App;


//============
