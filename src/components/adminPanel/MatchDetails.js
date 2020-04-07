import React from 'react';
import EnrPlayersDetails from './EnrPlayersDetails'
import { connect } from 'react-redux';
import {findinMatches,isPlayerinMatch} from '../../Functions'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import MatchSummary from '../matches/adminMatchSummary';
import Nav from './AdminNav'

const MatchDetails = (props)=>{
    const mid = props.match.params.mid;
    const {matches,users} = props;
    const match = matches && findinMatches(matches,mid);
    let uinm = [];
    users && users.map(user=>{
        if(isPlayerinMatch(match.players,user.pubgid)) uinm.push(user)
        return user
    })
    const msum = match ? <MatchSummary match={matches && match} maxp={101} bttnname="Update Facts" loc="/admin/updatematchfacts/" /> : <div className="center"><p>Loading Match Details...</p><div className="preloader-wrapper small active center">
    <div className="spinner-layer spinner-blue-only">
      <div className="circle-clipper left">
        <div className="circle"></div>
      </div><div className="gap-patch">
        <div className="circle"></div>
      </div><div className="circle-clipper right">
        <div className="circle"></div>
      </div>
    </div>
  </div></div>;
  const stl = {
    paddingBottom : 120
  };
    return(
      <React.Fragment>
          <Nav/>
          <div className="container white-text">
              {msum}
          </div>
          <div className="container"  style={stl}>
          <EnrPlayersDetails columns={['pubgid','mno','kills']} isEditing={false} colValues={{pubgid:'PUBG ID',mno:'WhatsApp No.',kills:'Kills'}} players={users && uinm}/>
          </div>
      </React.Fragment>
    ) 
}

const mapStatetoProps = (state)=>{
    return{
        matches:state.firestore.ordered.Matches,
        users:state.firestore.ordered.Users
    }
}

export default compose(
    connect(mapStatetoProps),
    firestoreConnect([
        {collection:'Matches'},
        {collection:'Users'}
    ])
)(MatchDetails)