import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from "axios";
import {
  Redirect
} from 'react-router-dom'
import {getList, createAppointment, updateList} from 'actions/appointments'
import {connect} from 'react-redux';

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
  state = {
    dayChosen: new Date()
  }

  componentDidMount =async() =>{    
     const res = await this.props.getList(this.props.match.params.drUrlName);
     if (!res.success){
       alert(res.msg)
     }
  }

  handleOnView = async (param) => {

    console.log("handleOnView func. param>>> ", param)
    
    if (["agenda", "week"].indexOf(param) === -1){
      return;
    }
    
    let _filtered;

    const {booked, updateList} = this.props;

    if (param === "week"){
      _filtered = this.state.allOccupants;
    } else if (param === "agenda"){

      //first save allOccupants in react state , NOT redux store !!!
      this.setState({
        allOccupants: booked
      }, () => {console.log("after set Occupants>>>", this.state)})
      
      _filtered = booked.filter(item => {
        return item.isMine;
      })
    }

    const res  = await updateList(_filtered);
 
      if (!res.success){
        alert(res.msg)
      }
  }

  handleNavigate =(focusDate, flipUnit, prevOrNext) =>{
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

    handleOnSelectSlot =async (slotInfo)=>{
      const _this = this;

        console.log(" slotInfo.start >>>", slotInfo.start);
        var wish_end_at = moment(slotInfo.start).add(5, 'minutes').toDate();;

        const confirmMsg = "Continue to book appointment? \n" + "start: " + slotInfo.start.toLocaleString() + "\nend: " + wish_end_at.toLocaleString();

        if (!window.confirm(confirmMsg)){
          return;
        }

        let newAppointment = {
          drUrlName : _this.props.match.params.drUrlName,
          wish_start_at : slotInfo.start,
          wish_end_at : wish_end_at
      } 

      const res = await this.props.createAppointment(newAppointment);

      if (!(res && res.success)){
        alert(res.msg);
      }

    }

    eventStyleGetter =(event, start, end, isSelected) =>{
      // console.log("what params?");
      // console.log(
      //   "\nevent >>>\n",
      //   event,
      //   "\nstart >>>\n",
      //   start,
      //   "\nend >>>\n",
      //   end,
      //   "\nisSelected >>>\n",
      //   isSelected
      // );

      // // var backgroundColor = '#' + event.hexColor;
      // var newStyle = {
      //     backgroundColor: "yellow",
      //     color: 'black'
      // };

      // const style1 = {
      //   className: "testing-ac",
      //   style: newStyle
      // }

      // console.log("gonna return style obj >>>", style1);
      // // return style1;
      // return {};
  }

  handleOnSelecting = () => {}
  
    render=() =>{
      const _this = this;
    const {authenticated, booked} = this.props;

    if (!authenticated){
      console.log("in Calendar render func. gonna Redirect comop")
      return <Redirect to="/login" />;
    }

    return (
      <div>
        <h1>
          Dr. {_this.props.match.params.drUrlName} Calendar
        </h1>
        
        <BigCalendar
          events={booked}
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

          onSelectSlot={(slotInfo) => {
            _this.handleOnSelectSlot(slotInfo);
          }}

          onSelecting = {this.handleOnSelecting}

          // eventPropGetter={(event, start, end, isSelected) => {_this.eventStyleGetter(event, start, end, isSelected)}}

          eventPropGetter = {(event, start, end, isSelected)=>{
            // console.log("what params?");
            // console.log(
            //   "\nevent >>>\n",
            //   event,
            //   "\nstart >>>\n",
            //   start,
            //   "\nend >>>\n",
            //   end,
            //   "\nisSelected >>>\n",
            //   isSelected
            // );
            
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
            console.log("event params onSleectEvent >>>", event);
            if (!event.isMine) {
              alert("Slot already taken");
              return;
            }
            alert("my apm: " + event.title);
          }}

          formats={
            {
              eventTimeRangeFormat: () => {
                return ""
              },
              foo: "bar"
            }
          }

          onView={this.handleOnView}
        /> 
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    authenticated: !!state.currentUser,
    booked: state.appointments
  };
}
 
export default connect(mapState, { getList, createAppointment , updateList})(Calendar);