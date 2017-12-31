import React from 'react';
// import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Appointments from './Appointments';
import Signup from './Signup';
import Login from "./Login"
import MyAccount from './MyAccount';

class Layout extends React.Component {
  constructor(){
    super();
    this.state = {
      authenticated: false,
    }

    this.reactLogIn = this.reactLogIn.bind(this);
  }

  reactLogIn(){
    this.setState({
      authenticated: true,
    })
  }

  render(){
    const _this = this;

    let myAccountLink = null;
    let loginAndSignupLink = null;
    
    if (_this.state.authenticated){
      myAccountLink = <li><Link to="/my_account">MyAccount</Link></li>;
    } else {
      loginAndSignupLink = 
        <span>
          <li><Link to="/sign_up">Signup</Link></li>
          <li><Link to="/login">Login</Link></li>
        </span>;
    }
    
    return (

      <Router>
      <div>
        <ul>
          <li><Link to="/">Appointments</Link></li>
          {loginAndSignupLink}
          {myAccountLink}
        </ul>
  
        <hr/>
  
        <Route exact path="/" component={Appointments}/>
        <Route path="/sign_up" component={Signup} />
        <Route 
              path="/login" 
              render={  () => <Login reactLogIn={_this.reactLogIn}/>  }/>
        <Route path="/my_account" component={MyAccount}/>
      </div>
    </Router>
      
    );
  }
}

export default Layout;