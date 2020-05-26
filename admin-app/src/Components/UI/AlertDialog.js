import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grow from '@material-ui/core/Grow';

import { useDispatch, useSelector } from "react-redux";
import { clearDialog } from "../../store/Actions/UIActions";
import { Divider } from '@material-ui/core';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

export default function AlertDialog() {
  const dispatch = useDispatch();
  const { DialogOpen, DialogTitleParam, DialogContentParam, DialogActionsParam } = useSelector(
      state => state.ui
    );


  function handleClose(event, reason) {
    if(reason === 'clickaway'){
      return
    }
    dispatch(clearDialog());
  }

  return (
    <>
      <Dialog
        open={DialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{DialogTitleParam ? DialogTitleParam : <></>}</DialogTitle>
        <Divider orientation="horizontal" variant="middle"/>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-slide-description"> */}
            {DialogContentParam ? DialogContentParam : <></>}
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
            {DialogActionsParam}
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}