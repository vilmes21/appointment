import React from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import TopError from "components/smart/TopError"
import {connect} from 'react-redux';
import isAuthed from 'helpers/isAuthed'
import isAdmin from 'helpers/isAdmin'
import addLog from 'helpers/addLog'
import LinksSummary from 'components/dumb/LinksSummary'
import {checkAuthNow} from 'actions/users'
import Spinner from 'components/dumb/Spinner'
import DoctorList from 'components/smart/DoctorList'
import Calendar from 'components/smart/Calendar';
import UnauthedRoutes from 'components/dumb/UnauthedRoutes'
import NoMatch from 'components/dumb/NoMatch';
import MyAccount from 'components/smart/MyAccount'
import ChangePassword from 'components/dumb/ChangePassword'

import AdminLinks from 'components/dumb/AdminLinks'
import ToAuthLinks from 'components/dumb/ToAuthLinks'
import Logout from "components/smart/Logout"

import Signup from 'components/smart/Signup';
import Login from "components/smart/Login"

import AdminDoctorList from "components/admin/DoctorList"
import AdminAvailability from "components/admin/Availability"
import DoctorAppointmentList2 from "components/admin/DoctorAppointmentList2"

class Layout extends React.Component {
    componentDidMount() {
        const {authenticated, checkAuthNow} = this.props;
        if (!authenticated) {
            checkAuthNow();
        }
    }

    render = () => {
        const {isLoading} = this.props;

        if (isLoading) {
            return <Spinner/>
        }

        const {authenticated, isAdmin, firstname} = this.props;

        return (
            <div>
                <TopError/>

                <Router>
                    <div>
                        <div className="navbarr">
                            {isAdmin && <span className="navitemdx">
                                <Link to="/admin/doctors">admin-View Doctors</Link>
                            </span>}

                            <span className="navitemdx">
                                <Link to="/doctors">Doctors</Link>
                            </span>

                            {authenticated && <span className="navitemdx">
                                <Link to="/my_account">MyAccount</Link>
                            </span>}

                            {authenticated
                                ? <span>
                                        <span className="floatRight welcome2">Welcome, {firstname}</span>
                                        <Logout/>
                                        </span>
                                : <span>
                                    <span className="navitemdx floatRight">
                                        <Link to="/login">Login</Link>
                                    </span>
                                    <span className="navitemdx floatRight">
                                        <Link to="/sign_up">Signup</Link>
                                    </span>

                                </span>
}

                        </div>

                        <hr/>
                        <div className="belowNavxk">
                            <Switch>
                                <Route exact path="/" component={DoctorList}/>
                                <Route exact path="/my_account" component={MyAccount}/>
                                <Route exact path="/account/password" component={ChangePassword}/>
                                <Route exact path="/sign_up" component={Signup}/>
                                <Route exact path="/login" component={Login}/>
                                <Route exact path="/doctors" component={DoctorList}/>
                                <Route path="/calendar/:drUrlName" component={Calendar}/>
                                <Route exact path="/admin/doctors" component={AdminDoctorList}/>
                                <Route path="/admin/availability/:drUrlName" component={AdminAvailability}/>
                                <Route path="/admin/appointment/:drId" component={DoctorAppointmentList2}/>

                                <Route path="*" component={NoMatch}/>
                            </Switch>
                        </div>
                    </div>
                </Router>

            </div>
        );
    }
}

const mapState = state => {
    return {
        isLoading: state.isLoading,
        authenticated: isAuthed(state.currentUser),
        isAdmin: isAdmin(state.currentUser),
        firstname: state.currentUser
            ? state.currentUser.firstname
            : null
    };
}

export default connect(mapState, {checkAuthNow})(Layout);