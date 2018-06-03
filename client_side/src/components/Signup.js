import React from 'react';
import axios from "axios";
import {signup} from '../actions/users'
import { connect } from 'react-redux';

class Signup extends React.Component {
  state={
    mayDisableSubmit: false,
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: ""
  }

  handleChange = (ev) => {
    const _this = this;
    const obj = {};
    const _name = ev.target.name;
    obj[_name] = ev.target.value;

    ////real code: comment out when ready
    // if (
    //   _this.state.firstname.length > 0 
    //   && _this.state.lastname.length > 0 
    //   && _this.state.email.length > 0 
    //   && _this.state.phone.length > 0 
    //   && _this.state.password.length > 0 
    // ){
    //   obj.mayDisableSubmit = false;
    // }

    _this.setState(obj);
  }

  handleSubmit = (ev)=>{
    const _this = this;   
    
    ev.preventDefault();

    const res = this.props.signup(_this.state);

    if (res){
      console.log("res is ture")
      _this.props.reactLogIn();
    }
    
    // axios.post('/users/new', _this.state)
    // .then(function (response) {
    //   console.log(response.data);

    //   if (response.data && response.data.authenticated){
    //     _this.props.reactLogIn()
    //   }
      
    //   if (false) {  // TODO: if user successfully created and logged in in backend
    //     _this.props.reactLogIn();
    //   }
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  }
  
  render = ()=>{
    const _this = this;

    return (
      <div>
      <h1>
       Singup
      </h1>

      <form 
    action=""
    method="post"
    onSubmit={_this.handleSubmit}>

    <input 
        type="text"
        name="firstname"
        placeholder="firstname"
        onChange={_this.handleChange}
        value={_this.state.firstname}
            />
    <input 
        type="text"
        name="lastname"
        placeholder="lastname"
        onChange={_this.handleChange}   
        value={_this.state.lastname}             
        />
    <input 
        type="text"
        // type="email" ////uncomment when ready
        name="email"
        placeholder="email"
        onChange={_this.handleChange}    
        value={_this.state.email}            
        />

    <input 
        type="text"
        name="phone"
        placeholder="phone"
        onChange={_this.handleChange}        
        value={_this.state.phone}        
        />

    <input 
        type="password"
        name="password"
        placeholder="create a password"
        onChange={_this.handleChange}        
        value={_this.state.password}        
            />

    <input type="submit" 
            value="Create Account"
            disabled={_this.state.mayDisableSubmit} />
      </form>
      
      </div>
    );
  }
}

export default connect(null, {signup})(Signup)