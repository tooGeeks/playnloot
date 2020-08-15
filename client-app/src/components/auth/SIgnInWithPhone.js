import React from 'react'
import { Dialog, Grow, DialogTitle, Typography, Button, makeStyles, Grid, DialogContent, TextField, Divider, Container } from '@material-ui/core'
import OTPInput from './OTPInput';
import firebase from '../../config/fbConfig'
import { showSnackbar } from '../../store/actions/uiActions';
import { useDispatch } from 'react-redux';
import { signInWithPhone, updateUserDetails } from '../../store/actions/authActions';
import { useForm } from 'react-hook-form';

const Transition = React.forwardRef((props, ref) => {
    return <Grow ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
    dialog:{
        
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
    const [showOTP,setShowOTP] = React.useState(false);
    const [verifyOTP,setVerifyOTP] = React.useState(null);
    const [mobileNoOTP,setMobileNoOTP] = React.useState({mobileNo:'',otp:''});
    const [enterDetailsView,setEnterDetailsView] = React.useState(false);
    const hanClose = (e, reason) => handleClose(reason);
    const handleClick = (e) => {
        e.preventDefault();
        switch(e.target.name){
            case 'GetOTP':
                if(!mobileNoOTP.mobileNo || isNaN(mobileNoOTP.mobileNo) || mobileNoOTP.mobileNo.length !== 10){
                    dispatch(showSnackbar({ type: 'SNACKBAR', variant: 'error', message: "Please input valid Mobile No."}));
                    return;
                }
                const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('cdiv',{size:'invisible'});
                firebase.auth().settings.appVerificationDisabledForTesting = true;
                firebase.auth().signInWithPhoneNumber("+91"+mobileNoOTP.mobileNo,recaptchaVerifier).then((resp)=>{
                    setShowOTP(true);
                    setVerifyOTP(resp);
                    console.log(resp);
                }).catch(err => {
                    console.log(err);
                    dispatch(showSnackbar({ type: 'SNACKBAR', variant: 'error', message: e.message}));
                })
                break;
            case 'SignIn':
                dispatch(signInWithPhone(verifyOTP,mobileNoOTP.otp,handleContinuation));
                break;
            default:
                break;

        }
        
    }
    const handleContinuation = (action) => {
        switch(action){
            case 'exit':
                hanClose(null,'done');
            case 'continue':
                setEnterDetailsView(true);
                
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
                <DialogContent>
                    <div hidden={enterDetailsView}>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <TextField
                                    disabled    
                                    defaultValue='+91'
                                    label=' '
                                />
                            </Grid>
                            <Grid item xs={10}>
                                <TextField
                                    onChange={handleChange}
                                    name='mno'
                                    type='tel'
                                    label='Mobile No.'
                                />
                            </Grid>
                            {/**[1,2,3,4,5,6].map((it,inx) => (
                                <Grid item xs={2} key={inx}>
                                    <TextField
                                        inputProps={{maxLength:'1'}}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            ))*/}
                            <Grid item xs={12} hidden={showOTP}>
                                <Button color='primary' id='GetOTP' name='GetOTP' onClick={handleClick} variant='contained'>Get OTP</Button>
                            </Grid>
                            <div id='cdiv' hidden></div>
                            <OTPInput
                                hidden={!showOTP}
                                length={otpLength}
                                className='OTPContainer'
                                inputclassName='OTPInput'
                                onChangeOTP={handleOTPChange}
                            />
                            <Grid item xs={12} hidden={!showOTP}>
                                <Button color='primary' id='SignIn' name='SignIn' onClick={handleClick} variant='contained'>Sign In</Button>
                            </Grid>
                        </Grid>
                    </div>
                    <EnterUserDetails hidden={!enterDetailsView} />
                </DialogContent>
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