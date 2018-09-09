import React, {Component} from 'react';
import './App.css';
import store from './store'
import {Provider} from 'react-redux'

// import axios from "axios"; import MyCalendar from "./components/MyCalendar"
import Layout from "components/smart/Layout"

class App extends Component {
  
  render() {
    return (
      <Provider store={store}>
          <Layout/>
      </Provider>

    );
  }
}

export default App;

//============