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
import Logout from "./Logout"

class Layout extends React.Component {
  constructor(){
    super();
    this.state = {
      authenticated: false,
      msg: ""
    }

    this.reactLogIn = this.reactLogIn.bind(this);
    this.reactLogOut = this.reactLogOut.bind(this);
    this.popMsg = this.popMsg.bind(this);
  }

  popMsg(x){ //currently not used func
    this.setState({
      msg: x 
    })
  }

  reactLogIn(msg="Welcome back!"){
    this.setState({
      authenticated: true,
      msg: msg
    })
  }

  reactLogOut(){
    this.setState({
      authenticated: false,
    })
  }

  render(){
    const _this = this;

    let myAccountLink = null;
    let myAccountComp = null;
    let loginAndSignupLink = null;
    let loginAndSignupComps = null;
    let may_logout = null;

    if (_this.state.authenticated){
      myAccountLink = <li><Link to="/my_account">MyAccount</Link></li>;
      myAccountComp = <Route path="/my_account" component={MyAccount}/>;
      may_logout = <Logout reactLogOut={_this.reactLogOut} />;
    } else {
      loginAndSignupLink = 
        <span>
          <li><Link to="/sign_up">Signup</Link></li>
          <li><Link to="/login">Login</Link></li>
        </span>;

      loginAndSignupComps =
                <span>
                  <Route 
                        path="/sign_up" 
                        render={
                          ()=> <Signup reactLogIn={_this.reactLogIn} popMsg={_this.popMsg} />
                        } />
                  <Route 
                        path="/login" 
                        render={  () => <Login 
                                          reactLogIn={_this.reactLogIn} />  }/>
                </span> ;
    }
    
    return (

      <div>
          <Router>
          <div>
            <ul>
              <li><Link to="/">Appointments</Link></li>
              {loginAndSignupLink}
              {myAccountLink}
            </ul>
              {may_logout}
            <hr/>
      
            <Route exact path="/" component={Appointments}/>
            {loginAndSignupComps}
            {myAccountComp}

      
          </div>

       
        </Router>

      </div>
      
    );
  }
}

export default Layout;