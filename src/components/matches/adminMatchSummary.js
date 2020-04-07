import React from 'react';
import {Fragment} from 'react'
import {convt} from '../../Functions';
import { Link } from 'react-router-dom';
/*
  This Component is used to Display the Details of a Match.
  It is like a template which can be used for any list of matches with details
*/

const MatchSummary = (props)=>{
    const {match,loc,bttnname,isEnr,isCan,maxp} = props;//Passed By Calling Component
    const canEnroll = match.plno<parseInt(maxp) ? true : false;//Checks if match is full?
    const link = canEnroll && !isCan && !isEnr ? loc+match.id : window.location.pathname ;// Sets the button link to be the match if cannot enroll sets to current path
    const canEnrollmsg = canEnroll ? null : <div><span className='red-text'><b>Match is Full</b></span><br/></div> ; //Displays a message if Match is Full
    const isEnrolledmsg = isEnr ? <div><span className='green-text'><b>Already Enrolled</b></span><br/></div> : null ;  // Displays a Message if Already Enrolled
    const fmsg = isEnr ? isEnrolledmsg : canEnrollmsg; //Final message depending upon enrollment status
    const canmsg = match.isActive ? null : <Fragment><span className='red-text'>Match has been canceled</span></Fragment>
    return(
        <div className="row">
            <div className="col s12 m6 offset-m3">
            <div className="card black">
                <div className="card-content white-text">
                <span className='card-title'>Match Name : {match.id}&emsp;</span><br/>
                <span className='white-text'>Match Date : {match.mdate}&emsp;</span><br/>
                <span className='white-text'>L.Reg Date : {match.lrdate}&emsp;</span><br/>
                <span className='white-text'>Match Time : {convt(1,match.mtime)}&emsp;</span><br/>{/* Converts Time */}
                <span className='white-text'>Players Enrolled : {match.plno}&emsp;</span><br/>
                {fmsg}
                {canmsg}
                </div>
                <div hidden={!bttnname} className="card-action">
                    <Link className="white-text" to={link}><button className="waves-effect waves-light btn-small" id={match.id} disabled={!canEnroll || isEnr || !match.isActive}>{bttnname}</button></Link>
                </div>
            </div>
            </div>
        </div>
    )
}

export default MatchSummary;