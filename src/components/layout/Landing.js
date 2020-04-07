import React, { useState, useEffect } from 'react';
import Image from '../imgs/bg-9.jpg'
import { makeStyles } from '@material-ui/styles'
import Typist from 'react-typist';
import { useHistory, useParams } from 'react-router-dom'
import { useMediaQuery, useTheme , Typography, Box, Grid, Avatar, Button, Hidden, Collapse } from '@material-ui/core';
import { ReactComponent as Loading } from '../../imgs/loading.svg'

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    },
    mobileback: {
      backgroundImage: `url(${Image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    },
    otherback: {
      backgroundImage: `url(${Image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    },
    TypistWrap: {
      paddingTop: 50,
    },
    enroll: {
      paddingTop: '55vh',
      color: '#f55c2d'
    },
    root: {
      flexGrow: 1,
    },
    HDivider: {
      //minHeight: theme.spacing(15),
      //minHeight: '100%',
      width: '2px', backgroundColor: theme.palette.primary.main,
      display: 'inline-block',
      marginLeft: theme.spacing(5),
    },
    stepHeading: {
      display: 'flex',
      minWidth: '100wh',
      backgroundColor: theme.palette.main,
      padding: theme.spacing(2),
      //border: '1px solid #FFFFFF',
    },
    stepNo : {
      borderRadius: '50%',
      width: '3rem', height: '3rem',
      color: theme.palette.getContrastText(theme.palette.primary.main),
      //backgroundColor: theme.palette.primary.main,
      backgroundColor: 'linear-gradient(to bottom, #231f20, #110f10)'
    },
    stepTitle: {
      paddingLeft: theme.spacing(2),
      display: 'inline',
    },
    stepImage: {
      margin: 'auto',
    },
    stepBody: {
      margin: 'auto',
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
    },
    stepContent: {
      //backgroundColor: theme.palette.background.paper,
      backgroundColor: '#110f10',
      display: 'inline-block',
      padding: theme.spacing(2),
      borderRadius: 5,
      boxShadow: 3,
    },
    stepAction: {
      marginTop: theme.spacing(2),
      textAlign: 'right'
    },
}));

//unit for one coin (PaymentActions, Landing.js)
const unit = 5;

const Landing = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { gti } = useParams();
  const history = useHistory();
  const mDevice = useMediaQuery(theme.breakpoints.up('sm'));
  console.log(gti)
  const [activeStep, setActiveStep] = useState(gti || parseInt(0));
  const [getStart, setgetStart] = useState(localStorage.getItem('getting_Started') || {gt: false});
  const steps = getSteps();

  useEffect(() => {
    localStorage.setItem('getting_Started', localStorage.getItem('getting_Started') ? JSON.stringify({gt: false}) : JSON.stringify(getStart))
    console.log(JSON.parse((localStorage.getItem('getting_Started'))));
  }, [getStart])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function getSteps() {
    return ['Register on Playnloot', 'Buy a Coin', 'Enroll in a Match'];
  }
  
  function getStepContent(step) {
    switch (step) {
      case 0:
        return <Box className={classes.stepContent}>
                  First, you`ve to register on our app using your correct credentials!<br/>
                  <Button m="auto" color="primary" variant="outlined" style={{marginTop: '5px'}} onClick={() => history.push('/signup')}>REGISTER</Button>
                </Box>;
      case 1:
        return <Box className={classes.stepContent}>
                  Now, for earning money, we always have to invest some first!<br/>
                  We count money in terms of "Coins", you buy coins by paying us.<br/>
                  So, now you need to buy COINS (atleast one) worth ₹{unit}.<br/>
                  <Button m="auto" color="primary" variant="outlined" style={{marginTop: '5px'}} onClick={() => history.push('/wallet/view/coins')}>Buy</Button>
                </Box>;
      case 2:
        return <Box className={classes.stepContent}>
                  Wow, You`re almost close; we`ve created a Dashboard for you XP, go check it!<br/>
                  There, you`ll get a list of new matches and Enroll in a Match!<br/>
                  <Button m="auto" color="primary" variant="outlined" style={{marginTop: '5px'}} onClick={() => history.push('/dashboard')}>Check & Enroll</Button>
                </Box>;
      
      default:
        return 'Kaand! Contact Admin';
    }
  }

  return (

    <div className={classes.root}>
      <Grid container direction="column">
        <Grid container direction="row">
        <Grid item xs={12} sm={6} className={mDevice ? `${classes.mobileback}` : `${classes.otherback}`}>
          <Box textAlign="center">
            <Typist avgTypingDelay={40} className={classes.TypistWrap} cursor={{hideWhenDone: true}}>
              <Typography variant="h5"> Welcome Pro Players! </Typography>
              <Typist.Backspace count={22} delay={200} />
              <Typography variant="subtitle1"> Want to loot real money? </Typography>
              <Typography variant="body1">Earn money on your every kill</Typography>
              <br/>
              <Typography className={classes.enroll} variant="h6" >ENROLL IN A MATCH NOW!</Typography>
            </Typist>
            <Button id="gt" onClick={() => setgetStart({...getStart, gt: true})}>Get Started!</Button>
          </Box>
        </Grid>
        <Hidden xsDown>
          <Grid item xs={12} sm={6} style={{minHeight: '100vh', background: 'linear-gradient(to bottom, #231f20, #110f10)', backgroundColor: '#201c1d'}}>
            Good!
          </Grid>
        </Hidden>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center" id="getstarted">
          {steps.map((label, index) => (
            <React.Fragment key={label}>
              <Grid item xs={12} id={index}>
                <Box className={classes.stepHeading} alignItems="center"><Box><Avatar edge="start" className={classes.stepNo}>{index + 1}</Avatar></Box>&nbsp;<Typography variant="h6" className={classes.stepTitle} onClick={handleReset}>{label}</Typography></Box>
              </Grid>
              <Grid item xs={12}>
                <Collapse in={index === activeStep} {...(activeStep ? { timeout: 1000 } : {})}>
                  <Box display="flex">
                    <Hidden xsUp={index === steps.length -1  ? true : false}><Box className={classes.HDivider} /></Hidden>
                    <Box className={classes.stepBody}  display="flex" flexDirection="column" justifyContent="center">
                      {getStepContent(index)}
                      <Box className={classes.stepAction}><Button color="primary" disabled={index === 0} onClick={handleBack}>Back</Button><Button color="primary" variant="contained" onClick={handleNext}>{index>=2 ? "Finish" : "Next"}</Button></Box>
                    </Box>
                  </Box>
                </Collapse>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Grid item xs={12} sm={6}>
          
        </Grid>
      </Grid>
    </div>
  );
}

export default Landing;