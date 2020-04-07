import React from "react";
import {connect} from 'react-redux';
import MatchSummary from "../matches/adminMatchSummary";
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import { Helmet } from 'react-helmet';

/*
  This Component is Admin Home
*/

const AdminHome = (props)=>{
  const {matches} = props;
  const matchdiv = matches ? matches && matches.map(match =>{//Used to Generate MatchList using ternary operator
     return(
         <MatchSummary maxp='101' isCan={!match.isActive} match={match} loc={"/admin/matchdetails/"} isEnr={false}  bttnname={"View Details  "} key={match.id}/>
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
      </div>
    </div>;
  return(
  <React.Fragment>
    <Helmet>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    </Helmet>
    <div className="container white-text">
      <h3>Welcom Back, Admin</h3>
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