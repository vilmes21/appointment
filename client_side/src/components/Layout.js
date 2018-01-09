import React from 'react';
import axios from "axios";
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
import Spinner from './Spinner';

//BEGIN admin imports
import AdminDoctorList from "./admin/DoctorList"
import AdminAvailability from "./admin/Availability"
//END admin imports

class Layout extends React.Component {
  constructor(){
    super();
    this.state = {
      authenticated: true,
      isAdmin: true,
      msg: "",
      isLoading: true
    }

    this.reactLogIn = this.reactLogIn.bind(this);
    this.reactLogOut = this.reactLogOut.bind(this);
    this.popMsg = this.popMsg.bind(this);
    this.devLogin = this.devLogin.bind(this);
  }

  componentDidMount(){

    const _this = this;
    
    //BEGIN check auth w/ server whenever this component renders
    axios.get("/auth/now")
    .then((res) => {
      console.log("axios then block, res >>>", res);
      
      if (!res.data){
        return false;
      }

      _this.setState({
        authenticated: res.data.auth,
        // isAdmin: res.data.isAdmin, //TODO: to set
        msg: "new pg load auth check done",
        isLoading: false
      }, () => {
        console.log("after initial auth check, state >>>", _this.state);
      });
    })
    .catch((err) => {
      console.log("axios catch block, err >>>", err);
    })
    //END check auth w/ server whenever this component renders
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

  reactLogOut(msg="You've logged out."){
    this.setState({
      authenticated: false,
      msg: msg
    })
  }

  // forceLogin(msg){
  //   this.setState({
  //     authenticated: false,
  //     msg: msg
  //   })
  // }

  devLogin(){
    const _this = this;
    
    axios.post("/devlogin")
    .then((res) => {
      console.log("axios then block, res.data >>>", res.data);
      
      if (!res.data){
        return false;
      }

      _this.setState({
        authenticated: true
      })

    })
    .catch((err) => {
      console.log("axios catch block, err >>>", err);
    })
  }

  render(){
    const _this = this;

    console.log("inside Layout render func, _this.state >>>", _this.state);

    let comp;
    if (_this.state.isLoading){

      comp = <Spinner />;

    } else {

      let myAccountLink = null;
      let loginAndSignupLink = null;
      let may_logout = null;

      //BEGIN for admin
      let may_adminDrListLink = null;
      let may_adminDrList = null;
      let may_adminSetAvailability = null;
      
      if (_this.state.authenticated && _this.state.isAdmin){

        may_adminDrListLink = <li><Link to="/admin/doctors">admin-View Doctors</Link></li>;

        may_adminDrList = 
                          <Route 
                          exact
                          path="/admin/doctors"
                          render={ (props) => (
                            <AdminDoctorList 
                              reactLogOut={_this.reactLogOut}/>
                          )
                          } 
                          />;

        may_adminSetAvailability = 
                          <Route 
                          path="/admin/availability/:drUrlName"
                          render={ (props) => (
                            <AdminAvailability 
                              reactLogOut={_this.reactLogOut}
                              {...props} />
                          )
                          } 
                          />;
        
      } //closing if isAdmin authed

      //END for admin
  
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
      
      comp =      
      <div>
      <button onClick={_this.devLogin}>DEV login</button>
      
        <Router>
        <div>
          <ul>
            {may_adminDrListLink}
            <li><Link to="/doctors">Doctors</Link></li>
            {loginAndSignupLink}
            {myAccountLink}
          </ul>
            {may_logout}
          <hr/>
    <Switch>
          {/* <Route exact path="/testt" component={TestComp}/> */}
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
                path="/calendar/:drUrlName"
                render={ (props) => (
                  <Calendar 
                      authenticated={_this.state.authenticated}
                      reactLogOut={_this.reactLogOut}
                      {...props} />)
                } 
                />;

          {may_adminDrList}
          {may_adminSetAvailability}

          <Route path="*" component={NoMatch} /> 
    </Switch>
        </div>

     
      </Router>

    </div>;
    }
    
    return (
      <div>
        {comp}
      </div>
    );
  }
}

export default Layout;