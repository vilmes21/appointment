import React from 'react';
import {connect} from 'react-redux';
import isAuthed from 'helpers/isAuthed'
import Redirect from 'react-router-dom/Redirect';
import {Link} from 'react-router-dom'

class MyAccount extends React.Component {

    render() {
        const {currentUser, authenticated, location} = this.props;

        if (!authenticated) {
            return <Redirect
                to={{
                pathname: "/login",
                state: {
                    from: location
                }
            }}/>
        }

        const {
            email,
            firstname,
            lastname,
            phone,
            id,
            isAdmin
        } = currentUser;

        return (
            <div className="myaccJD">
                <div>
                    {isAdmin
                        ? "Is Admin"
                        : "Regular User"}
                </div>

                <div>
                    id: {id}
                </div>
                <div>
                    {firstname}
                    {lastname}
                </div>
                <div>
                    email: {email}
                </div>
                <div>
                    phone: {phone}
                </div>

                <div>
                    <Link to="/account/password">Change password</Link>
                </div>
            </div>
        );
    }
}

const mapState = (state) => {
    return {
        currentUser: state.currentUser,
        authenticated: isAuthed(state.currentUser)
    };
}

export default connect(mapState, {})(MyAccount);