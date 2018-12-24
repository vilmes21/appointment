import React from 'react';
import {connect} from 'react-redux';
import isAuthed from 'helpers/isAuthed'
import Redirect from 'react-router-dom/Redirect';
import {Link} from 'react-router-dom'
import accountApi from "helpers/accountApi.js"
import Spinner from "components/dumb/Spinner.js"

class MyAccount extends React.Component {

    state = {
        isLoading: true,
        email: "",
        firstname: "",
        lastname: "",
        phone: "",
        id: 0,
        isAdmin: false,
        emailConfirmed: false
    }

    componentDidMount = async() => {
        const {authenticated} = this.props;
        if (authenticated) {
            const res = await accountApi.getMe();
            if (res) {
                this.setState({...res, isLoading: false })
            }
        }
    }

    render() {
        const {authenticated, location} = this.props;
        // const {currentUser, authenticated, location} = this.props;

        if (!authenticated) {
            return <Redirect
                to={{
                pathname: "/login",
                state: {
                    from: location
                }
            }}/>
        }

        // const {     email,     firstname,     lastname,     phone,     id,
        // isAdmin,     emailConfirmed } = currentUser;

        const {
            isLoading,
            email,
            firstname,
            lastname,
            phone,
            id,
            isAdmin,
            emailConfirmed
        } = this.state;

        if (isLoading){
            return <Spinner />
        }

        return (
            <div className="myaccJD">
                <div>
                    {isAdmin
                        ? "Is Admin"
                        : ""}
                </div>

                {/* <div>
                    id: {id}
                </div> */}
                <div>
                    {firstname}&nbsp; {lastname}
                </div>
                <div>
                    email: {email}&nbsp; (
                    <span
                        className={emailConfirmed
                        ? ""
                        : "dangerRed"}>
                        {emailConfirmed
                            ? "Confirmed"
                            : "Not yet confirmed"}
                    </span>
                    )
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

// const mapState = (state) => {     return {         currentUser:
// state.currentUser,         authenticated: isAuthed(state.currentUser)     };
// } export default connect(mapState, {})(MyAccount);
export default MyAccount