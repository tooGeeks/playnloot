import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import SignedIn, { SignedInMenu } from './SignedIn'
import SignedOut, { SignedOutMenu } from './SignedOut'
//UI
import AppBar from '@material-ui/core/AppBar';
import { makeStyles, Typography, List } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Badge';
import MoreIcon from '@material-ui/icons/MoreVert';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';


const useStyles = makeStyles(theme => ({
    appBar: {
        top: 'auto',
        bottom: 0,
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

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };

    //React.forwardRef((props, ref) => <div role="button" {...props} ref={ref} />);
    const links = auth.uid ? <SignedIn profile={profile} sIndex={selectedIndex} func={handleListItemClick}/> : <SignedOut sIndex={selectedIndex} func={handleListItemClick}/>;
    
    const [state, setState] = React.useState({ bottom: false });
    const [anchorEl, setAnchorEl] = React.useState(null);

    const mhandleClick = event => {
      setAnchorEl(event.currentTarget);
    };

    const mhandleClose = () => {
      setAnchorEl(null);
    };

    const menuLinks = auth.uid ? <SignedInMenu modeControl={modeControl} anch={anchorEl} func1={mhandleClick} func2={mhandleClose} /> : <SignedOutMenu modeControl={modeControl} anch={anchorEl} func1={mhandleClick} func2={mhandleClose}/>

    const toggleDrawer = (side, open) => event => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }

      setState({ ...state, [side]: open });
    };


    const fullList = side => (
      <div
        className={classes.fullList}
        role="presentation"
        onClick={toggleDrawer(side, false)}
        onKeyDown={toggleDrawer(side, false)}
      >
      <List>
        {links}
      </List>
      </div>
    );


    const Coincount = () => {
      return (
        <IconButton color="inherit" component={Link} to={'/wallet'}>
          <Avatar>
            <AccountBalanceWalletIcon /><Typography>: {profile.wallet}</Typography>
          </Avatar>
        </IconButton>
      )
    }
    
    return(
        <div>
            <AppBar position="fixed" color="primary" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer('bottom', true)}>
                        <MenuIcon />
                    </IconButton>

                    {/*
                    <Fab color="secondary" aria-label="add" className={classes.fabButton}>
                        { profile.pubgid ? profile.pubgid : <AddIcon />}
                    </Fab>
                    */}
                    <div className={classes.grow} />
                    {auth.uid ? <Coincount/> : null}
                    <IconButton edge="end" color="inherit" onClick={mhandleClick}>
                        <MoreIcon/>
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
            {menuLinks}
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