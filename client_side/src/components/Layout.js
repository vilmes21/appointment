import React from 'react';
// import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from 'react-router-dom';
// import { Switch } from 'react-router';


import Appointments from './Appointments';
import Signup from './Signup';
import Login from "./Login"
import MyAccount from './MyAccount';
import Logout from "./Logout"
import DoctorList from "./DoctorList"
import TestComp from "./TestComp"
import Calendar from './Calendar';
import NoMatch from './NoMatch';


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
    const _this = this;

    this.setState({
      authenticated: true,
      msg: msg
    }, 
  () => {
    console.log("in Layout, state >>>", _this.state);
  })
  }

  reactLogOut(){
    this.setState({
      authenticated: false,
    })
  }

  // forceLogin(msg){
  //   this.setState({
  //     authenticated: false,
  //     msg: msg
  //   })
  // }

  render(){
    const _this = this;

    console.log("inside Layout render func, _this.state >>>", _this.state);

    let myAccountLink = null;
    let loginAndSignupLink = null;
    let may_logout = null;

    if (_this.state.authenticated){
      myAccountLink = <li><Link to="/my_account">MyAccount</Link></li>;
      may_logout = <Logout reactLogOut={_this.reactLogOut} />;
    } else {
      loginAndSignupLink = 
        <span>
          <li><Link to="/sign_up">Signup</Link></li>
          <li><Link to="/login">Login</Link></li>
        </span>;
    }

    const test1 = {
      pathname: "/testt", 
      param1: "Par12" ,
      foo: "bar"
    }
    
    return (

      <div>
          <Router>
          <div>
            <ul>
              <li><Link to="/testt">test</Link></li>
              <li><Link to="/doctors">Doctors</Link></li>
              <li><Link to="/">Appointments</Link></li>
              {loginAndSignupLink}
              {myAccountLink}
            </ul>
              {may_logout}
            <hr/>
      <Switch>
            <Route exact path="/testt" component={TestComp}/>
            <Route exact path="/" component={Appointments}/>
            <Route exact path="/doctors" component={DoctorList}/>
            <Route exact path="/" render={() => (<Redirect to="/login" />)} />
            <Route 
                  path="/sign_up" 
                  render={
                    ()=> <Signup reactLogIn={_this.reactLogIn} popMsg={_this.popMsg} />
                  } />

            <Route 
                  path="/login" 
                  render={  () => <Login 
                                    reactLogIn={_this.reactLogIn} />  }/>

            <Route path="/my_account" component={MyAccount}/>

            <Route 
                  path="/calendar/:dr_name"
                  component={ () => (
                    <Calendar authenticated={_this.state.authenticated}/>)
                  } />;
            
            <Route path="*" component={NoMatch} /> 
      </Switch>
          </div>

       
        </Router>

      </div>
      
    );
  }
}

export default Layout;