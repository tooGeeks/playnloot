import React, { useEffect } from "react";
import { useSelector, connect, useDispatch, } from 'react-redux'

//UI
import { makeStyles, Grid, Container, Paper, List, Button, Typography, CssBaseline, Box } from "@material-ui/core";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
//import { ReactComponent as Solid } from '../../imgs/soldier2.svg'
import { AccountBox, TrackChanges, Event, AccessAlarm } from '@material-ui/icons';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {firestoreConnect} from 'react-redux-firebase';
import {isinDocs,getCurrentdate} from '../../Functions'
import {compose} from 'redux';
import MatchSummary from '../matches/MatchSummary';
import { backDrop, clearBackDrop } from '../../store/actions/uiActions'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
    paddingBottom: 65,
    paddingTop: 10,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    /*
    minHeight: '40vh',
    minWidth: '90vw',
    */
    color: theme.palette.text.secondary,
  },
  icons: {
    verticalAlign: 'middle',
  },
  killWallet: {
    height: theme.spacing(10),
    width: theme.spacing(10),
    textAlign: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  solid: {
    minHeight: 345,
    minWidth: 345,
    backgroundColor: theme.palette.background.paper,
  },
  usersBoard: {
    minWidth: '100vw',
    textAlign: "left"
  },
  playerName: {
    zIndex: -1,
    backgroundColor: '#000000',
    color: '#FFFFFF',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: theme.spacing(1, 2, 1)
  },
  panelHeading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expanelHeading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.custom.colors.darkhead1,
  },
  enPaper: {
    minWidth: '60%',
    width: '60%',

    border: '2px solid',
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.primary.main,
    borderBottomRightRadius: 10,
    marginBottom: 12,
  },
  primryColor: { color: theme.palette.primary.main },
}));

function Dashboard(props) {
  const classes = useStyles();

  const { profile } = useSelector(
    state => state.firebase
  )
  
  const dispatch = useDispatch();

  useEffect(() => {
    if(profile.isLoaded ){
      dispatch(clearBackDrop())
      
    }else dispatch(backDrop());
  }, [profile, props, dispatch]);

  const {matches} = props;
  
  console.table(matches);
  console.table(profile.matches);

  const [expanded, setExpanded] = React.useState('panel2');
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  
  const matchdiv = profile.isLoaded
    ? matches 
      ? matches && matches.map(match =>{//Used to Generate MatchList using ternary operator
        
        if(match.lrdate<getCurrentdate()){//Hides a Match if its Last Enrollment Date has Passed
          return null;
        }
        let isEnr =  isinDocs(profile.matches, match.id);//Checks if User has already ENrolled in the match
        
        console.log((match));
        console.log(matches.indexOf(match));
        return(
          
            isEnr ? null : <MatchSummary match={match} indexPos={matches.indexOf(match)} loc={"/entermatch/"} isEnr={isEnr}  bttnname={"Enroll"} key={match.id}/>
          
        )
      }) 
    : <React.Fragment>{/*Loading*/}</React.Fragment> 
    : <React.Fragment>{/*Loading*/}</React.Fragment>

    console.log(profile.matches);
    console.log(profile);
    const enMatchDiv = profile.isLoaded && (profile.matches) ? matches !== undefined ? (profile.matches.length !== 0) ? profile.matches && profile.matches.map(match =>{
      for (const i of matches)  if(match === i.id) match = i;
      if(match.lrdate<getCurrentdate()){
        return(
          <Paper> 
            <Typography>You haven`t enrolled in any new matches</Typography>
            <br/> <span onClick={() => setExpanded('panel3')}>Enroll now!</span>
          </Paper>
        )
      }
      return(
        <Grid  className={classes.enPaper}>
          <Grid item>
            <Box padding={1.5}>
              <Typography variant="body2"><Event className={classes.icons}/>&nbsp;{match.mdate}&nbsp;</Typography>
              <Typography variant="body2"><AccessAlarm className={classes.icons}/>&nbsp;{match.mtime}</Typography>
            </Box>
              <Typography align="right" className={classes.primryColor} style={{fontWeight: 500, paddingRight: 7, paddingBottom: 2}}>{match.id}</Typography>
          </Grid>
        </Grid>
          //<li className="" key={match}><div><span>Match Name : {match}</span><Link className="secondary-item" to={"/entermatch/"+match}><button className="waves-effect waves-light hoverable btn-small">Details</button></Link></div></li>
      )
   }) 
   : <div>
        <Typography>You haven`t enrolled in any new matches</Typography>
        <br/> <Button size="small" align="right" variant="outlined" color="primary" onClick={() => setExpanded('panel3')}>Enroll now!</Button>
      </div>
  : null
   : null

    // <React.Fragment>
    //   <Typography>You haven`t enrolled in any new matches</Typography>
    //   <br/> <span onClick={() => setExpanded('panel3')}>Enroll now!</span>
    // </React.Fragment>
    
  return (
    <Container className={classes.root}>
      <Grid
        container
        justify="center"
        spacing={1}
      >
        <Grid container item xs={12}
          direction="row"
          alignItems="flex-start"
          border={1}>
            <Grid container alignItems="flex-end">
              <Grid item>
                <AccountBox color="primary" style={{fontSize: 140}} className={classes.icons}/>
              </Grid>
              <Grid item>
                <Typography gutterBottom variant="h5" style={{paddingBottom: 20}}>Hola, <br /><b>{profile.pubgid}!</b></Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} container justify="space-around" alignItems="center">
            <Grid item xs={3} xl={1}>
              <Paper className={classes.killWallet}>
                <Typography>
                <CssBaseline><TrackChanges className={classes.icons}/> {profile.kills}</CssBaseline>
                <br/>
                Kills
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3} xl={1} style={{paddingLeft: 1}}>
              <Paper className={classes.killWallet}>
                <Typography>
                <AccountBalanceWalletIcon className={classes.icons}/> {profile.wallet}
                <br/>
                Coins
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3} xl={1} style={{paddingLeft: 1}}>
              <Paper className={classes.killWallet}>
                <Typography>
                <AccountBalanceWalletIcon className={classes.icons}/> {profile.wallet}
                <br/>
                Coins
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3} xl={1} style={{paddingLeft: 1}}>
              <Paper className={classes.killWallet}>
                <Typography>
                <AccountBalanceWalletIcon className={classes.icons}/> {profile.wallet}
                <br/>
                Coins
                </Typography>
              </Paper>
            </Grid>
            </Grid>
        </Grid>
        <Grid item xs={12} sm={12}>
          <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={expanded === 'panel1' ? classes.expanelHeading : classes.panelHeading}><b>LEADER BOARD</b></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                DASHBOARD CONTENTS
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded==null ? true : expanded === 'panel2' ? true : false} onChange={handleChange('panel2')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={expanded === 'panel2' ? classes.expanelHeading : classes.panelHeading}><b>ENROLLED MATCHES</b></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid 
                container
                direction="row"
                justify="center"
                spacing={1}>
                {enMatchDiv}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={expanded === 'panel3' ? classes.expanelHeading : classes.panelHeading}><b>NEW MATCHES</b></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List style={{minWidth: '100%'}}>
                {matchdiv}
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            Kand5
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            Kand6
          </Paper>
        </Grid> */}
      </Grid>
    </Container>
  );
}

const mapStatetoProps = (state)=>{
  return{
      matches:state.firestore.ordered.Matches
  }
}

export default compose(
  connect(mapStatetoProps),
  firestoreConnect([
      {collection:'Matches'}
  ]))(Dashboard)