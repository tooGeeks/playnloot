import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'
//UI
import { ListItem, Menu, Collapse, List, makeStyles, ListSubheader, Divider } from '@material-ui/core'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuItem from '@material-ui/core/MenuItem';
import { ExpandLess, ExpandMore, AccountBalanceWallet, AttachMoney, Add } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const SignedIn = (props) => {
  const classes = useStyles();
  const [openList, setOpenList] = React.useState(0);
  const expandList = (index) => {
    openList === index ? setOpenList(0) : setOpenList(index);
  }
  const logOut = () => {
    props.func('bottom', false);
    props.signOut();
  }

  return(
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          PlayNLoot
        </ListSubheader>
      }
    >
      <ListItem button component={Link} to={'/dashboard'} rel="nooperner" onClick={props.func('bottom', false)}>
        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
        <ListItemText primary={props.user + "`s DashBoard"}></ListItemText>
      </ListItem>
      <ListItem id="wallet" button onClick={() => expandList(1)}>
        <ListItemIcon><AccountBalanceWallet /></ListItemIcon>
        <ListItemText primary={"Wallet"}></ListItemText>
        {openList === 1 ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openList === 1} timeout="auto">
        <List component="div" disablePadding>
          <ListItem button className={classes.nested} component={Link} to={'/wallet/view/coins'} onClick={props.func('bottom', false)}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Buy Coins" />
          </ListItem>
          <ListItem button className={classes.nested} component={Link} to={'/reqwithdrawal'} onClick={props.func('bottom', false)}>
            <ListItemIcon>
              <AttachMoney />
            </ListItemIcon>
            <ListItemText primary="Withdraw Money" />
          </ListItem>
        </List>
      </Collapse>
      <Divider />
      <ListItem button onClick={logOut}>
        <ListItemIcon><ExitToAppIcon/></ListItemIcon>
        <ListItemText primary={"Logout"}></ListItemText>
      </ListItem>
    </List>
  )
}

export const SignedInMenu = (props) => {
  return (
    <Menu
      id="simple-menu"
      anchorEl={props.anch}
      keepMounted
      open={Boolean(props.anch)}
      onClose={props.func2}
    >
      <MenuItem onClick={props.modeControl}>
        Light/Dark Mode
      </MenuItem>
      <MenuItem onClick={props.func2}>
        Close
      </MenuItem>
    </Menu>
  );
}
  
const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}
  
export default connect(null, mapDispatchToProps)(SignedIn)  