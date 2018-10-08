import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class DetailDialog extends React.Component {

  render() {

    
    const {open, handleCloseDetail, detail, handleCancelApmt} = this.props;
    const {id} = detail;
    console.log("FE 2 detail >>>", detail)
    
    return (
      <div>
   
        <Dialog
          open={open}
          onClose={handleCloseDetail}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Patient: {detail.firstname} {detail.lastname}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Start: {detail.start} <br />
              End: {detail.end}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelApmt(id)} color="primary">
              Cancel Appointment
            </Button>
            <Button onClick={handleCloseDetail} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
