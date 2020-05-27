import React from 'react';
import { convt, dateString, getPlayerfromMatch } from '../../Functions';
import { useHistory } from 'react-router-dom';
import { unit } from '../../constants';

//Updates
import { makeStyles, Typography, Button, Box, Chip } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import { showDialog } from '../../store/actions/uiActions'

const useStyles = makeStyles(theme => ({
    inline: {
        display: 'inline',
      },
    Item: {
        marginBottom: 3,
    },
    box1: { backgroundColor: theme.palette.custom.greenPaper, color: theme.palette.primary.contrastText },
}))

const Details = (props) => {
    const { mdate, lrdate, mtime, roomid, roompass} = props.match;
    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" alignItems="flex-end" mt={1} mb={1}>
                <Box mr={2} fontSize={14}>1<sup>st</sup> : ₹{props.match.survival['1']}</Box><Box mr={2} fontSize={14}>2<sup>nd</sup> : ₹{props.match.survival['2']}</Box><Box mr={2} fontSize={14}>3<sup>rd</sup> : ₹{props.match.survival['3']}</Box>
            </Box>
            <Box>Match Date: <b>{dateString(mdate)}</b></Box>
            <Box>Time: <b>{convt(1,mtime)}</b></Box>
            <Box>Last Date: <b>{dateString(lrdate)}</b></Box>
            <Box display="inline-flex" alignItems="center">Tags: &nbsp;{props.match.tags && props.match.tags.map((tag, ind) => {
                return (<Chip label={tag} key={ind} variant="outlined" size="small" color="primary" style={{marginRight: 2}}/>)
            })}</Box>
            {roomid && roompass ? <Box>Room ID: <em>{roomid}</em> &nbsp; Password: <em>{roompass}</em></Box> : null}
        </Box>
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

export const EnrolledDialog = (props) => {
    const dispatch = useDispatch();
    const { match } = props;
    return (
        <Button size="small" align="right" variant="outlined" color="primary" onClick={() => dispatch(showDialog({title: ((match.name)), content: <Details id={match.id} match={match}/>}))}>Details</Button>
    )
}

export const MatchSummary = (props) => {
    const classes = useStyles();
    //const dispatch = useDispatch();
    const history = useHistory();
    
    const {match} = props;//Passed By Calling Component
    const canEnroll = match.plno<100 ? true : false;//Checks if match is full?
    
    return(
    <Box p={2} className={classes.Item}>
        <Box display="flex" fontWeight="fontWeightMedium">
            <Box width="100%" fontSize={16}>{match.name}</Box>
            <Box flexShrink={0} fontSize={16} style={{marginRight: 15}}>₹ {(match.fee)*unit}</Box>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="flex-end" mt={1} mb={1}>
            <Box mr={2} fontSize={14}>1<sup>st</sup> : ₹{match.survival['1']}</Box><Box mr={2} fontSize={14}>2<sup>nd</sup> : ₹{match.survival['2']}</Box><Box mr={2} fontSize={14}>3<sup>rd</sup> : ₹{match.survival['3']}</Box>
        </Box>
        <Box>On: {dateString(match.mdate)}</Box>
        <Box>At: {convt(1,match.mtime)}</Box>
        {canEnroll ? null : <Typography variant="body2" fontWeight="fontWeightLight" color="error">Match Full! Enroll in any another Match :)</Typography>}
        <Box display="flex" flexDirection="row" mt={1}>
            <Box width="100%" display="inline-flex" flexDirection="row" alignItems="flex-end">{match.tags && match.tags.map((tag, ind) => {
                return (<Chip label={tag} key={ind} size="small" color="primary" style={{marginRight: 2}}/>)
            })}</Box>
            <Box flexShrink={0}><Button size="small" align="right" variant="outlined" color="primary" disabled={!canEnroll} onClick={() => history.push('/match/' + (match.id))}>Enroll</Button></Box>
            {/* <Box flexShrink={0}><Button size="small" align="right" variant="outlined" color="primary" onClick={() => dispatch(showDialog({title: ("Enroll in " + (match.name)), content: <Details id={match.id} match={match} canEnroll={canEnroll}/>, actions: <Actions mid={match.id} canEnroll={canEnroll}/>}))}>Details</Button></Box> */}
        </Box>
    </Box>
    )
}