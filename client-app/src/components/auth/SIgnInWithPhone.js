import React from 'react'
import { Dialog, Grow, DialogTitle, Typography, Button, makeStyles, Grid, DialogContent, TextField, Divider, Container, CircularProgress, DialogActions } from '@material-ui/core'
import OTPInput from './OTPInput';
import firebase from '../../config/fbConfig'
import { showSnackbar, backDrop, clearBackDrop } from '../../store/actions/uiActions';
import { useDispatch } from 'react-redux';
import { signInWithPhone, updateUserDetails } from '../../store/actions/authActions';
import { useForm } from 'react-hook-form';

const Transition = React.forwardRef((props, ref) => {
    return <Grow ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
    dialogActions:{
        marginRight:theme.spacing(1)
    },
    container:{
      display:'flex'
    },
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
      Warning: {
        backgroundColor: theme.palette.background.paper,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 3,
        borderBottom: 0,
        padding: theme.spacing(1, 2, 0.5),
      },
      avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      }
}))

const SIgnInWithPhone = ({isOpen,handleClose}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const otpLength = 6;
    const [verifyOTP,setVerifyOTP] = React.useState(null);
    const [mobileNoOTP,setMobileNoOTP] = React.useState({mobileNo:'',otp:'',showProgress:false});
    const [step,setStep] = React.useState(0);
    const hanClose = (e, reason) => handleClose(reason);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target);
        switch(step){
            case 0:
                if(!mobileNoOTP.mobileNo || isNaN(mobileNoOTP.mobileNo) || mobileNoOTP.mobileNo.length !== 10){
                    dispatch(showSnackbar({ type: 'SNACKBAR', variant: 'error', message: "Please input valid Mobile No."}));
                    return;
                }
                setMobileNoOTP({...mobileNoOTP,showProgress:true});
                const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('cdiv',{size:'invisible'});
                firebase.auth().settings.appVerificationDisabledForTesting = true;
                firebase.auth().signInWithPhoneNumber("+91"+mobileNoOTP.mobileNo,recaptchaVerifier).then((resp)=>{
                    setStep(prvStp => prvStp +1);
                    setVerifyOTP(resp);
                    console.log(resp);
                    setMobileNoOTP({...mobileNoOTP,showProgress:false});
                }).catch(err => {
                    console.log(err);
                    dispatch(showSnackbar({ type: 'SNACKBAR', variant: 'error', message: e.message}));
                })
                break;
            case 1:
                if(!mobileNoOTP.otp || mobileNoOTP.otp.length !== otpLength){
                  dispatch(showSnackbar({ type: 'SNACKBAR', variant: 'error', message: "Please input valid OTP"}));
                  return;
                }
                dispatch(signInWithPhone(verifyOTP,mobileNoOTP.otp,handleContinuation));
                break;
            case 2:
            default:

                break;

        }
        
    }
    const handleContinuation = (action) => {
        switch(action){
            case 'exit':
                hanClose(null,'done');
            case 'continue':
                setStep(prvStp => prvStp + 1);
                
        }
    }
    const handleChange = (e) => {
        setMobileNoOTP({...mobileNoOTP,mobileNo:e.target.value});
    }
    const handleOTPChange = (otp) => {
        if(otp.length === otpLength){
            setMobileNoOTP({...mobileNoOTP,otp});
        }
    }

    const handleClick = e => {
      switch(e.currentTarget.name){
        case 'ResendOTP':
        dispatch(backDrop());
        const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('cdiv',{size:'invisible'});
        firebase.auth().settings.appVerificationDisabledForTesting = true;
        firebase.auth().signInWithPhoneNumber("+91"+mobileNoOTP.mobileNo,recaptchaVerifier).then((resp)=>{
            //setStep(prvStp => prvStp +1);
            setVerifyOTP(resp);
            console.log(resp);
            dispatch(clearBackDrop());
            dispatch(showSnackbar({ type: 'SNACKBAR', variant: 'info', message: 'OTP Resent successfully'}));
            //setMobileNoOTP({...mobileNoOTP,showProgress:false});
        }).catch(err => {
            console.log(err);
            dispatch(showSnackbar({ type: 'SNACKBAR', variant: 'error', message: e.message}));
        })
          break;
        case 'ResetMNo':
          setStep(0);
          break;
        default:
          break;
      }
    }


    const getStepContent = (step) => {
      switch(step){
        case 0:
          return(
            <React.Fragment>
              <Grid item xs={2}>
                <TextField
                    disabled    
                    defaultValue='+91'
                    label=' '
                />
            </Grid>
            <Grid item xs={8}>
                <TextField
                    onChange={handleChange}
                    name='mno'
                    type='tel'
                    label='Mobile No.'
                />
            </Grid>
            <Grid item xs={2} hidden={!mobileNoOTP.showProgress}>
              <CircularProgress />
            </Grid>
            </React.Fragment>
          )
        case 1:
          return(
            <React.Fragment>
            <Grid item xs={12}>
                <Typography>Mobile No. : +91 {mobileNoOTP.mobileNo}</Typography>
            <Grid item xs={12}>
              <Button variant='text' onClick={handleClick} size='small' color='primary' id='ResetMNo' name='ResetMNo'>Reset Mobile No.</Button>
            </Grid>
            </Grid>
              <Grid item xs={12}>
                <Typography>Please Enter the received OTP</Typography>
              </Grid>
              <OTPInput
                autoFocus
                length={otpLength}
                className='OTPContainer'
                inputclassName='OTPInput'
                onChangeOTP={handleOTPChange}
            />
            </React.Fragment>
          )
        case 2:
          return(
            <EnterUserDetails />
          )
      }
    }

    const getStepAction = step => {
      switch(step){
        case 0:
          return(
            <Button color='primary' id='GetOTP' name='GetOTP' type='submit' variant='contained'>Get OTP</Button>
          )
        case 1:
          return(
            <React.Fragment>
              <Button color='primary' onClick={handleClick} id='ResendOTP' name='ResendOTP' variant='text'>Resend OTP</Button>
              <Button color='primary' id='SignIn' name='SignIn' type='submit' variant='contained'>Sign In</Button>
            </React.Fragment>
          )
        default:
          return(<></>)
      }
    }

    return (
        <>
            <Dialog
            open={isOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={hanClose}
            >
                <DialogTitle>
                    <Grid container alignItems='stretch' spacing={2}>
                        <Grid item xs={8}>
                            <Typography style={{justifyContent:'center'}} variant='h6'>Sign In using Phone</Typography>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Divider variant='middle' />
                <form onSubmit={handleSubmit}>
                <DialogContent>
                    <div>
                        <Grid container spacing={2}>
                            <div id='cdiv' hidden></div>
                            {getStepContent(step)}
                        </Grid>
                    </div>
                </DialogContent>
                <Divider variant='middle' />
                <DialogActions className={classes.dialogActions}>
                    {getStepAction(step)}
                </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

export default SIgnInWithPhone;


export const EnterUserDetails = (props) => {
    const dispatch = useDispatch();
    const {hidden} = props;
    const classes = useStyles();
    const {handleSubmit, errors, register } = useForm();
    const [showWarning, setWarning] = React.useState(0);
    const handleFocus = (event, index) => {
      setWarning(index);
    }
    const onSubmit = (data, e) => {
        //console.log(data);
        dispatch(updateUserDetails(data));
    }
    return(
        <div hidden={hidden}>
            <Container>
            <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                          autoComplete="fname"
                          name="fullName"
                          variant="outlined"
                          required
                          onFocus={(event) =>{
                            handleFocus(event, 0);
                          }}
                          fullWidth
                          id="fullName"
                          label="Full Name"
                          autoFocus
                          inputRef={register({
                            required: true
                          })}
                          error={!!errors.fullName}
                          helperText={(errors.fullName ? "Enter your Full Name!" : "eg. Ajey Nagar")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {
                        showWarning === 1
                        ?
                        <div className={classes.Warning}>
                          <Typography color="primary" variant="subtitle1">{'Enter carefully!'}</Typography>
                          <Typography variant="caption"><b>{'Here`s why: '}</b>{'Your PUBG ID will be used to identify you during matches!'}</Typography>
                        </div>
                        :
                        null
                      }

                      <TextField
                        variant="outlined"
                        required
                        onFocus={(event) =>{
                          handleFocus(event, 1);
                        }}
                        fullWidth
                        id="pubgid"
                        label="PUBG ID"
                        name="pubgid"
                        autoComplete="pubgid"
                        inputRef={register({
                          required: true
                        })}
                        error={!!errors.pubgid}
                        helperText={(errors.pubgid ? "PUBG ID is must!" : "eg. mortal123")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        onFocus={(event) =>{
                          handleFocus(event, 0);
                        }}
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        inputRef={register({
                          required: true,
                          pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        })}
                        error={!!errors.email}
                        helperText={(errors.email ? (errors.email.type === 'required' ? "Enter your email!" : "Invalid email address") : "eg. abc@xyz.com")}
                      />
                    </Grid>
        case
            </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
        </form>
            </Container>
        </div>
    )
}