import React from 'react';
import DoctorList from 'components/smart/DoctorList'
import Calendar from 'components/smart/Calendar';
import {Route} from 'react-router-dom';
import UnauthedRoutes from 'components/dumb/UnauthedRoutes'
import AdminRoutes from 'components/dumb/AdminRoutes'
import NoMatch from 'components/dumb/NoMatch';
import MyAccount from 'components/smart/MyAccount'

export default class RoutesSummary extends React.Component {
    render() {
        const {authenticated, isAdmin} = this.props;

        return (
            <div>
                {isAdmin && <AdminRoutes/>}
                {/* Todo: admin routes should always exist, even when not logged in. At most they redirect to login */}
                <Route exact path="/doctors" component={DoctorList}/>
                <Route path="/calendar/:drUrlName" component={Calendar}/> 
                <Route path="/my_account" component={MyAccount}/>
                {authenticated || <UnauthedRoutes/>}
                {/* UnauthedRoutes should always exist. They should just redirect */}
                <Route path="*" component={NoMatch}/>
            </div>
        );

    }
}