import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearBackDrop } from "../store/actions/uiActions";

//UI
import { Backdrop, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
    backdrop: {
      zIndex: 1501,
      color: '#fff',
    },
  }));

export default function BackDrop(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { backDropOpen } = useSelector(
        state => state.ui
    )
    //eslint-disable-next-line
    function handleClose(event, reason) {
      if(reason === 'clickaway'){
        return
      }
      dispatch(clearBackDrop());
    }

    return(
        <Backdrop
        className={classes.backdrop}
        open={backDropOpen}
        //onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
}