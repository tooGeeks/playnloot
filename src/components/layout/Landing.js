import React, { useState, useEffect } from 'react';
import Image from '../imgs/bg_100_202329.jpg'
import { makeStyles } from '@material-ui/styles'
import Typist from 'react-typist';
import { useHistory} from 'react-router-dom'
import { Typography, Box, Grid, Button, Container, Stepper, Step, StepLabel, StepContent } from '@material-ui/core';
import { ReactComponent as Loading } from '../../imgs/loading.svg'
import Copyright from './Copyright';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    minHeight: '100vh',
    marginBottom: theme.spacing(8),
  },
  bgImg: {
    //width: '80vw',
    height: '50vh'
  },
  TypistWrap: {
    //paddingTop: 50,
    minHeight: '105px',
    //border: '1px solid #121212'
  },
  enroll: {
    color: '#f6734a'
  },
  GetStartBtn: {
    backgroundColor: theme.palette.background.paper,
  },
  stepContent: {
    paddingBottom: theme.spacing(2),
  },
  actionsContainer: {
    textAlign: 'right'
  },
  Description: {
    marginTop: theme.spacing(4),
  }
}));

//unit for one coin (PaymentActions, Landing.js)
const unit = 5;

const Landing = () => {
  const classes = useStyles();
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(parseInt(0));
  const [getStart, setgetStart] = useState(localStorage.getItem('getting_Started') || {gt: false});
  const steps = getSteps();

  useEffect(() => {
    localStorage.setItem('getting_Started', localStorage.getItem('getting_Started') ? JSON.stringify({gt: false}) : JSON.stringify(getStart))
    console.log(JSON.parse((localStorage.getItem('getting_Started'))));
  }, [getStart])

  const handleClicks = (opt) => {
    switch(opt){
      case 'handleNext': setActiveStep((prevActiveStep) => prevActiveStep + 1); break;
      case 'handleBack': setActiveStep((prevActiveStep) => prevActiveStep - 1); break;
      case 'handleReset': setActiveStep(0); break;
      default: console.log("handleClick: Case Mismatch!"); break;
    }
  }

  function getSteps() {
    return ['Register on Playnloot', 'Buy a Coin', 'Enroll in a Match'];
  }
  
  function getStepContent(step) {
    switch (step) {
      case 0:
        return <>
                  First, you`ve to register on our app using your correct credentials!
                </>;
      case 1:
        return <>
                  Now, for earning money, we always have to invest some first!<br/>
                  We count money in terms of "Coins", you buy coins by paying us.<br/><br/>
                  So, now you need to buy COINS (atleast one) worth ₹{unit}.
                </>;
      case 2:
        return <>
                  Wow, You`re almost close; we`ve created a Dashboard for you XP, go check it!<br/>
                  There, you`ll get a list of new matches and Enroll in a Match!
                </>;
      
      default:
        return 'Kaand! Contact Admin';
    }
  }

  return (

    <div className={classes.root}>
      <Grid container direction="column">
        <Grid container direction="row">
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" style={{height: '95vh'}}>
            <Typist avgTypingDelay={40} className={classes.TypistWrap} cursor={{show: false, hideWhenDone: false}}>
              <Box fontSize="h4.fontSize" letterSpacing={6} fontFamily="Monospace" style={{color: '#f6734a'}}>PLAY N LOOT</Box><br />
              {/* <Typist.Backspace count={22} delay={200} /> */}
              <Box fontSize="h6.fontSize" fontWeight="fontWeightLight"> Want to loot real money? <br /> 
              Earn money on your every kill!</Box>
            </Typist>
            <img src={Image} className={classes.bgImg} alt="Get Enrolled"/>
            <Box className={classes.TypistWrap}>
              <Typography className={classes.enroll} variant="h6" >ENROLL IN A MATCH NOW!</Typography>
              <br/>
              <Button className={classes.GetStartBtn} variant="outlined" size="large" onClick={() => history.push('/signup')}>Get Started</Button>
              <Box fontSize={13} fontWeight="fontWeightLight" style={{marginTop: 2, textDecoration: 'underline', cursor: 'help'}} id="gt" onClick={() => {setgetStart({...getStart, gt: true}); document.querySelector('#getstarted').scrollIntoView({ behavior: 'smooth', block: 'center'})}}>Know More</Box>
            </Box>
          </Box>
        </Grid>
        </Grid>
        <Container>
        <Grid container direction="row" id="getstarted">
          <Grid item xs={12} sm={6}>
            <Box fontSize="h6.fontSize" letterSpacing={1} textAlign="center" padding={2}>
              Steps to Participate
            </Box>
            <Box display="flex" justifyContent="center">
              <Stepper activeStep={activeStep} orientation="vertical" style={{maxWidth: '600px'}}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      <Box className={classes.stepContent}>{getStepContent(index)}</Box>
                      <div className={classes.actionsContainer}>
                        <div>
                          <Button
                            disabled={activeStep === 0}
                            onClick={() => handleClicks('handleBack')}
                            className={classes.button}
                          >
                            Back
                          </Button>
                          <Button
                            align="right"
                            variant="contained"
                            color="primary"
                            onClick={() => handleClicks('handleNext')}
                            className={classes.button}
                          >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                        </div>
                      </div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box fontSize="h6.fontSize" letterSpacing={1} textAlign="center" padding={2}>
            Rules to follow
          </Box>
        </Grid>
        </Grid>
        <Copyright />
        </Container>
      </Grid>
    </div>
  );
}

export default Landing;