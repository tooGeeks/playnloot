import React from 'react';
import MatchSummary from "../matches/adminMatchSummary";
import { compose } from 'redux';
import {cancelMatch} from '../../store/actions/MatchActions';
import { connect, useDispatch } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import Nav from './AdminNav'

const CancelMatch = (props)=>{
    const dispatch = useDispatch();
    const mid = props.match.params.mid;
    const {matches} = props;
    const match = matches && matches[0]
    const handleClick = ()=>{
        let cnf = window.confirm("Are You Sure?")
        if(cnf) dispatch(cancelMatch(mid))
    }
    const matchdiv = match ? <MatchSummary match={matches && match} bttnname="Cancel Match" handleClick={handleClick} maxp='101' isEnr={false}/> : <div className="center"><p>Loading Match Details...</p><div className="preloader-wrapper small active center">
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
        <React.Fragment>
            <Nav/>
            <div className='container white-text'>
                {matchdiv}
            </div>
        </React.Fragment>
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
    firestoreConnect(props => [
        {collection:'Matches',doc:props.match.params.mid}
    ])
)(CancelMatch);