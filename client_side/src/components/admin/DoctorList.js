import React from 'react';
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class DoctorList extends React.Component {
  constructor(){
    super();
    this.state = {
      drs: []
    }
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

    return (
      <div>
        {
          _this.state.drs.map((dr) => {

            let may_public = null;
            if (!dr.is_public){
              may_public = <strong>(Not visible to public)</strong>;
            }

            console.log("is this dr public? >>>", dr.is_public);
            
            return (
              <div key={dr.id}>
                <Link 
                    to={"/admin/availability/" + dr.lastname} >
                  {dr.firstname} {dr.lastname} {may_public}
                </Link>
                <hr/>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default DoctorList;