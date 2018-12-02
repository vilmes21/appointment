import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {Redirect} from 'react-router-dom'
import {getList, createAppointment, updateList, cancelApmtUserSide} from 'actions/appointments'
import {connect} from 'react-redux';
import isAuthed from 'helpers/isAuthed'
import isAdmin from 'helpers/isAdmin'
import handleOnView from 'helpers/handleOnView'
import handleNavigate from 'helpers/handleNavigate'
import handleOnSelectSlot from 'helpers/handleOnSelectSlot'
import eventStyleGetter from 'helpers/eventStyleGetter'
import eventPropGetter from 'helpers/eventPropGetter'
import onSelectEvent from 'helpers/onSelectEvent'
import isThePast from 'helpers/isThePast'
import MyDayWrapper from 'components/dumb/MyDayWrapper'
import DetailDialog from 'components/dumb/DetailDialog'

const localizer =BigCalendar.momentLocalizer(moment);


class Calendar extends Component {
    state = {
        detailOpen: false,
        detail: {},
        dayChosen: new Date()
    }

    componentDidMount = () => {
        this.props.getList(this.props.match.params.drUrlName);
    }

    showDetail =  eventObj => {

        console.log("FE eventObj 7777 > ", eventObj)
        
        this.setState({ detail: eventObj, detailOpen: true });
      }
    
      handleCloseDetail = () => {
        this.setState({ detailOpen: false });
      };

      handleCancelApmt= apmtId => {
          console.log("FE fn handleCancelApmt. apmtId >>>", apmtId)
          const {cancelApmtUserSide} = this.props;
          
          return async () => {
            await cancelApmtUserSide([apmtId]);
            this.handleCloseDetail();
          }
      }

    eventStyleGetter = eventStyleGetter(this)

    handleOnSelecting = slot => {
      if (isThePast(slot.start)){
        return false;
      }
    }

    render = () => {
        const _this = this;
        const {detailOpen, detail} = this.state;
        const {isAdmin, authenticated, booked} = this.props;
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

{
    authenticated && <DetailDialog 
                        open={detailOpen}
                        detail={detail}
                        handleCancelApmt={this.handleCancelApmt}
                        handleCloseDetail={this.handleCloseDetail}/>
}
               
                <BigCalendar
                localizer={localizer}
                    events={booked}
                    defaultView='week'
                    views={tabs}
                    selectable
                    step={5}
                    timeslots={1}
                    messages={{
                    allDay: "",
                    week: "Calendar",
                    agenda: "My agenda"
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
                    onSelectEvent={onSelectEvent(isAdmin, this.showDetail)}
                    formats={{
                    eventTimeRangeFormat: () => {
                        return ""
                    }
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
        isAdmin: isAdmin(state.currentUser),
        booked: state.appointments
    };
}

export default connect(mapState, {getList, createAppointment, updateList, cancelApmtUserSide})(Calendar);