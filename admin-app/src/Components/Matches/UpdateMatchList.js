import React from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import MatchSummary from "../Matches/MatchSummary";

const UpdateMatchList = (props)=>{
    const {matches} = props;
    const handleClick = (mid)=>{
        props.history.push("/updatematch/"+mid)
    }
        return(
            <React.Fragment>
                <div className="container">
                    {matches && matches.map(match =>{
                            return(
                                <MatchSummary maxp='100' isCan={!match.isActive} match={match} handleClick={handleClick}  bttnname={"Select"} key={match.id}/>
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