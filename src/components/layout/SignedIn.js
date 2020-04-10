import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'
//UI
import { ListItem, Menu } from '@material-ui/core'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuItem from '@material-ui/core/MenuItem';


const SignedIn = (props) => {
  
    return (
      <div>
        <ListItem color="secondary" button
            onClick={(event) => {props.func(event, 1)}}
            selected={(props.sIndex) === 1}
            component={Link} to={'/dashboard'} 
            rel="noopener">
          <ListItemIcon><AccountBoxIcon/></ListItemIcon>
          <ListItemText primary={props.profile.pubgid + "`s DashBoard"}></ListItemText>
        </ListItem>
        <ListItem color="secondary" button onClick={props.signOut}>
          <ListItemIcon><ExitToAppIcon/></ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </ListItem>
      </div>
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