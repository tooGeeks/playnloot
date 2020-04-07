import React from 'react';
import EnrPlayersDetails from './EnrPlayersDetails'
import { connect } from 'react-redux';
import {findinMatches,isPlayerinMatch} from '../../Functions'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import MatchSummary from '../MatchSummary';
import {updateFacts} from '../../Store/Actions/MatchActions'

const UpdateMatchFacts = (props)=>{
    const mid = props.match.params.mid;
    const {matches,users} = props;
    const match = matches && findinMatches(matches,mid);
    let uinm = [];

    function getPlayerfromMatch(plist,pid){
      return plist.find((pl)=>{
        var pk = Object.keys(pl)[0];
        console.log(pk);
        return pk===pid;
      })
    }

    users && users.map(user=>{
        if(isPlayerinMatch(match.players,user.pubgid)){
          var xm = getPlayerfromMatch(match.players,user.pubgid)
          console.log("XM : "+JSON.stringify(xm));
          var px = xm[user.pubgid];
          uinm.push({...user,ukills:parseInt(px.split('-')[0]),uwallet:parseInt(px.split('-')[0])*5,rank:parseInt(px.split('-')[1])})

        }
        return user
    })
    const hdata = (players)=>{
      let x = props.updateFacts(players,mid);
      if(!x) props.history.push('/admin/matchdetails/'+mid);
      
      
  }
    const msum = match ? <MatchSummary maxp='101' match={matches && match}/> : <div className="center"><p>Loading Match Details...</p><div className="preloader-wrapper small active center">
    <div className="spinner-layer spinner-blue-only">
      <div className="circle-clipper left">
        <div className="circle"></div>
      </div><div className="gap-patch">
        <div className="circle"></div>
      </div><div className="circle-clipper right">
        <div className="circle"></div>
      </div>
    </div>
  </div></div>
    return(
        <div className="container white-text center">
            {msum}
            <EnrPlayersDetails players={users && uinm} rstate={hdata} bttnname="Update Values" columns={['pubgid','mno','kills','wallet','rank']} isEditing={true} colValues={{pubgid:'PUBG ID',mno:'WhatsApp No.',kills:'Kills Before Match',wallet:"Wallet Amount",rank:"Rank"}}/>
        </div>
    )
}

const mapStatetoProps = (state)=>{
    return{
        matches:state.firestore.ordered.Matches,
        users:state.firestore.ordered.Users
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
      updateFacts:(players,mid)=>dispatch(updateFacts(players,mid))
    }
}

export default compose(
    connect(mapStatetoProps,mapDispatchtoProps),
    firestoreConnect([
        {collection:'Matches'},
        {collection:'Users'}
    ])
)(UpdateMatchFacts)