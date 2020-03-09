import React, { Component } from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {convt,dateString,isinDocs} from '../../Functions';
import {enterMatch} from '../../store/actions/MatchActions';
import {findinMatches} from '../../Functions'

/*
  This Component is used to display the details of match user clicked and allows it to enroll in the match 
  if not enrolled already
*/

class EnterMatch extends Component{
    mid = this.props.match.params.mid;
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.enterMatch(this.mid,this.props.auth.uid);
    }
    render(){
        const {matches,profile} = this.props;
        const match = matches ? findinMatches(matches,this.mid) : null;//Checks if selected match exists in list of matches
        const isCreditSuf = profile.wallet<2 ? false : true ; //Checks if user has sufficient credit to enroll in a match
        const enrcst = "Enrollment will require 2 Coins."
        let players = match && match.players; //fetches list of players enrolled in the selected match
        const isAlRegU = profile.isLoaded && match && isinDocs(profile.matches,match.id); //Returns true if match exists in user's data
        const isAlRegM = match && profile.isLoaded && isinDocs(players,profile.pubgid); //Returns true if user exists in match's data
        const icmsg = !isCreditSuf ?<div hidden={isAlRegU && isAlRegM}><p>{enrcst} You have {profile.wallet} coin in your Wallet</p>
        <p className="red-text pulse">Insufficient Credit. Recharge Your Wallet </p></div> : //if credit is not suuficient shows a warning 
        <p hidden={isAlRegU && isAlRegM}>{enrcst} You have {profile.wallet} coins in your Wallet</p> ;//shows no. of coins user has
        const matchmsg = null;
        const almsg = isAlRegU && isAlRegM ? //Shows a green text message if user is already enrolled
        <h4 className="green-text pulse">Already Enrolled</h4> : null;
        const smsg = matches ? <div>{matchmsg}{almsg}{icmsg}
        <span className="card-title">Match : {match && match.id}</span><br/>
        <span>Last Enrollment Date : {match && dateString(match.lrdate)}</span><br/>
        <span>Match Date : {match && dateString(match.mdate)}</span><br/>
        <span>Match Time : {match && convt(1,match.mtime)}</span><br/></div> : <div className="center"><p>Loading...</p>
    <div className="preloader-wrapper big active">
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
    </div> ;
        return(
            <div className="center-page">
            <div className="row">
                    <div className="col s12 m6">
                        <div className="card black hoverable white-text">
                        <form onSubmit={this.handleSubmit}>
                            <div className="card-content white-text">
                                {smsg}
                            </div>
                            <div className="card-action">
                                <button className="waves-effect waves-light btn" disabled={!isCreditSuf || isAlRegU || isAlRegM}>Confirm Enrollment</button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStatetoProps = (state)=>{
    return{
        auth:state.firebase.auth,
        profile:state.firebase.profile,
        matches:state.firestore.ordered.Matches
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        enterMatch:(mid,uid)=>{dispatch(enterMatch(mid,uid))}
    }
}

export default compose(
    connect(mapStatetoProps,mapDispatchtoProps),
    firestoreConnect([
        {collection:'Matches'}
    ])
)(EnterMatch);