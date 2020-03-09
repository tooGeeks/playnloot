import React from "react";
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

//UI
import { makeStyles, withStyles, Grid, Container, Paper, Divider, Badge, Typography, CssBaseline } from "@material-ui/core";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import { ReactComponent as Solid } from '../../imgs/soldier2.svg'
import { AccountBox, TrackChanges } from '@material-ui/icons';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



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
}));

const StyledBadge = withStyles(theme => ({
  badge: {
    border: `2px solid #000000`,
    padding: theme.spacing(1.5, 1, 1.5),
    borderRadius: 5,
    fontSize: 16,
    boxShadow: `1px 1px 5px 0px rgba(0,0,0,0.75)`,
  },
}))(Badge)

export default function Dashboard() {
  const classes = useStyles();
  const { profile, auth } = useSelector(
    state => state.firebase
  )
  const [expanded, setExpanded] = React.useState(null);
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!auth.uid) return <Redirect to='/signin' />
  return (
    <Container className={classes.root}>
      <Grid
        container
        justify="center"
        spacing={1}
      >
        {/*
        <Grid item>
          <StyledBadge invisible={!profile.isLoaded} badgeContent={"Kills: " + profile.kills} color="secondary" overlap={"circle"} anchorOrigin={{vertical: 'top', horizontal: 'right',}}>
            <StyledBadge invisible={!profile.isLoaded} badgeContent={"Wallet: " + profile.wallet} color="secondary" overlap={"circle"} anchorOrigin={{vertical: 'bottom', horizontal: 'left',}}>
              <Avatar className={classes.solid} variant="rounded">
                <Solid className={classes.solid}/>
              </Avatar>
            </StyledBadge>
          </StyledBadge>
            <Typography align="center" className={classes.playerName} gutterBottom>{profile.pubgid}</Typography>
        </Grid>
        */}
        <Grid container item xs={12}
          direction="row"
          alignItems="flex-start"
          border={1}>
            <Grid container alignItems="flex-end">
              <Grid item>
                <AccountBox color="primary" style={{fontSize: 140}}/>
              </Grid>
              <Grid item>
                <Typography gutterBottom variant="h5" style={{paddingBottom: 20}}>Hola, <br /><b>{profile.pubgid}!</b></Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} container justify="space-around" alignItems="center">
            <Grid item xs={3} xl={1}>
              <Paper className={classes.killWallet}>
                <Typography>
                <CssBaseline><TrackChanges/> {profile.kills}</CssBaseline>
                <br/>
                Kills
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3} xl={1} style={{paddingLeft: 1}}>
              <Paper className={classes.killWallet}>
                <Typography>
                <AccountBalanceWalletIcon/> {profile.wallet}
                <br/>
                Coins
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3} xl={1} style={{paddingLeft: 1}}>
              <Paper className={classes.killWallet}>
                <Typography>
                <AccountBalanceWalletIcon/> {profile.wallet}
                <br/>
                Coins
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3} xl={1} style={{paddingLeft: 1}}>
              <Paper className={classes.killWallet}>
                <Typography>
                <AccountBalanceWalletIcon/> {profile.wallet}
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
              <Typography className={classes.panelHeading}><b>LEADER BOARD</b></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                DASHBOARD CONTAENTS
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded==null ? true : expanded === 'panel2' ? true : false} onChange={handleChange('panel2')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={classes.panelHeading}><b>ENROLLED MATCHES</b></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                You haven`t enrolled in any new matches ;(
                <br/> <span onClick={() => setExpanded('panel3')}>Enroll now!</span>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={classes.panelHeading}><b>NEW MATCHES</b></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                DASHBOARD CONTAENTS
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            Kand5
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            Kand6
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}