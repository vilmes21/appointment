import React from 'react';
import AdminDoctorList from "components/admin/DoctorList"
import AdminAvailability from "components/admin/Availability"
import DoctorAppointmentList from "components/admin/DoctorAppointmentList"
import {Route} from 'react-router-dom';

export default class AdminRoutes extends React.Component {
    render() {
        return (
            <div>
                <Route exact path="/admin/doctors" component={AdminDoctorList}/>
                <Route path="/admin/availability/:drUrlName" component={AdminAvailability}/>
                <Route path="/admin/appointment/:drId" component={DoctorAppointmentList}/>
            </div>
        );
    }
}
