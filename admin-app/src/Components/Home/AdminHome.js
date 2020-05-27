import React from "react";
import {connect} from 'react-redux';
import MatchSummary from "../Matches/MatchSummary";
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import { Typography } from "@material-ui/core";

/*
  This Component is Admin Home
*/

const AdminHome = (props)=>{
  const {matches} = props;
  const handleClick = (mid)=>{
    props.history.push("/matchdetails/"+mid)
  }
  const matchdiv = matches ? matches && matches.map(match =>{//Used to Generate MatchList using ternary operator
     return(
         <MatchSummary maxp='101' isCan={!match.isActive} match={match} handleClick={handleClick} isEnr={false}  bttnname={"View Details  "} key={match.id}/>
     )
  }) : null;
  return(
  <React.Fragment>
    <div className="container white-text">
      <Typography style={{marginTop:'25px',marginBottom:'25px'}} variant="h4">Welcome Back, Admin</Typography>
      {matchdiv}
    </div>
  </React.Fragment>
  )
}

const mapStatetoProps = (state)=>{
    return{
        matches:state.firestore.ordered.Matches
    }
}

export default compose(
    connect(mapStatetoProps),
    firestoreConnect([
        {collection:'Matches'}
    ])
)(AdminHome);