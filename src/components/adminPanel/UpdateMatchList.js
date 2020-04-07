import React from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import MatchSummary from "../matches/adminMatchSummary";
import Nav from './AdminNav'

const UpdateMatchList = (props)=>{
    const {matches} = props;
        return(
            <React.Fragment>
                <Nav/>
                <div className="container">
                    {matches && matches.map(match =>{
                            return(
                                <MatchSummary maxp='101' isCan={!match.isActive} match={match} loc={"/admin/updatematch/"} bttnname={"Select"} key={match.id}/>
                            )
                        })}
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
)(UpdateMatchList);