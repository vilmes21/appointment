import React, { Component } from 'react';
// import BigCalendar from 'react-big-calendar';
// import moment from 'moment';
import axios from "axios";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

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
      <FlatButton
        label="Cancel Appointment"
        primary={true}
        onClick={()=>{
          _this.props.cancelAppointment(_detail.id);
        }}
      />,
      <FlatButton
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