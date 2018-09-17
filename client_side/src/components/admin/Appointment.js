//this file is retired. Sept 16, 2018

import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from "axios";
import {
  Redirect
} from 'react-router-dom'
import Slot from './Slot';

import helpers from '../../helpers'

BigCalendar.momentLocalizer(moment);

export default class Availability extends Component {
  constructor(){
    super();
    this.state = {
      booked: [],
      dayChosen: new Date(),
      detail: {
        title: "",
        start: "",
        end: "",
        id: null
      },
      detailOpen: false,
    }

    this.eventStyleGetter = this.eventStyleGetter.bind(this);
    this.closeDetail = this.closeDetail.bind(this);
  }
  
//====================================================================================

  componentDidMount(){
    const _this = this;

    const getUrl = "/admin/appointments/" + _this.props.match.params.drUrlName;

    console.log("func componentDidMount of admin/Appointment comp, gonna GET " + getUrl);

    axios.get(getUrl)
    .then((res) => {
      console.log(getUrl + " axios res.data >>>", res.data);
      if (!res.data){
        return false;
      }

      let clone = [...res.data];

      for (let c of clone){
        c.start = new Date(c.start);
        c.end = new Date(c.end);
      }

      // console.log("compo did mount fn. clone >>> ", clone);

      _this.setState({
        booked: clone
      })
    })
    .catch((err) => {
      console.log("axios catch block, err >>>", err);
    })
  }

//====================================================================================

closeDetail(){
  this.setState({detailOpen: false});
}

//====================================================================================

cancelAppointment(id){
  alert("cancelling appm id >>", id);
  if (id != parseInt(id)){
    alert("Appointment id missing. Halt");
    return;
  }

  axios.post("/appointments/cancel/" + id)
  .then((res) => {
    
    if (!res.data){
      return false;
    }
  })
  .catch((err) => {
    console.log("axios catch block, err >>>", err);
  })
}

//====================================================================================

    eventStyleGetter(event, start, end, isSelected) {
       console.log("faire rien func eventStyleGetter");
  }

//====================================================================================
  
    render(){
    const _this = this;

    // if (!_this.props.authenticated){
    //   console.log("in Calendar render func. gonna Redirect comop")
    //   return <Redirect to="/login" />;
    // }

    return (
      <div>
        <Slot 
          open={_this.state.detailOpen}
          closeDetail={_this.closeDetail}
          detail={_this.state.detail}
          cancelAppointment={_this.cancelAppointment}
          />
        <h1>
          Appointments with Dr. {_this.props.match.params.drUrlName}
        </h1>
        
        <BigCalendar
          events={this.state.booked}
          defaultView='week'
          views={['week', 'day']}
          selectable
          step={5} 

          timeslots={1}
          
          messages={
            {
              allDay: "", 
              week: "calendar"
            }
          }
          
          min={new Date("2017-12-27 07:00:00")}
          max={
            moment(new Date("2017-12-27 07:00:00")).add(12, "hours").toDate()
          }

          defaultDate={new Date()}

          eventPropGetter = {(event, start, end, isSelected)=>{
            
            let newStyle = {
              backgroundColor: "lightgrey",
              color: 'black',
              borderRadius: "0px",
              border: "none"
          };

            return {
              className: "",
              style: newStyle
            };
          }}

          onSelectEvent={event => {
            // alert("start: " + event.start + "\nend: " + event.end + "\n" + event.title);

            _this.setState({
              detailOpen: true,
              detail: {
                title: event.title,
                start: event.start.toString(), //make sure it's just a string, not Date obj
                end: event.end.toString(),
                id: event.id
              }
            },
            ()=> {console.log("sss >>>", _this.state)}
          );
          }}

          formats={
            {
              eventTimeRangeFormat: () => {
                return "";
              }
            }
          }
          
        />
      </div>
    );
  }
}