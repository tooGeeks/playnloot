import React,{useEffect} from 'react';
import MatchSummary from "../matches/adminMatchSummary";
import { compose } from 'redux';
import {cancelMatch} from '../../store/actions/MatchActions';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import {findinMatches} from '../../Functions';

const CancelMatch = (props)=>{
    const mid = props.match.params.mid;
    const bln = (props.match.params.bln === 'true');
    const {matches} = props;
    const match = matches && findinMatches(matches,mid);
    console.log(match);
    useEffect(()=>{
        if(bln && matches && match.isActive){
            console.log("Deleting Match");
            props.cancelMatch(mid)
        }
    })
    const matchdiv = match ? <MatchSummary match={matches && match} bttnname="Cancel Match" loc={"/admin/cancelmatch/true/"} maxp='101' isEnr={false}/> : <div className="center"><p>Loading Match Details...</p><div className="preloader-wrapper small active center">
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
        <div className='container white-text'>
            {matchdiv}
        </div>
    )
}

const mapDispatchtoProps = (dispatch) =>{
    return{
        cancelMatch : (mid)=>dispatch(cancelMatch(mid))

    }
}
const mapStatetoProps = (state)=>{
    return{
        matches:state.firestore.ordered.Matches
    }
}

export default compose(
    connect(mapStatetoProps,mapDispatchtoProps),
    firestoreConnect([
        {collection:'Matches'}
    ])
)(CancelMatch);