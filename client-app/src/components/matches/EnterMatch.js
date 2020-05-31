// import React from 'react';
// import { Link } from 'react-router-dom';
// import {convt} from '../../Functions';

// //Updates
// import { makeStyles, Typography } from '@material-ui/core';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import Avatar from '@material-ui/core/Avatar';
// import ImageIcon from '@material-ui/icons/Image';


// /*
//   This Component is used to Display the Details of a Match.
//   It is like a template which can be used for any list of matches with details
// */
// const useStyles = makeStyles(theme => ({
//     inline: {
//         display: 'inline',
//       },
//     Item: {
        
//     },
// }))

// const MatchSummary = (props) => {
//     const classes = useStyles();
//     const count = 0;
//     const {match,loc,bttnname,isEnr} = props;//Passed By Calling Component
//     const canEnroll = match.plno<99 ? true : false;//Checks if match is full?
//     const link = canEnroll && !isEnr ? loc+match.id : window.location.pathname ;// Sets the button link to be the match if cannot enroll sets to current path
//     const canEnrollmsg = canEnroll ? null : <React.Fragment><Typography><b>Match is Full</b></Typography><br/></React.Fragment> ; //Displays a message if Match is Full
//     const isEnrolledmsg = isEnr ? <React.Fragment><Typography><b>Already Enrolled</b></Typography><br/></React.Fragment> : null ;  // Displays a Message if Already Enrolled
//     const fmsg = isEnr ? isEnrolledmsg : canEnrollmsg; //Final message depending upon enrollment status
//     return(
//     <>
//         <ListItem className={classes.Item} button>
//             <ListItemAvatar>
//             <Avatar className={classes.orange}>
//                 {count + 1}
//             </Avatar>
//             </ListItemAvatar>
//             <ListItemText primary={match.id} secondary={
//                 <><Typography variant="caption">Match Date: {match.date}</Typography></>} />
//             <Typography edge="end">Enroll</Typography>
//         </ListItem>
//     </>
//     )
// }



// // const MatchSummary = (props)=>{
// //     const {match,loc,bttnname,isEnr} = props;//Passed By Calling Component
// //     const canEnroll = match.plno<99 ? true : false;//Checks if match is full?
// //     const link = canEnroll && !isEnr ? loc+match.id : window.location.pathname ;// Sets the button link to be the match if cannot enroll sets to current path
// //     const canEnrollmsg = canEnroll ? null : <div><span className='red-text'><b>Match is Full</b></span><br/></div> ; //Displays a message if Match is Full
// //     const isEnrolledmsg = isEnr ? <div><span className='green-text'><b>Already Enrolled</b></span><br/></div> : null ;  // Displays a Message if Already Enrolled
// //     const fmsg = isEnr ? isEnrolledmsg : canEnrollmsg; //Final message depending upon enrollment status
// //     return(
// //         <div className="row">
// //             <div className="col s12 m6">
// //             <div className="card black">
// //                 <div className="card-content white-text">
// //                 <span className='card-title'>Match Name : {match.id}&emsp;</span><br/>
// //                 <span className='white-text'>Match Date : {match.date}&emsp;</span><br/>
// //                 <span className='white-text'>L.Reg Date : {match.lrdate}&emsp;</span><br/>
// //                 <span className='white-text'>Match Time : {convt(1,match.mtime)}&emsp;</span><br/>{/* Converts Time */}
// //                 <span className='white-text'>Players Enrolled : {match.plno}&emsp;</span><br/>
// //                 {fmsg}
// //                 </div>
// //                 <div className="card-action">
// //                     <Link className="white-text" to={link}><button className="waves-effect waves-light btn-small" id={match.id} disabled={!canEnroll || isEnr}>{bttnname}</button></Link>
// //                 </div>
// //             </div>
// //             </div>
// //         </div>
// //     )
// // }

// export default MatchSummary;