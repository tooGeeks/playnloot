import React, { useEffect } from "react";
import { useSelector, connect, useDispatch, } from 'react-redux'
import { unit } from '../../constants'

//UI
import { makeStyles, Grid, Container, Paper, Button, Typography, CssBaseline, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Tooltip, Zoom, CircularProgress, Divider, Chip } from "@material-ui/core";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
//import { ReactComponent as Solid } from '../../imgs/soldier2.svg'
import { AccountBox, TrackChanges, Event, AccessAlarm } from '@material-ui/icons';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {firestoreConnect} from 'react-redux-firebase';
import {isinDocs,getCurrentDate, dateString, convt} from '../../Functions'
import {compose} from 'redux';
import { EnrolledDialog, MatchSummary } from '../matches/MatchSummary';
import { backDrop, clearBackDrop } from '../../store/actions/uiActions'
import Copyright from '../layout/Copyright'
import { getPlayerfromMatch } from "../../Functions";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    minHeight: '100vh'
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
  ruppeIcon: {
    backgroundColor: '#FFFFFF',
    height: '1.2em',
    width: '1.2em',
  },
  killWallet: {
    height: theme.spacing(10),
    width: theme.spacing(10),
    borderRadius: '5px',
    textAlign: 'center',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: theme.palette.custom.darkhead1,
  },
  enPaper: {
    width: '200px',
    maxWidth: '200px',
    border: '2px solid',
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.primary.main,
    borderBottomRightRadius: 10,
    marginBottom: 12,
  },
  primryColor: { color: theme.palette.primary.main },
  newMatchesBoxes: {
    border: 2,
    borderStyle: 'solid',
    borderColor: theme.palette.primary.dark,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column'
  },
  onBorderText: {
    marginTop: -10,
    marginLeft: 10,
    paddingLeft: 4,
    paddingRight: 4,
    fontSize: 14,
    fontWeight: 500,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
  },
  box1: { backgroundColor: theme.palette.custom.greenPaper, color: theme.palette.primary.contrastText },
  box2: { backgroundColor: theme.palette.custom.OrangeYellow },
  box3: { backgroundColor: theme.palette.custom.BlueSapphire },
  footer: {
    marginTop: 'auto',
    marginBottom: theme.spacing(10)
  },
}));

