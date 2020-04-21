import React, { useEffect } from "react";
import { useSelector, connect, useDispatch, } from 'react-redux'

//UI
import { makeStyles, Grid, Container, Paper, List, Button, Typography, CssBaseline, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Tooltip, Zoom, CircularProgress } from "@material-ui/core";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
//import { ReactComponent as Solid } from '../../imgs/soldier2.svg'
import { AccountBox, TrackChanges, Event, AccessAlarm } from '@material-ui/icons';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {firestoreConnect} from 'react-redux-firebase';
import {isinDocs,getCurrentDate, dateString, convt} from '../../Functions'
import {compose} from 'redux';
import MatchSummary from '../matches/MatchSummary';
import { backDrop, clearBackDrop } from '../../store/actions/uiActions'
import Copyright from '../layout/Copyright'

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
    backgroundColor: theme.palette.background.paper,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: theme.spacing(10)
  },
}));

//unit for one coin (PaymentActions, Landing.js)
const unit = 5;

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
    if(profile.isLoaded ){
      dispatch(clearBackDrop())
    }else dispatch(backDrop());
  }, [profile, props, dispatch]);

  if(profile.isLoaded && Matches){
    var newSolo = [];
    var newDuo = [];
    var newSquad = [];
    Matches.forEach((x) => { 
      if(x.lrdate<getCurrentDate()) return null;
      let isEnr =  isinDocs(profile.matches, x.id);
      if(!isEnr){
        switch (x.mode) {
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
                <TableCell align="center">{player.kills}</TableCell>
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
                <Box fontSize={13} fontWeight="fontWeightMedium" letterSpacing={1} className={classes.onBorderText}>{props.type}</Box>
              </Box>
              <Box>
                <List >
                  {props.matchArr && props.matchArr.map((match) => {
                    return <MatchSummary match={match} indexPos={Matches.indexOf(match)} bttnname={"Enroll"} key={match.id}/>
                  })}
                </List>
              </Box>
            </Box>
          </Grid>
      )
    }

    const enrolledMatches = profile.isLoaded && (profile.matches) ? Matches !== undefined ? (profile.matches.length !== 0) ? profile.matches && profile.matches.map((match, index) =>{
      for (const i of Matches) if(match === i.id) match = i;
      if(match.lrdate<getCurrentDate()){
        return(
          <Paper key={index}> 
            <Typography>You haven`t enrolled in any new matches</Typography>
            <br/> <span onClick={() => setExpanded('panel3')}>Enroll now!</span>
          </Paper>
        )
      }
      return( match.mtime &&
        <Grid className={classes.enPaper} key={index}>
        <Grid item>
          <Box padding={1.5}>
            <Typography variant="body2"><Event className={classes.icons}/>&nbsp;{match && dateString(match.mdate)}&nbsp;</Typography>
            <Typography variant="body2"><AccessAlarm className={classes.icons}/>&nbsp;{convt(1,match.mtime)}</Typography>
          </Box>
            <Typography align="right" className={classes.primryColor} style={{fontWeight: 500, paddingRight: 7, paddingBottom: 2}}>{match.name}</Typography>
        </Grid>
        </Grid>
      )
   }) 
   : <div>
        <Typography>You haven`t enrolled in any new matches</Typography>
        <br/> <Button size="small" align="right" variant="outlined" color="primary" onClick={() => setExpanded('panel3')}>Enroll now!</Button>
      </div>
  : null
   : null
    
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
            <Paper className={classes.killWallet}>
              <Typography>
              <CssBaseline><TrackChanges className={classes.icons}/>{profile.kills}
              </CssBaseline>
              <br/>
              Kills
              </Typography>
            </Paper>
          </Grid>
          <Grid item align="center">
            <Paper className={classes.killWallet}>
              <Typography>
              <AccountBalanceWalletIcon className={classes.icons}/> {profile.wallet}
              <br/>
              Coins
              </Typography>
            </Paper>
          </Grid>
          <Grid item align="center">
            <Paper className={classes.killWallet}>
              <Tooltip title="Coins in Ruppes(₹)" TransitionComponent={Zoom}>
                <Typography component="div">
                  {/* <MonetizationOn className={classes.icons}/> <br/> */}
                  <center><Avatar variant="circle" className={classes.ruppeIcon}>₹</Avatar></center>
                  ₹{profile.isLoaded ? profile.wallet*unit : 0}
                </Typography>
              </Tooltip>
            </Paper>
          </Grid>
          <Grid item align="center">
            <Paper className={classes.killWallet}>
              <Typography>
              <AccountBalanceWalletIcon className={classes.icons}/> {profile.wallet}
              <br/>
              Coins
              </Typography>
            </Paper>
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
                spacing={1}>
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