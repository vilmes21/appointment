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

import Signup from 'components/smart/Signup';
import Login from "components/smart/Login"
import TopError from "components/smart/TopError"
import MyAccount from './MyAccount';
import Logout from "components/smart/Logout"
import DoctorList from "./smart/DoctorList"
import TestComp from "./TestComp"
import Calendar from './smart/Calendar';
import NoMatch from './NoMatch';
import Spinner from './Spinner';

//BEGIN admin imports
import AdminDoctorList from "./admin/DoctorList"
import AdminAvailability from "./admin/Availability"
import AdminAppointment from "./admin/Appointment"
//END admin imports

class Layout extends React.Component {
state = {
    authenticated: true,
    isAdmin: true,
    msg: "",
    isLoading: true
  }

  componentDidMount=()=>{

    const _this = this;
    
    //BEGIN check auth w/ server whenever this component renders
    axios.get("/auth/now")
    .then((res) => {
      
      if (!res.data){
        return false;
      }

      _this.setState({
        authenticated: res.data.auth,
        // isAdmin: res.data.isAdmin, //TODO: to set
        msg: "new pg load auth check done",
        isLoading: false
      });
    })
    .catch((err) => {
      console.log("axios catch block, err >>>", err);
    })
    //END check auth w/ server whenever this component renders
  }

  popMsg =(x)=>{ //currently not used func
    this.setState({
      msg: x 
    })
  }

  reactLogOut =(msg="You've logged out.") => {
    this.setState({
      authenticated: false,
      msg: msg
    })
  }

  devLogin =() => {
    const _this = this;
    
    axios.post("/devlogin")
    .then((res) => {
      
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

  render =() =>{
    const _this = this;

    if (_this.state.isLoading){
      return <Spinner />;
    } 

    let comp;
      let myAccountLink = null;
      let loginAndSignupLink = null;

      //BEGIN for admin
      let may_adminDrListLink = null;
      let may_adminDrList = null;
      let may_adminSetAvailability = null;
      let may_adminAppointment = null;
      
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

        may_adminAppointment = 
                          <Route 
                          path="/admin/appointment/:drUrlName"
                          render={ (props) => (
                            <AdminAppointment
                              reactLogOut={_this.reactLogOut}
                              {...props} />
                          )
                          } 
                          />;
        
      } //closing if isAdmin authed

      //END for admin
  
      if (_this.state.authenticated){

        myAccountLink = <li><Link to="/my_account">MyAccount</Link></li>;
        

      } else {

        loginAndSignupLink = 
          <span>
            <li><Link to="/sign_up">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </span>;

      }
  
      comp =      
      <div>
        <Logout />
        <TopError />
      <button onClick={_this.devLogin}>DEV login</button>
      
        <Router>
        <div>
          <ul>
            {may_adminDrListLink}
            <li><Link to="/doctors">Doctors</Link></li>
            {loginAndSignupLink}
            {myAccountLink}
          </ul>
          <hr/>
    <Switch>
          <Route exact path="/doctors" component={DoctorList}/>
          <Route exact path="/" render={() => (<Redirect to="/login" />)} />
          <Route 
                path="/sign_up" 
                render={
                  ()=> <Signup  popMsg={_this.popMsg} />
                } />

          <Route 
                path="/login" 
                render={  () => <Login 
                                 />  }/>

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
          {may_adminAppointment}

          <Route path="*" component={NoMatch} /> 
    </Switch>
        </div>

     
      </Router>

    </div>;
    
    return (
      <div>
        {comp}
      </div>
    );
  }
}

export default Layout;