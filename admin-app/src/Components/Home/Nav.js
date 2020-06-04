import React from 'react';
import { connect, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import SignedIn, { SignedInMenu } from '../Auth/SignedIn'
import SignedOut, { SignedOutMenu } from '../Auth/SignedOut'
//UI
import AppBar from '@material-ui/core/AppBar';
import { makeStyles, Typography, LinearProgress } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Badge';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


const useStyles = makeStyles(theme => ({
  appBar: {
      top: 'auto',
      bottom: 0,
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
    left: 0,
    right: 0,
    margin: '0 auto',
  },
  fullList: {
      width: 'auto',
  },
}))

const Nav = (props) => {
    const { auth, profile, modeControl } = props;
    const classes = useStyles();
    const history = useHistory();
    const { backDropOpen } = useSelector( state => state.ui )
    //def no-unused-vars
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };

    const [state, setState] = React.useState({ bottom: false });
    const [anchorEl, setAnchorEl] = React.useState(null);

    const mhandleClick = event => {
      setAnchorEl(event.currentTarget);
    };

    const mhandleClose = () => {
      setAnchorEl(null);
    };

    const mhandleBack = () => {
      history.goBack();
    }

    const toggleDrawer = (side, open) => event => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }

      setState({ ...state, [side]: open });
    };

    //React.forwardRef((props, ref) => <div role="button" {...props} ref={ref} />);
    //const links = auth.uid ? <SignedIn profile={profile} sIndex={selectedIndex} func={handleListItemClick}/> : <SignedOut sIndex={selectedIndex} func={handleListItemClick}/>;
    const links = auth.uid ? <SignedIn user={profile.pubgid} func={toggleDrawer}/> : <SignedOut x={selectedIndex} func={handleListItemClick}/>
   

    // eslint-disable-next-line no-unused-vars
    const menuLinks = auth.uid ? <SignedInMenu modeControl={modeControl} anch={anchorEl} func1={mhandleClick} func2={mhandleClose} /> : <SignedOutMenu modeControl={modeControl} anch={anchorEl} func1={mhandleClick} func2={mhandleClose}/>

    const fullList = side => (
      <div
        className={classes.fullList}
        role="presentation"
        onClick={auth.uid ? null : toggleDrawer(side, false)}
        onKeyDown={toggleDrawer(side, false)}
      >
      {/* <div align="center" style={{margin: 0, padding: 0}}><MoreHorizIcon/></div> */}
        {links}
      </div>
    );


    const Coincount = () => {
      return (
        <IconButton color="inherit" component={Link} to={'/wallet/view/coins'}>
          <Avatar>
            <AccountBalanceWalletIcon /><Typography>: {profile.wallet}</Typography>
          </Avatar>
        </IconButton>
      )
    }
    return(
      <div>
          
          <AppBar position="fixed" color="primary" className={backDropOpen ? `${classes.appBar} ${classes.loadAppBar}` : classes.appBar}>
              <LinearProgress variant="query" hidden={!backDropOpen}/>
              <Toolbar>
                  <IconButton edge="start" color="inherit" aria-label="back" onClick={mhandleBack}>
                    <ArrowBackIcon />   
                  </IconButton>
                  {/* <Fab color="secondary" aria-label="add" className={classes.fabButton}>
                      { profile.pubgid ? profile.pubgid : <AddCircleOutline />}
                  </Fab> */}
                  <div className={classes.grow} />
                  {auth.uid ? <Coincount/> : null}
                  {/* <IconButton edge="end" color="inherit" onClick={mhandleClick}>
                      <MoreIcon/>
                  </IconButton> */}
                  <IconButton edge="end" color="inherit" aria-label="open drawer" onClick={toggleDrawer('bottom', true)}>
                      <MenuIcon />
                  </IconButton>
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
          {/* {menuLinks} */}
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