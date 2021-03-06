import React, { Component } from 'react';
// import BigCalendar from 'react-big-calendar';
// import moment from 'moment';
import axios from "axios";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import helpers from '../../helpers'


export default class Slot extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   data: this.props.data
    // };
}

  // handleOpen(){
  //   // console.log("slot state>>", this.state)
  //   this.setState({open: true});
  // };

  handleClose() {
    // this.setState({open: false});
    this.props.closeDetail();
  };

  render(){
    const _this = this;
    const _detail = this.props.detail;
    
    const actions = [
      <Button
        label="Cancel Appointment"
        primary={true}
        onClick={()=>{
          _this.props.cancelAppointment(_detail.id);
        }}
      />,
      <Button
        label="OK"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          title={_detail.title}
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose}
        >
          Start: {_detail.start} <br />
          End: {_detail.end}
          
        </Dialog>
      </div>
    );
  }
}