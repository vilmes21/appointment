import React from 'react';
import accountApi from "helpers/accountApi.js"
import {Redirect} from 'react-router-dom';
import Spinner from "./Spinner"
import MyBooking from "./MyBooking"
import Snackbarr from "components/smart/Snackbarr.js"
import bookingApi from '../../helpers/bookingApi';

export default class MyBookings extends React.Component {
    state = {
        isLoading: true,
        booked: []
    }

    componentDidMount = async() => {
        const booked = await bookingApi.getMyBookings();
        if (Array.isArray(booked)) {
            this.setState({booked, isLoading: false})
        }
    }

    remove = id => {
        const {booked} = this.state;
        this.setState({
            booked: booked.filter(x => x.id !== id)
        })
    }

    renderList = bookedArr => {
        if (!Array.isArray(bookedArr) || bookedArr.length === 0) {
            return <div>No bookings found</div>
        }

        return <table className="fullWidth">
            <thead>
                <tr>
                    <th>Doctor</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {bookedArr.map(x => {
                    return <MyBooking data={x} key={x.id} remove={this.remove}/>
                })}
            </tbody>
        </table>

    }

    render() {
        const {authenticated, location} = this.props;

        if (!authenticated) {
            return <Redirect
                to={{
                pathname: "/login",
                state: {
                    from: location
                }
            }}/>
        }

        const {isLoading, booked} = this.state;

        if (isLoading) {
            return <Spinner/>
        }
        return <div>
            <h1>My upcoming bookings</h1>
            {this.renderList(booked)}
        </div>
    }
}
