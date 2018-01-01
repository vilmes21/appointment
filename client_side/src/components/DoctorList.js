import React from 'react';
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import DrCalendar from "./DrCalendar"
import Calendar from "./Calendar"
import TestComp from "./TestComp"

class DoctorList extends React.Component {
  constructor(){
    super();
    this.state = {
      drs: []
    }
  }

  componentDidMount(){
    const _this = this;
    
    console.log("did mount fun of DocList comp");

    axios.get("doctors/index")
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
            const linkData = {
              pathname: "/calendar/Dr_" + dr.lastname,
              drId: dr.id
            };

            return (
              <DrCalendar
                    key={dr.id}        
                    linkData={linkData}
                    dr={dr}
                        />
            );
          })
        }
      </div>
    );
  }
}

export default DoctorList;