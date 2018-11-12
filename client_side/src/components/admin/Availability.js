import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from "axios";
import isValidStringParam from "helpers/isValidStringParam.js"
import adminAvailabilityApi from "helpers/adminAvailabilityApi.js"
import shapeAdminAvaList from "helpers/shapeAdminAvaList.js"
import {Redirect} from 'react-router-dom'

import helpers from '../../helpers'

BigCalendar.momentLocalizer(moment);

export default class Availability extends Component {
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

    handleNavigate = (focusDate, flipUnit, prevOrNext) => {
        //note: `focusDate` param isn't useful.
        const {dayChosen} = this.state;
        const now = new Date();
        const nowNum = now.getDate();
        const nextWeekToday = moment()
            .add(7, "day")
            .toDate();
        const nextWeekTodayNum = nextWeekToday.getDate();

        if (prevOrNext === "NEXT" && dayChosen.getDate() === nowNum) {
            this.setState({dayChosen: nextWeekToday});
        } else if (prevOrNext === "PREV" && dayChosen.getDate() === nextWeekTodayNum) {
            this.setState({dayChosen: now});
        }

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

    eventStyleGetter = (event, start, end, isSelected) => {
        console.log("faire rien func eventStyleGetter");
    }

    render() {

        return (
            <div>
                <h1>
                    Set available slots for Dr. {this.props.match.params.drUrlName}
                </h1>

                <BigCalendar
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