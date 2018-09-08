import React from 'react';
import Signup from 'components/smart/Signup';
import Login from "components/smart/Login"
import MyAccount from 'components/smart/MyAccount';
import {Route} from 'react-router-dom';

export default class UnauthedRoutes extends React.Component {
    render() {
        return (
            <div>
                <Route path="/sign_up" render={() => <Signup/>}/>
                <Route path="/login" render={() => <Login/>}/>
                <Route path="/my_account" component={MyAccount}/>
            </div>
        );

    }
}