import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from "axios";

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
  constructor(){
    super();
    this.state = {
      myEventsList: [],
      dayChosen: new Date()
    }
  }

  componentDidMount(){
    const _this = this;

    console.log("func componentDidMount of Calendar comp, gonna GET " + "/availabilities/" + _this.props.location.drId);

    axios.get("/availabilities/" + _this.props.location.drId)
    .then((res) => {
      console.log("axios res.data >>>", res.data);
      if (!res.data){
        return false;
      }

      let clone = [...res.data];

      for (let c of clone){
        c.start = new Date(c.start);
        c.end = new Date(c.end);
      }

      _this.setState({
        myEventsList: clone
      })
    })
    .catch((err) => {
      console.log("axios catch block, err >>>", err);
    })
  }

  createAppointment(newAppointment){
    const _this = this;

    axios.post("/appointments/create", newAppointment)
    .then((res) => {
      console.log(res.data);

      if (!res.data){
        return false;
      }

      //BEGIN visiually add slot:
      let clone = [..._this.state.myEventsList];

      console.log("clone >>>", clone);
      
      clone.push({
        title: "My new appointment!",
        start: newAppointment.wish_start_at,
        end: newAppointment.wish_end_at
      });

      console.log("before return clone >>>", clone);
      
      _this.setState({
        myEventsList: clone
      });
      //END visiually add slot:
      
    })
    .catch((err) => {
      console.log("axios catch block, err >>>", err);
    })
  }

  handleNavigate(focusDate, flipUnit, prevOrNext) {
    //note: `focusDate` param isn't useful.
    const _this = this;
      
      //BEGIN restrict patients to view only this week + next
      const now = new Date();
      const nowNum = now.getDate();
      const nextWeekToday = moment().add(7, "day").toDate();
      const nextWeekTodayNum = nextWeekToday.getDate();
      
      if (prevOrNext === "NEXT" 
          && _this.state.dayChosen.getDate() === nowNum){
            _this.setState({
              dayChosen: nextWeekToday
            });
      } else if (prevOrNext === "PREV" 
      && _this.state.dayChosen.getDate() === nextWeekTodayNum){
        _this.setState({
          dayChosen: now
        });
      }
      //END restrict patients to view only this week + next
      
    }

  render(){
    const _this = this;
    
    return (
      <div>
        <BigCalendar
          events={this.state.myEventsList}
          defaultView='week'
          views={['week', 'agenda']}
          selectable
          step={5} 
          //`step` slots are 5 minute increments, but doesn't matter in our case because we only offer inital select start + 5 min

          timeslots={1}
          //`timeslots` works with `step`. since `step` is 5, meaning for e.g. 8:00 - 8:05, then visually that is only ONE slot.
          
          messages={
            {
              allDay: "", 
              week: "calendar",
              agenda: "my appointments"
            }
          }
          
          min={new Date("2017-12-27 09:00:00")}
          max={
            moment(new Date("2017-12-27 09:00:00")).add(9, "hours").toDate()
          }

          // defaultDate={moment().toDate()}

          date={_this.state.dayChosen}

          onNavigate={(focusDate, flipUnit, prevOrNext) => {
            _this.handleNavigate(focusDate, flipUnit, prevOrNext);
          }}

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