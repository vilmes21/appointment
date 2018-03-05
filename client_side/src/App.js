import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// import axios from "axios";

// import MyCalendar from "./components/MyCalendar"
import Layout from "./components/Layout"

class App extends Component {

  constructor(){
    super();
  }

  render() {
    return (
      <MuiThemeProvider>
   <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Appointments</h1>
        </header>

        <Layout />
      </div>
    </MuiThemeProvider>
   
    );
  }
}

export default App;


//============
