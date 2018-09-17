import React from 'react';

export default class DoctorAppointmentLi extends React.Component {
    render() {
        const {appt} = this.props;
        console.log("compo DoctorAppointmentLi appt >>> ", appt)
        return (
            <div>
                id: {appt.id}
                <br/>
                patient: {appt.title}
                <br/>
                start: {appt.start}
                <br/>
                end: {appt.end}
            </div>
        );
    }

}
