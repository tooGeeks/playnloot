import React from 'react';
import Image from '../imgs/bg-9.jpg'
import { makeStyles } from '@material-ui/styles'
import Typist from 'react-typist';
import { Typography, Container, Box } from '@material-ui/core';
import { ReactComponent as Loading } from '../../imgs/loading.svg'

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    },
    mobileback: {
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
      flex: '1 0 100%',
      minHeight: '100vh',
    },
}));

const Landing = () => {
  const classes = useStyles();
  return (
    <div className={classes.main}>
        <div className={classes.root}>
          <Box textAlign="center" className={classes.mobileback}>
            <Typist avgTypingDelay={40} className={classes.TypistWrap} cursor={{hideWhenDone: true}}>
              <Typography variant="h5"> Welcome Pro Players! </Typography>
              <Typist.Backspace count={22} delay={200} />
              <Typography variant="subtitle1"> Want to loot real money? </Typography>
              <Typography variant="body1">Get money for every kill</Typography>
              <br/>
              <Typography className={classes.enroll} variant="h6" >ENROLL IN A MATCH NOW!</Typography>
            </Typist>
          </Box>
          <Box>
            <Container>
              <Typography variant="body1">KAND</Typography>
              <Loading/>
            </Container>
          </Box>
          
        </div>        
      </div>
  );
}
/*
Texting is a brilliant way to miscommunicate how you feel and misinterperate what other people mean.
*/

export default (Landing);