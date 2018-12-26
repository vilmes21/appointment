import React from 'react';
import accountApi from "helpers/accountApi.js"
import {Redirect} from 'react-router-dom';
import Spinner from "./Spinner"
import MyBooking from "./MyBooking"
import Snackbarr from "components/smart/Snackbarr.js"

export default class MyBookings extends React.Component {
    state = {
         booked: []
    }
 
    componentDidMount = async() => {
        const booked = []
    }

    remove = id => {
        const {booked}=this.state;
        this.setState({
            booked: booked.filter(x => x.id !== id)
        })
    }

    renderList = bookedArr => {
        if (!Array.isArray(bookedArr) || bookedArr.length === 0){
            return <div>No bookings found</div>
        }

        bookedArr.map(x => {
            return <MyBooking key={x.id} remove={this.remove}/>
        })
    }

    render() {
        const {booked}=this.state;
        return <div>
            <h1>My upcoming bookings</h1>
            {this.renderList(booked)}
        </div>
    }
}
