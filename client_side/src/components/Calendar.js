////BEGIN testing
// import React, { Component } from 'react';

// const Calender = (all) => {
//   console.log("all>>>>", all);
//   return (
//     <h1>
//       Fine, drUrlName >>> {all.match.params.drUrlName}
//     </h1>
//   )
// }

// export default Calender
////END testing




import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from "axios";
import {
  Redirect
} from 'react-router-dom'

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
  constructor(){
    super();
    this.state = {
      myEventsList: [],
      dayChosen: new Date()
    }

    this.createAppointment = this.createAppointment.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleOnSelectSlot = this.handleOnSelectSlot.bind(this);
    this.eventStyleGetter = this.eventStyleGetter.bind(this);
  }

  componentDidMount(){
    const _this = this;

    console.log("in Calendar compDidMoun, props >>>", _this.props);
    console.log("in Calendar compDidMoun, props.match >>>", _this.props.match);

    if (!_this.props.authenticated){
      console.log("je retour tot bcuz not auth");
      return;
    }

    console.log("func componentDidMount of Calendar comp, gonna GET " + "/availabilities/" + _this.props.match.params.drUrlName);

    axios.get("/availabilities/" + _this.props.match.params.drUrlName)
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
    
    console.log("in func createAppm, newAppointment >>>", newAppointment);
    
    axios.post("/appointments/create", newAppointment)
    .then((res) => {
      console.log(res.data);
      window.alert(res.data.msg);

      if (!res.data){
        window.alert("Internal server err");
      }

      if (res.data.serverBadAuth){
        window.alert("Please log in!");
        _this.props.reactLogOut("Log in first! Server saw that you're not logged in.");
        return;
      }

      if (!res.data.success){
        console.log("ajax good, but performance failed");
        return false;
      }

      //BEGIN visiually add slot:
      let clone = [..._this.state.myEventsList];

      console.log("clone >>>", clone);
      
      clone.push({
        title: "My new appointment!",
        start: newAppointment.wish_start_at,
        end: newAppointment.wish_end_at,
        isMine: true
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

    handleOnSelectSlot(slotInfo){
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

      _this.createAppointment(newAppointment);
    }

    eventStyleGetter(event, start, end, isSelected) {
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
  
    render(){
    const _this = this;

    console.log("Calendar render func, _this.props >>>", _this.props);

    if (!_this.props.authenticated){
      console.log("in Calendar render func. gonna Redirect comop")
      return <Redirect to="/login" />;
    }

    return (
      <div>
        <h1>
          Dr. {_this.props.match.params.drUrlName} Calendar
        </h1>
        
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

          onSelectSlot={(slotInfo) => {
            _this.handleOnSelectSlot(slotInfo);
          }}

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
          

          
        />
      </div>
    );
  }
}

export default Calendar;