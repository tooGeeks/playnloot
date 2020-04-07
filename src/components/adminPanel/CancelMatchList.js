import React from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import MatchSummary from "../adminMatchSummary";
import {getCurrentDate} from '../../Functions'

const CancelMatchList = (props)=>{
    const {matches} = props;
        return(
        <div className="container">
            {matches && matches.map(match =>{
                if(match.mdate<getCurrentDate()){//Hides a Match if its Match Date has Passed
                    return null;
                }
                    return(
                        <MatchSummary maxp='101' isCan={!match.isActive} match={match} loc={"/admin/cancelmatch/false/"} bttnname={"Select"} key={match.id}/>
                    )
                })}
        </div>
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
)(CancelMatchList);