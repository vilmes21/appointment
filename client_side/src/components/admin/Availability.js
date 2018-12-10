import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {connect} from 'react-redux';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import isValidStringParam from "helpers/isValidStringParam.js"
import adminAvailabilityApi from "helpers/adminAvailabilityApi.js"
import shapeAdminAvaList from "helpers/shapeAdminAvaList.js"
import {Redirect} from 'react-router-dom'
import helpers from '../../helpers'
import isAuthed from 'helpers/isAuthed'
import isAdmin from 'helpers/isAdmin'

const localizer = BigCalendar.momentLocalizer(moment);

class Availability extends Component {
    state = {
        openSlots: [],
        dayChosen: new Date()
    }

    componentDidMount = async() => {
        const _drUrlName = this.props.match.params.drUrlName;

        if (!isValidStringParam(_drUrlName)) {
            return;
        }

        const arr = await adminAvailabilityApi.getAvailabilitiesList(_drUrlName);

        if (Array.isArray(arr)) {
            this.setState({openSlots: shapeAdminAvaList(arr)})
        }
    }

    createAvailability = async newAvailability => {
        const data = await adminAvailabilityApi.create(newAvailability);

        if (!data) {
            return;
        }

        let clone = [
            ...this.state.openSlots, {
                title: "Dr works now!",
                start: new Date(newAvailability.start_at),
                end: new Date(newAvailability.end_at),
                isMine: true
            }
        ];

        this.setState({openSlots: clone});
    }

    handleOnSelectSlot = (slotInfo) => {
        var want = {
            start_at: new Date(slotInfo.start),
            end_at: new Date(slotInfo.end)
        };

        if (!helpers.isSlotOpen(this.state.openSlots, want)) {
            alert("New proposal must not overlap with existing ones");
            return;
        }

        const confirmMsg = "start: " + slotInfo
            .start
            .toLocaleString() + "\nend: " + slotInfo
            .end
            .toLocaleString() + ` Set as working hours?`;

        if (!window.confirm(confirmMsg)) {
            return;
        }

        let newAvailability = {
            drUrlName: this.props.match.params.drUrlName,
            start_at: slotInfo.start,
            end_at: slotInfo.end
        }

        this.createAvailability(newAvailability);
    }

    render() {
        const {authenticated, isAdmin, location} = this.props;

        if (!authenticated) {
            return <Redirect
                to={{
                pathname: "/login",
                state: {
                    from: location
                }
            }}/>
        }

        if (!isAdmin){
            return <Redirect to="/" />;
        }

        return (
            <div>
                <h1>
                    Set available slots for Dr. {this.props.match.params.drUrlName}
                </h1>

                <BigCalendar
                localizer={localizer}
                    events={this.state.openSlots}
                    defaultView='week'
                    views={['week', 'day']}
                    selectable

                    onSelectSlot={slotInfo => {
                        this.handleOnSelectSlot(slotInfo);
                    }}

                    step={30}
                    timeslots={1}
                    messages={{
                    allDay: "",
                    week: "calendar"
                }}
                    min={new Date("2017-12-27 07:00:00")}
                    max={moment(new Date("2017-12-27 07:00:00"))
                    .add(12, "hours")
                    .toDate()}/>

            </div>
        )
    }
}

const mapState = (state) => {
    return {
        authenticated: isAuthed(state.currentUser),
        isAdmin: isAdmin(state.currentUser),
    };
}

export default connect(mapState, {})(Availability);