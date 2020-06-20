import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import { clearSnackbar } from "../../store/actions/uiActions";
//After
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
  };
  
  const useStyles = makeStyles(theme => ({
    root: {
      marginBottom: theme.spacing(7),
      zIndex: 1501,
    },
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.main,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  }));

export default function SnackSnackbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
const { SnackbarVariant, SnackbarMessage, SnackbarOpen } = useSelector(
    state => state.ui
  );

  const Icon = variantIcon[SnackbarVariant];

  function handleClose(event, reason) {
    if(reason === 'clickaway'){
      return
    }
    dispatch(clearSnackbar());
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      className={classes.root}
      open={SnackbarOpen}
      autoHideDuration={SnackbarVariant === 'error' ? null : 4000}
      onClose={handleClose}
      aria-describedby="client-snackbar"
      /*message={
        <span id="client-snackbar">
          <Icon>check_circle</Icon>
          {SnackbarMessage}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <Icon>close</Icon>
        </IconButton>
      ]}
      */
    >
      <SnackbarContent
        className={clsx(classes[SnackbarVariant])}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {SnackbarMessage}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
        /*{...other}*/
      />
    </Snackbar>
  );
}