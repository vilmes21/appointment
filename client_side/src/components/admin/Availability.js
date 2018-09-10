import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from "axios";
import {
  Redirect
} from 'react-router-dom'

import helpers from '../../helpers'

BigCalendar.momentLocalizer(moment);

export default class Availability extends Component {
  constructor(){
    super();
    this.state = {
      openSlots: [],
      dayChosen: new Date()
    }

    this.createAvailability = this.createAvailability.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleOnSelectSlot = this.handleOnSelectSlot.bind(this);
    this.eventStyleGetter = this.eventStyleGetter.bind(this);
  }
  
//====================================================================================

  componentDidMount(){
    const _this = this;

    console.log("func componentDidMount of Calendar comp, gonna GET " + "/admin/availabilities/" + _this.props.match.params.drUrlName);

    const getUrl = "/admin/availabilities/" + _this.props.match.params.drUrlName;

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
        openSlots: clone
      })
    })
    .catch((err) => {
      console.log("axios catch block, err >>>", err);
    })
  }

//====================================================================================
  
  createAvailability(newAvailability){
    const _this = this;
    
    console.log("in func createAvailabi, newAvailability >>>", newAvailability);
    
    axios.post("/admin/availabilities/create", newAvailability)
    .then((res) => {
      console.log(res.data);

      if (!res.data){
        window.alert("Internal server err");
      }

      if (!res.data.success){
        window.alert("Failed db insert. Server msg:" + res.data.msg);
        return;
      }

      // if (res.data.serverBadAuth){
      //   window.alert("Please log in!");
      //   _this.props.reactLogOut("Log in first! Server saw that you're not logged in.");
      //   return;
      // }

      // if (!res.data.success){
      //   console.log("ajax good, but performance failed");
      //   return false;
      // }

      //BEGIN visiually add slot
      let clone = [..._this.state.openSlots];

      clone.push({
        title: "My new available slot!",
        start: newAvailability.start_at,
        end: newAvailability.end_at,
        isMine: true
      });

      _this.setState({
        openSlots: clone
      });

      //END visiually add slot
      
    })
    .catch((err) => {
      console.log("axios catch block, err >>>", err);
    })
  }

//====================================================================================

  handleNavigate(focusDate, flipUnit, prevOrNext) {
    //note: `focusDate` param isn't useful.
    const _this = this;

    // console.log("/admin/availability comp handleNavigate func. Right now do nothing.")
      
      // //BEGIN restrict patients to view only this week + next
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
      // //END restrict patients to view only this week + next
      
    }

//====================================================================================

    handleOnSelectSlot(slotInfo){
      const _this = this;

        console.log(" slotInfo >>>", slotInfo);

        var want = {
          start_at: new Date(slotInfo.start),
          end_at: new Date(slotInfo.end)
        };

        // console.log("_this.state.openSlots >>> ", _this.state.openSlots, "want >>> ", want)

        if (!helpers.isSlotOpen(_this.state.openSlots, want)){
          alert("New proposal must not overlap with existing ones");
          return;
        }
      
        const confirmMsg = "start: " + slotInfo.start.toLocaleString() + "\nend: " + slotInfo.end.toLocaleString() + ` Set as working hours?`;

        if (!window.confirm(confirmMsg)){
          return;
        }

        let newAvailability = {
          drUrlName : _this.props.match.params.drUrlName,
          start_at : slotInfo.start,
          end_at : slotInfo.end
      }

      _this.createAvailability(newAvailability);
    }

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
        <h1>
          Set available slots for Dr. {_this.props.match.params.drUrlName}
        </h1>
        
        <BigCalendar
          events={this.state.openSlots}
          defaultView='week'
          views={['week', 'day']}
          selectable
          step={30} 

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

          // defaultDate={moment().toDate()}

          date={_this.state.dayChosen}

          onNavigate={(focusDate, flipUnit, prevOrNext) => {
            _this.handleNavigate(focusDate, flipUnit, prevOrNext);
          }}

          onSelectSlot={(slotInfo) => {
            _this.handleOnSelectSlot(slotInfo);
          }}

          // eventPropGetter={(event, start, end, isSelected) => {_this.eventStyleGetter(event, start, end, isSelected)}}

          eventPropGetter = {(event, start, end, isSelected)=>{
            
            let newStyle = {
              backgroundColor: "lightgrey",
              color: 'black',
              borderRadius: "0px",
              border: "none"
          };

            if (event.isMine){
              newStyle.backgroundColor = "lightgreen"
            }
      
            return {
              className: "",
              style: newStyle
            };
          }}

          onSelectEvent={event => {
            // console.log("event params onSleectEvent >>>", event);
            // if (!event.isMine) {
            //   alert("Slot already taken");
            //   return;
            // }
            alert("onSelectEvent func. Do nothing.my availablity: " + event.title);
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