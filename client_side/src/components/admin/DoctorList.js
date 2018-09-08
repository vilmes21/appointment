import React from 'react';
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom'

export default class DoctorList extends React.Component {
  state = {
    drs: [],
    blockNonAdminAuth: false
  }
  
  componentDidMount(){
    const _this = this;
    
    console.log("did mount fun of admin-DocList comp");

    axios.get("/admin/doctors")
    .then((res) => {
      if (!res.data){
        return false;
      }
      console.log(res.data);

      // if (res.data.nonAdminAuth){
      //   _this.setState({
      //     blockNonAdminAuth: true
      //   })
      //   return;
      // }

      if (res.data.serverBadAuth){
        _this.props.reactLogOut("yow admin pg asks you to log in");
        return;
      } 
      //TODO: re-arrange logic considering:
      /*
      auth false;
      auth true, but admin false;
      auth true, admin true;
      */

      _this.setState({
        drs: res.data
      })
      
      return true;
    })
    .catch((err) => {
      console.log("axios catch block, err >>>", err);
    })
  }
  
  render(){
    const _this = this;

    let comp;

    let may_list = null;

    if (_this.state.blockNonAdminAuth){
      window.alert("You are logged in but not admin");
      comp = <Redirect to="/my_account" />;
    } else {

        if (_this.state.drs.length > 0){
          
          may_list = 
          _this.state.drs.map((dr) => {

            let may_public = null;
            if (!dr.is_public){
              may_public = <strong>(Not visible to public)</strong>;
            }

            console.log("is this dr public? >>>", dr.is_public);
            
            return (
              <div key={dr.id}>
              {dr.firstname} {dr.lastname} {may_public}
                <Link 
                    to={"/admin/appointment/" + dr.lastname} >
                  <button>view bookings</button>
                </Link>

                <Link 
                    to={"/admin/availability/" + dr.lastname} >
                  <button>set availability</button>                  
                </Link>
                <hr/>
              </div>
            );
          }); //closing map
        }
      
        comp = 
          <div>
            <h2>admin, Set availability for </h2>
            {may_list}
          </div>
    } //closing else

    return (
      <div>
        {comp}
      </div>
    );
  }
}