import React,{Component} from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import MatchSummary from "../matches/MatchSummary";
import Nav from './AdminNav'

class UpdateMatchList extends Component{
    render(){
        const {matches} = this.props;
        return(
        <div>
            {matches && matches.map(match =>{
                    return(
                        <React.Fragment>
                            <Nav />
                            <MatchSummary match={match} loc={"/admin/updatematch/"} bttnname={"Select"} key={match.id}/>
                        </React.Fragment>
                    )
                })}
        </div>
        )
    }
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