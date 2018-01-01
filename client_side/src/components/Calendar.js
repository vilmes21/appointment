import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from "axios";


// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

class Calendar extends Component {
  constructor(){
    super();
    this.state = {
      myEventsList: []
    }
  }

  componentDidMount(){
    const _this = this;

    console.log("func componentDidMount of Calendar comp, gonna GET " + "/availabilities/" + _this.props.location.drId);

    axios.get("availabilities/" + _this.props.location.drId)
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

  createAppointment(newAppointment){
    const _this = this;

    axios.post("appointments/create", newAppointment)
    .then((res) => {
      console.log(res.data);

      if (!res.data){
        return false;
      }
    })
    .catch((err) => {
      console.log("axios catch block, err >>>", err);
    })
  }

  render(){
    const _this = this;
    
    return (
      <div>
                costum prop1: {_this.props.location.drId} <br/>
        <BigCalendar
          events={this.state.myEventsList}
          defaultView='week'
          selectable
          step={5} //slots are 5 minute increments
          // timeslots={5}
          // allDayAccessor={() => {return false;}}
          min={new Date("2017-12-30 09:00:00")}
          max={moment(new Date()).add(9, "hours").toDate()}
          // scrollToTime={new Date(2017, 11, 19, 6)}
          scrollToTime={moment().toDate()}
          defaultDate={moment().toDate()}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={(slotInfo) => {
            console.log(" slotInfo.start >>>", slotInfo.start);
            var wish_end_at = moment(slotInfo.start).add(5, 'minutes').toDate();;

            const confirmMsg = "Continue to book appointment? \n" + "start: " + slotInfo.start.toLocaleString() + "\nend: " + wish_end_at.toLocaleString();

            if (!window.confirm(confirmMsg)){
              return;
            }

            let newAppointment = {
              doctor_id : _this.props.location.drId,
              wish_start_at : slotInfo.start,
              wish_end_at : wish_end_at
          }

          _this.createAppointment(newAppointment);
            
          }
        }
        />
      </div>
    );
  }
}

export default Calendar;