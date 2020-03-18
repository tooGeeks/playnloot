import React from 'react';
import {convt} from '../../Functions';

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
                Match Date: <b>{mdate}</b><br/>
                Match Time: <b>{convt(1,mtime)}</b><br/>
                Last Registration Date: <b>{lrdate}</b><br/>
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
            <ListItemText primary={match.id} secondary={
                <><Typography variant="caption">Match Date: {match.mdate}</Typography></>} />
            <Button disabled={isEnr} size="small" align="right" variant="outlined" color="primary"  edge="end" onClick={() => dispatch(showDialog({title: ("Enroll in " + (match.id)), content: <Details id={match.id} match={match} canEnroll={canEnroll}/>, actions: <Actions mid={match.id} canEnroll={canEnroll}/>}))}>Details</Button>
        </ListItem>
    </>
    )
}


// const MatchSummary = (props)=>{
//     const {match,loc,bttnname,isEnr} = props;//Passed By Calling Component
//     const canEnroll = match.plno<99 ? true : false;//Checks if match is full?
//     const link = canEnroll && !isEnr ? loc+match.id : window.location.pathname ;// Sets the button link to be the match if cannot enroll sets to current path
//     const canEnrollmsg = canEnroll ? null : <div><span className='red-text'><b>Match is Full</b></span><br/></div> ; //Displays a message if Match is Full
//     const isEnrolledmsg = isEnr ? <div><span className='green-text'><b>Already Enrolled</b></span><br/></div> : null ;  // Displays a Message if Already Enrolled
//     const fmsg = isEnr ? isEnrolledmsg : canEnrollmsg; //Final message depending upon enrollment status
//     return(
//         <div className="row">
//             <div className="col s12 m6">
//             <div className="card black">
//                 <div className="card-content white-text">
//                 <span className='card-title'>Match Name : {match.id}&emsp;</span><br/>
//                 <span className='white-text'>Match Date : {match.mdate}&emsp;</span><br/>
//                 <span className='white-text'>L.Reg Date : {match.lrdate}&emsp;</span><br/>
//                 <span className='white-text'>Match Time : {convt(1,match.mtime)}&emsp;</span><br/>{/* Converts Time */}
//                 <span className='white-text'>Players Enrolled : {match.plno}&emsp;</span><br/>
//                 {fmsg}
//                 </div>
//                 <div className="card-action">
//                     <Link className="white-text" to={link}><button className="waves-effect waves-light btn-small" id={match.id} disabled={!canEnroll || isEnr}>{bttnname}</button></Link>
//                 </div>
//             </div>
//             </div>
//         </div>
//     )
// }

export default MatchSummary;