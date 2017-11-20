import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import myEventsList from "../fake_db/events";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

class MyCalendar extends Component {
  constructor(){
    super();
    this.state = {
      myEventsList: myEventsList
    }
  }

  render(){
    return (
      <div>
        <BigCalendar
          events={this.state.myEventsList}
          defaultView='week'
          selectable
          scrollToTime={new Date(2017, 11, 19, 6)}
          defaultDate={new Date(2017, 10, 12)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={(slotInfo) => {
            console.log(
              `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
              `\nend: ${slotInfo.end.toLocaleString()}` +
              `\naction: ${slotInfo.action}`
            );
            //adsfasdf
            let newSlot = {
              'title': 'oh yeah',
              'start': new Date(slotInfo.start),
              'end': new Date(slotInfo.end)
            }

            console.log("myEventsList before push->", myEventsList);            
            myEventsList.push(newSlot);
            console.log("myEventsList after push->", myEventsList);
            
            this.setState({
              myEventsList: myEventsList
            })
            //asfads
          }
        }
        />
      </div>
    );
  }
}

export default MyCalendar;