import React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
//UI
import AppBar from '@material-ui/core/AppBar';
import { makeStyles, Typography, LinearProgress, Toolbar, ListItem, ListItemIcon, ListItemText, Collapse, List, Divider, ListSubheader, SwipeableDrawer, IconButton, Button, Fab } from '@material-ui/core';
// import { Menu, MenuItem } from '@material-ui/core'
import { Menu as MenuIco, ArrowBack, AccountBox, AccountBalanceWallet, ExpandLess, ExpandMore, Add, AttachMoney, ExitToApp, LockOpen, SentimentVerySatisfied, More, AddBox, AddCircleOutline, Share, GetApp } from '@material-ui/icons';
import { signOut } from '../../store/actions/authActions'
import { openInstallApp } from '../../store/actions/uiActions'

const useStyles = makeStyles(theme => ({
  appBar: {
      top: 'auto',
      bottom: 0,
      backgroundColor: theme.palette.background.paper,
       color: '#fff'
  },
  loadAppBar: {
    zIndex: 1501
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    // left: 0,
    right: 15,
    // margin: '0 auto',
  },
  fullList: {
      width: 'auto',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

const Nav = (props) => {
    const { auth, profile, modeControl } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { backDropOpen, isAppInstalled } = useSelector(state => state.ui)

    const [state, setState] = React.useState({ bottom: false });
    const toggleDrawer = (side, open) => event => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setState({ ...state, [side]: open });
    };

    // const [anchorEl, setAnchorEl] = React.useState(null);
    // const mhandleClick = event => {
    //   setAnchorEl(event.currentTarget);
    // };
    // const mhandleClose = () => {
    //   setAnchorEl(null);
    // };

    const mhandleBack = () => {
      history.goBack();
    }

    const logOut = () => {
      toggleDrawer('bottom', false);
      dispatch(signOut());
    }

    const AuthLinks = () => {
      const [openList, setOpenList] = React.useState(0);
      const expandList = (index) => {
        openList === index ? setOpenList(0) : setOpenList(index);
      }
      return (
        <React.Fragment>
        <ListItem button component={Link} to={'/dashboard'} rel="nooperner" selected={(window.location.pathname).includes('/dashboard')} onClick={toggleDrawer('bottom', false)}>
          <ListItemIcon><AccountBox/></ListItemIcon>
          <ListItemText primary={profile.pubgid + "`s DashBoard"}></ListItemText>
        </ListItem>
        <ListItem id="hostmatch" button component={Link} to={'/hostmatch'} selected={(window.location.pathname).includes('/hostmatch')} onClick={toggleDrawer('bottom', false)}>
          <ListItemIcon><AddBox/></ListItemIcon>
          <ListItemText primary={"Host Match"}></ListItemText>
        </ListItem>
        <ListItem id="wallet" button onClick={() => expandList(1)}>
          <ListItemIcon><AccountBalanceWallet /></ListItemIcon>
          <ListItemText primary={"Wallet"}></ListItemText>
          {openList === 1 ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openList === 1} timeout="auto">
          <List component="div" disablePadding>
            <ListItem button className={classes.nested} selected={(window.location.pathname).includes('/wallet')} component={Link} to={'/wallet/view/coins'} onClick={toggleDrawer('bottom', false)}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Buy Coins" />
            </ListItem>
            <ListItem button className={classes.nested} selected={(window.location.pathname).includes('/reqwithdrawal')} component={Link} to={'/reqwithdrawal'} onClick={toggleDrawer('bottom', false)}>
              <ListItemIcon>
                <AttachMoney />
              </ListItemIcon>
              <ListItemText primary="Withdraw Money" />
            </ListItem>
          </List>
        </Collapse>
        <Divider />
        <ListItem button onClick={logOut}>
          <ListItemIcon><ExitToApp/></ListItemIcon>
          <ListItemText primary={"Logout"}></ListItemText>
        </ListItem>
        </React.Fragment>
      )
    }

    const NoAuthLinks = () => {
      return (
        <React.Fragment>
        <ListItem color="secondary" button 
          onClick={toggleDrawer('bottom', false)}
          selected={(window.location.pathname).includes('/signin')}
          component={Link} to={'/signin'} 
          rel="noopener">
        <ListItemIcon><LockOpen/></ListItemIcon>
        <ListItemText primary="Sign In"></ListItemText>
        </ListItem>
        <ListItem color="secondary" button 
            onClick={toggleDrawer('bottom', false)}
            selected={(window.location.pathname).includes('/signup')}
            component={Link} to={'/signup'} 
            rel="noopener">
          <ListItemIcon><SentimentVerySatisfied/></ListItemIcon>
          <ListItemText primary="Sign Up"></ListItemText>
        </ListItem>
        </React.Fragment>
      )
    }

    const fullList = side => (
      <div
        className={classes.fullList}
        role="presentation"
        onKeyDown={toggleDrawer(side, false)}
      >
      {/* <div align="center" style={{margin: 0, padding: 0}}><MoreHorizIcon/></div> */}
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              PlayNLoot
            </ListSubheader>
          }
        >
          {auth.uid ? <AuthLinks /> : <NoAuthLinks />}
        </List>
      </div>
    );


    const Coincount = () => {
      return (
        <Button color="inherit" component={Link} to={'/wallet/view/coins'}>
          <AccountBalanceWallet /><Typography>: {profile.wallet}</Typography>
        </Button>
      )
    }
    return(
      <div>
          
          <AppBar position="fixed" className={backDropOpen ? `${classes.appBar} ${classes.loadAppBar}` : classes.appBar}>
              <LinearProgress variant="query" hidden={!backDropOpen}/>
              <Toolbar>
                {isAppInstalled && isAppInstalled 
                ? <IconButton edge="start" color="inherit" aria-label="back" onClick={mhandleBack}><ArrowBack /></IconButton>
                : <IconButton color="inherit" aria-label="install" onClick={() => dispatch(openInstallApp)}>< GetApp /></IconButton>
                }
                  
                  <IconButton color="inherit" aria-label="install">< GetApp /></IconButton>
                  <IconButton color="inherit" aria-label="share"><Share /></IconButton>
                  {auth.uid ? <Coincount /> : null}
                  {/* <Fab color="secondary" aria-label="add" className={classes.fabButton}>
                    <MenuIco/>
                  </Fab> */}
                  <div className={classes.grow} />
                  {/* {auth.uid ? <Coincount /> : null} */}
                  {/* <IconButton edge="end" color="inherit" onClick={mhandleClick}>
                      <More/>
                  </IconButton> */}
                  <Fab color="secondary" aria-label="add" className={classes.fabButton}>
                  <IconButton color="inherit" aria-label="open drawer" onClick={toggleDrawer('bottom', true)}>
                      <MenuIco/>
                  </IconButton>
                  </Fab>
              </Toolbar>
              <SwipeableDrawer
                  anchor="bottom"
                  swipeAreaWidth={30}
                  open={state.bottom}
                  onClose={toggleDrawer('bottom', false)}
                  onOpen={toggleDrawer('bottom', true)}
              >
                  {fullList('bottom')}
              </SwipeableDrawer>
          </AppBar>
          {/* <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={mhandleClose}
          >
            <MenuItem onClick={modeControl}>
              Light/Dark Mode
            </MenuItem>
            <MenuItem onClick={mhandleClose}>
              Close
            </MenuItem>
          </Menu> */}
      </div>
    )
}
const mapStateToProps = (state) => {
  return{
    auth: state.firebase.auth,
    authError: state.auth.authError,
    profile: state.firebase.profile
  }
}


export default connect(mapStateToProps)(Nav);