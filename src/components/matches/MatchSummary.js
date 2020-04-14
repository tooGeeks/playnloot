import React from 'react';
import {convt,dateString} from '../../Functions';

//Updates
import { makeStyles, Typography, Button } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { deepOrange } from '@material-ui/core/colors';
import {useDispatch, useSelector} from 'react-redux'
import {showDialog} from '../../store/actions/uiActions'
import {enterMatch} from '../../store/actions/MatchActions'

/*
  This Component is used to Display the Details of a Match.
  It is like a template which can be used for any list of matches with details
*/
const useStyles = makeStyles(theme => ({
    inline: {
        display: 'inline',
      },
    Item: {
        
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
      },
}))

const Details = (props) => {
    const { mdate, lrdate, plno, mtime} = props.match;
    return (
        <div>
            <br/>
            <Typography>
                Match Date: <b>{dateString(mdate)}</b><br/>
                Match Time: <b>{convt(1,mtime)}</b><br/>
                Last Registration Date: <b>{dateString(lrdate)}</b><br/>
                Pros Enrolled: <b>{plno}</b><br/>
                {props.canEnroll ? null : <Typography variant="caption" color="error">Match Full! Enroll in any another Match :)</Typography>}
            </Typography>
        </div>
    )
}

const Actions = (props) => {
    const dispatch = useDispatch();
    const { auth } = useSelector(
        state => state.firebase
    )
    return(
        <>
            <Button disabled={!props.canEnroll} color="primary" onClick={() => dispatch(enterMatch(props.mid, auth.uid))}>
                Enroll
            </Button>
        </>
    )
}


const MatchSummary = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const {match,isEnr} = props;//Passed By Calling Component
    const canEnroll = match.plno<100 ? true : false;//Checks if match is full?
    
    return(
    <>
        <ListItem className={classes.Item}>
            <ListItemText primary={match.name} secondary={
                <><Typography variant="caption">Match Date: {dateString(match.mdate)}</Typography></>} />
            <Button disabled={isEnr} size="small" align="right" variant="outlined" color="primary"  edge="end" onClick={() => dispatch(showDialog({title: ("Enroll in " + (match.name)), content: <Details id={match.id} match={match} canEnroll={canEnroll}/>, actions: <Actions mid={match.id} canEnroll={canEnroll}/>}))}>Details</Button>
        </ListItem>
    </>
    )
}

export default MatchSummary;