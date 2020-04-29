import React from 'react';
import {convt,dateString} from '../../Functions';
import { useHistory } from 'react-router-dom';

//Updates
import { makeStyles, Typography, Button, Box } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { deepOrange } from '@material-ui/core/colors';
import {useDispatch} from 'react-redux'
import {showDialog} from '../../store/actions/uiActions'

/*
  This Component is used to Display the Details of a Match.
  It is like a template which can be used for any list of matches with details
*/
const useStyles = makeStyles(theme => ({
    inline: {
        display: 'inline',
      },
    Item: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
      },
    box1: { backgroundColor: theme.custom.colors.greenPaper, color: theme.palette.primary.contrastText },
}))

const Details = (props) => {
    const { mdate, lrdate, plno, mtime} = props.match;
    return (
        <div>
            <br/>
            <Typography>
                Match Date: <b>{dateString(mdate)}</b><br/>
                Match Time: <b>{convt(1,mtime)}</b><br/>
                Last Date: <b>{dateString(lrdate)}</b><br/>
                Pros Enrolled: <b>{plno}</b><br/>
                {props.canEnroll ? null : <Typography variant="caption" color="error">Match Full! Enroll in any another Match :)</Typography>}
            </Typography>
        </div>
    )
}

const Actions = (props) => {
    const history = useHistory();
    return(
        <>
            <Button disabled={!props.canEnroll} color="primary" onClick={() => history.push('/playerEnroll/' + (props.mid))}>
                Enroll
            </Button>
        </>
    )
}


const MatchSummary = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const {match} = props;//Passed By Calling Component
    const canEnroll = match.plno<100 ? true : false;//Checks if match is full?
    
    return(
    <>
        <ListItem className={classes.Item}>
            <ListItemText style={{marginRight: 3}} primary={match.name} secondary={
                <><Typography variant="caption">On: {dateString(match.mdate)}<br/>At: {match.mtime}<Box display="inline-flex">{match.tags && match.tags.map((tag, ind) => {
                    return (<Box key={ind} ml={1} borderRadius={1} className={classes.box1}>&nbsp;{tag}&nbsp;</Box>)
                })}</Box></Typography></>} />
            <Button size="small" align="right" variant="outlined" color="primary"  edge="end" onClick={() => dispatch(showDialog({title: ("Enroll in " + (match.name)), content: <Details id={match.id} match={match} canEnroll={canEnroll}/>, actions: <Actions mid={match.id} canEnroll={canEnroll}/>}))}>Details</Button>
        </ListItem>
    </>
    )
}

export default MatchSummary;