import React from 'react';
import {connect} from 'react-redux';
import {getCurrentdate} from '../../Functions';
import {Link} from 'react-router-dom';

/*
  This Component is used to display list of Matches in which User has enrolled
*/

const EnrolledMatches = (props)=>{
    const {umatches} = props;//umatches - User Matches
    //    matchdiv uses ternary operator to map user enrolled matches in all available matches
    const matchdiv = umatches ? umatches && umatches.map(match =>{
        if(match.lrdate<getCurrentdate()){
          return null;
        }
        return(
            <li className="collection-item black white-text" key={match}><div><span>Match Name : {match}</span><Link className="secondary-item" to={"/entermatch/"+match}><button className="waves-effect waves-light hoverable btn-small">Details</button></Link></div></li>
        )
     }) : <div className="center"><p>Loading Matches...</p><div className="preloader-wrapper active center">
     <div className="spinner-layer spinner-blue-only">
       <div className="circle-clipper left">
         <div className="circle"></div>
       </div><div className="gap-patch">
         <div className="circle"></div>
       </div><div className="circle-clipper right">
         <div className="circle"></div>
       </div>
     </div>
   </div></div> ;
    return(
        <div className="container">
            <ul className="collection with-header">
                <li className="collection-header black white-text">Enrolled Matches</li>
                {matchdiv}
            </ul>
        </div>
    )
}

const mapStatetoProps = (state)=>{
    return{
        umatches:state.firebase.profile.matches
    }
}

export default connect(mapStatetoProps)(EnrolledMatches)