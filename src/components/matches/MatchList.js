import React from 'react';
import {connect} from 'react-redux';
import MatchSummary from "./adminMatchSummary";
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import {isinDocs,getCurrentdate} from '../../Functions'


/*
  This Component is used to Pop up a List of Availabe Matches to Select from.
*/


const EnterMatch = (props) =>{
    const {matches,umatches} = props;
    const matchdiv = matches ? matches && matches.map(match =>{//Used to Generate MatchList using ternary operator
       if(match.lrdate<getCurrentdate()){//Hides a Match if its Last Enrollment Date has Passed
         return null;
       }
       let isEnr =  isinDocs(umatches,match.id);//Checks if User has already ENrolled in the match
       return(
           <MatchSummary match={match} loc={"/entermatch/"} isEnr={isEnr}  bttnname={"Enroll"} key={match.id}/>
       )
    }) : <div className="center"><p>Loading Matches...</p><div className="preloader-wrapper big active center">
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
        <div className="white-text">
            <h6 ><b>Available Matches :</b></h6>
            {matchdiv}
        </div>
    )
}

const mapStatetoProps = (state)=>{
    return{
        matches:state.firestore.ordered.Matches,
        umatches:state.firebase.profile.matches
    }
}

export default compose(
    connect(mapStatetoProps),
    firestoreConnect([
        {collection:'Matches'}
    ])
)(EnterMatch);