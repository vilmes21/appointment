import React, {Component} from 'react';
import './App.css';
import store from './store'
import {Provider} from 'react-redux'

// import axios from "axios"; import MyCalendar from "./components/MyCalendar"
import Layout from "./components/Layout"

class App extends Component {

  
  render() {
    return (
      <Provider store={store}>
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Welcome to Appointments</h1>
            </header>

            <Layout/>
          </div>
      </Provider>

    );
  }
}

export default App;

//============