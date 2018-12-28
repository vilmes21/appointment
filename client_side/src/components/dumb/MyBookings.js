import React from 'react';
import {Redirect} from 'react-router-dom';
import Spinner from "./Spinner"
import MyBooking from "./MyBooking"
import Snackbarr from "components/smart/Snackbarr.js"
import bookingApi from '../../helpers/bookingApi';
import mybookingData from 'fakeData/mybookingData'

export default class MyBookings extends React.Component {
    state = {
        isLoading: true,
        booked: [],
        msg: ""
        // booked: mybookingData, isLoading: false
    }

    componentDidMount = async() => {
        const booked = await bookingApi.getMyBookings();
        console.log("didmount, booked:", booked)
        
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

    showErr = msg => {
        this.setState({msg})
    }

    clearErr = () => {
        this.setState({msg: ""})
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
                    return <MyBooking data={x} key={x.id} remove={this.remove} showErr={this.showErr}/>
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

        const {isLoading, booked, msg} = this.state;

        if (isLoading) {
            return <Spinner/>
        }
        return <div>
            <h1 className="textAlignCenter">My upcoming bookings</h1>
            {this.renderList(booked)}
            {msg && <Snackbarr msgShown={msg} handleParentClose={this.clearErr}/>
}
        </div>
    }
}
