import React from 'react'
import { Link } from 'react-router-dom'
//UI
import {Menu, ListItem } from '@material-ui/core'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MenuItem from '@material-ui/core/MenuItem';

const SignedOut = (props) => {
  return (
    <div>
      <ListItem color="secondary" button 
          onClick={(event) => {props.func(event, 1)}}
          selected={(props.sIndex) === 1}
          component={Link} to={'/signin'} 
          rel="noopener">
        <ListItemIcon><LockOpenIcon/></ListItemIcon>
        <ListItemText primary="Sign In"></ListItemText>
      </ListItem>
      {/**
      <ListItem color="secondary" button 
          onClick={(event) => {props.func(event, 2)}}
          selected={(props.sIndex) === 2}
          component={Link} to={'/signup'}
          rel="noopener">
        <ListItemIcon><SentimentVerySatisfiedIcon/></ListItemIcon>
        <ListItemText primary="Sign Up"></ListItemText>
      </ListItem> */}
    </div>
  )
}

export const SignedOutMenu = (props) => {
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

export default SignedOut