function Dashboard(props) {
  const classes = useStyles();
  const { profile } = useSelector(
    state => state.firebase
  )
  const {Matches, Users} = useSelector(
    state => state.firestore.ordered
  )
  const dispatch = useDispatch();

  useEffect(() => {
    if(profile.isLoaded && Matches && Users){
      dispatch(clearBackDrop())
    }else dispatch(backDrop());
  }, [profile, Matches, Users, props, dispatch]);

  if(profile.isLoaded && Matches){
    var newSolo = [];
    var newDuo = [];
    var newSquad = [];
    Matches.forEach((x) => { 
      if(x.lrdate<getCurrentDate()) return null;
      let isEnr = profile && isinDocs(profile.matches, x.id);
      if(!isEnr){
        switch (x.team) {
          case 'Solo': newSolo.push(x); break;
          case 'Duo': newDuo.push(x); break;
          case 'Squad': newSquad.push(x); break;
          default: break;
        }
      }
    });
  }

  const [expanded, setExpanded] = React.useState('panel2');
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const leaderDiv = Users ? 
    <TableContainer component={Paper} style={{maxHeight: 350,}}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell align="center">Pro Player`s ID</TableCell>
            <TableCell align="right">Kills</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Users && Users.map((player, index) => {
            return(
              <TableRow key={player.id}>
                <TableCell align="center" component="th" scope="row">#{index + 1}</TableCell>
                <TableCell align="center">{player.pubgid}</TableCell>
                <TableCell align="center">{`${player.kills}`}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  : null

    const NewMatchesBox = (props) => {
      return (
        <Grid item xs={12} sm={4}>
            <Box className={classes.newMatchesBoxes}>
              <Box display="flex" flexDirection="row">
                <Box letterSpacing={1} className={classes.onBorderText}>{props.type}</Box>
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="center">
                  {props.matchArr && props.matchArr.map((match) => {
                    return(
                      <React.Fragment key={match.id}>
                        <MatchSummary match={match} indexPos={Matches.indexOf(match)} bttnname={"Enroll"} key={match.id}/>
                        <Divider variant="middle"/>
                      </React.Fragment>
                    )
                  })}
              </Box>
            </Box>
          </Grid>
      )
    }
    const enrolledMatches = profile.isLoaded && Array.isArray(profile.matches) && Array.isArray(Matches) && (profile.matches.length !== 0) ? profile.matches && profile.matches.map((match, index) =>{
      for (const i of Matches) if(match === i.id) match = i;
      let pdx =match && getPlayerfromMatch(match.players,profile.pubgid,match.mode.team)// Fetch 
      let rank = pdx.split('-')[1]
      if(match.date<getCurrentDate()) return null
      return( match.mtime &&
        <Grid item xs={12} sm={4} key={match.id}>
          <Box className={classes.newMatchesBoxes}>
            <Box display="flex" flexDirection="row">
              <Box letterSpacing={1} className={classes.onBorderText}>{match.name}</Box>
            </Box>
            <Box p={1} ml={1} mr={1} mb={1}>
              <Box mb={1}>
                <Box fontSize={14}><Event className={classes.icons}/> {convt(1,match.mtime)}</Box>
                <Box fontSize={14}><AccessAlarm className={classes.icons}/> {match && dateString(match.date)}</Box>
                <Box fontSize={14}><AccessAlarm className={classes.icons}/>Rank : {rank}</Box>
              </Box>
              <Box display="flex" flexDirection="row" style={{width: '100%'}}>
                <Box display="inline-flex" textAlign="left" mt={1} style={{width: '60%'}}>{match.tags && (Array.isArray(match.tags) && match.tags.length) && match.tags.map((tag, ind) => {
                  return (
                    <Chip label={tag} key={ind} size="small" color="primary" style={{marginRight: 2}}/>
                    // <Box key={ind} mr={1} pr={0.5} pl={0.5} borderRadius={1} className={classes.box1}>{tag}</Box>
                  )
                })}</Box>
                <Box key={match.id} textAlign="right" style={{width: '40%'}}><EnrolledDialog match={match}/></Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      )
   }) 
   : <div>
        <Typography>You haven`t enrolled in any new matches</Typography>
        <br/> <Button size="small" align="right" variant="outlined" color="primary" onClick={() => setExpanded('panel3')}>Enroll now!</Button>
      </div>
    
  return (
    <div className={classes.root}>
    <Container>
      <Grid container
        direction="row"
        justify="center"
        spacing={1}
      >
        <Grid item xs={12} sm={6}>
            <Grid container item alignItems="flex-end">
              <Grid item>
                <AccountBox color="primary" style={{fontSize: 140}} className={classes.icons}/>
              </Grid>
              <Grid item>
                <Typography gutterBottom variant="h5" style={{marginBottom: 20}}>Hola, <br /><b>{profile.pubgid}!</b></Typography>
              </Grid>
            </Grid>
        </Grid>
        <Grid container item xs={12} sm={6} alignItems='flex-end' justify='space-around' style={{marginBottom: 20}}>
          <Grid item align="center">
            <Box boxShadow={1} className={classes.killWallet}>
              <Typography component="span">
                <CssBaseline><TrackChanges className={classes.icons}/>{profile.kills}
                </CssBaseline>
                <br/>
                Kills
              </Typography>
            </Box>
          </Grid>
          <Grid item align="center">
            <Box boxShadow={1} className={classes.killWallet}>
              <Typography component="span">
                <AccountBalanceWalletIcon className={classes.icons}/>{profile.wallet}
                <br/>
                Coins
              </Typography>
            </Box>
          </Grid>
          <Grid item align="center">
            <Box boxShadow={1} className={classes.killWallet}>
              <Tooltip title="Coins in Ruppes(₹)" TransitionComponent={Zoom}>
                <Typography component="span">
                  <center><Avatar variant="circle" className={classes.ruppeIcon}>₹</Avatar></center>
                  ₹{profile.isLoaded ? profile.wallet*unit : 0}
                </Typography>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item align="center">
            <Box boxShadow={1} className={classes.killWallet}>
              <Typography component="span">
                <AccountBalanceWalletIcon className={classes.icons}/>{profile.looted}
                <br/>
                Looted
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12}>
          <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={expanded === 'panel1' ? classes.expanelHeading : classes.panelHeading}><b>TOP PLAYERS</b></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                {leaderDiv ? leaderDiv : <Typography>Coming Soon!</Typography>}
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
                spacing={2}>
                {enrolledMatches}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={expanded === 'panel3' ? classes.expanelHeading : classes.panelHeading}><b>NEW MATCHES</b></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={2} justify="center">
                {
                  newSolo && newDuo  && newSquad
                  ? (<>
                      {newSolo.length !== 0 ? <NewMatchesBox type="Solo" matchArr={newSolo} /> : null}
                      {newDuo.length !== 0 ? <NewMatchesBox type="Duo" matchArr={newDuo} /> : null}
                      {newSquad.length !== 0 ? <NewMatchesBox type="Squad" matchArr={newSquad} /> : null}
                    </>)
                  :
                    <Grid item xs={12}><Box fontSize={14} textAlign="center">Matches Comming Soon!</Box></Grid>
                }
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </Container>
    <footer className={classes.footer}>
      <Copyright />
    </footer>
    </div>
  );
}


 const mapStatetoProps = (state)=>{
   return({
     Matches:state.firestore.ordered.Matches,
     Users:state.firestore.ordered.Users
   })
 }


export default compose(
  connect(mapStatetoProps),
  firestoreConnect([
      {collection:'Matches'},
      {collection:'Users',orderBy:['kills','desc'],limit:5,where:['kills','>',0]}
  ]))(Dashboard)