import React from 'react';
import axios from "axios";
import MyCalendar from "./MyCalendar"

class Appointments extends React.Component {
  constructor(){   super();
    this.state = {
      bookedOnes: []
    }
   }

  componentDidMount(){
    console.log("func componentDidMount of Appointment comp");

    axios.get("availabilities/211") //TODO: actually pass in doctor id
    .then((res) => {
      console.log("axios res.data >>>", res.data);
      if (!res.data){
        return false;
      }
    })
    .catch((err) => {
      console.log("axios catch block, err >>>", err);
    })
  }
  
  render() {
    const _this = this;
    return (
      <div >
        <h1>
          Appointments Component here
        </h1>
        <MyCalendar bookedOnes={_this.state.bookedOnes} />
      </div>
    );
  }
}

export default Appointments;