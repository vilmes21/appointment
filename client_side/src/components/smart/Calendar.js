import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {Redirect} from 'react-router-dom'
import {getList, createAppointment, updateList} from 'actions/appointments'
import {connect} from 'react-redux';
import isAuthed from 'helpers/isAuthed'
import handleOnView from 'helpers/handleOnView'
import handleNavigate from 'helpers/handleNavigate'
import handleOnSelectSlot from 'helpers/handleOnSelectSlot'
import eventStyleGetter from 'helpers/eventStyleGetter'
import eventPropGetter from 'helpers/eventPropGetter'
import onSelectEvent from 'helpers/onSelectEvent'
import isThePast from 'helpers/isThePast'

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
    state = {
        dayChosen: new Date()
    }

    componentDidMount = async() => {

        const res = await this
            .props
            .getList(this.props.match.params.drUrlName);
        if (!res.success) {
            alert(res.msg)
        }
    }

    eventStyleGetter = eventStyleGetter(this)

    handleOnSelecting = slot => {
      // console.log("ENTER func handleOnSelecting,");
      if (isThePast(slot.start)){
        return false;
      }
    }

    render = () => {
        const _this = this;
        const {authenticated, booked} = this.props;
        const tabs = authenticated? ['week', 'agenda']:['week'];

        return (
            <div>
                <h1>
                    Dr. {_this.props.match.params.drUrlName}
                    - Schedule
                </h1>
{
  authenticated ||  <div>
    You are not logged in. To book appointments, please log in.
  </div>
}
               

                <BigCalendar
                    events={booked}
                    defaultView='week'
                    views={tabs}
                    selectable
                    step={5}
                    timeslots={1}
                    messages={{
                    allDay: "",
                    week: "calendar",
                    agenda: "my appointments"
                }}
                    min={new Date("2017-12-27 09:00:00")}
                    max={moment(new Date("2017-12-27 09:00:00"))
                    .add(9, "hours")
                    .toDate()}
                    date={_this.state.dayChosen}
                    onNavigate={(focusDate, flipUnit, prevOrNext) => {
                    handleNavigate(this)(focusDate, flipUnit, prevOrNext);
                }}
                    onSelectSlot={(slotInfo) => {
                    handleOnSelectSlot(this)(slotInfo);
                }}
                    onSelecting={this.handleOnSelecting}
                    eventPropGetter={eventPropGetter(this)}
                    onSelectEvent={onSelectEvent()}
                    formats={{
                    eventTimeRangeFormat: () => {
                        return ""
                    },
                    foo: "bar"
                }}
                selectable={'ignoreEvents'}
                    onView={handleOnView(this)}/>
            </div>
        );
    }
}

const mapState = (state) => {
    return {
        authenticated: isAuthed(state.currentUser),
        booked: state.appointments
    };
}

export default connect(mapState, {getList, createAppointment, updateList})(Calendar);