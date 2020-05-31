import React from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import MatchSummary from "../matches/adminMatchSummary";
import {getCurrentDate} from './adminFunctions'
import Nav from './AdminNav'

const CancelMatchList = (props)=>{
    const handleClick = (mid)=>{
        props.history.push("/admin/cancelmatch/"+mid)
    }
    const {matches} = props;
        return(
            <React.Fragment>
                <Nav/>
                <div className="container">
                    {matches && matches.map(match =>{
                        if(match.date<getCurrentDate()){//Hides a Match if its Match Date has Passed
                            return null;
                        }
                            return(
                                <MatchSummary maxp='101' isCan={!match.isActive} match={match} handleClick={handleClick}  bttnname={"Select"} key={match.id}/>
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
)(CancelMatchList);