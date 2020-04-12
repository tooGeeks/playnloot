import React from 'react';
import EnrPlayersDetails from './EnrPlayersDetails'
import { connect } from 'react-redux';
import {findinMatches,getPlayerfromMatch,matchStr} from '../../Functions'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import MatchSummary from '../matches/adminMatchSummary';
import {updateFacts} from '../../store/actions/MatchActions'
import Nav from './AdminNav'
import { TextField } from '@material-ui/core';

const UpdateMatchFacts = (props)=>{
    const mid = props.match.params.mid;
    const [state,setState] = React.useState({searchText:''});
    const {matches,users} = props;
    const match = matches && findinMatches(matches,mid);
    let tableMetadata = {pages:0,psi:0,page:0,count:0 //psi - Player Starting Index, pei - Player Ending Index
                          ,ppp:5} //ppp means Player Per Page 
    tableMetadata['pei']=tableMetadata['ppp']
    let uinm = [];

    tableMetadata.pages = users && (users.length/tableMetadata.ppp)
    
    const handlePageChange = (nPage)=>{
      return new Promise((resolve,reject)=>{
        console.log(tableMetadata['pages'])
        if(nPage>tableMetadata.page && nPage<tableMetadata['pages']){
          let pdiff = nPage - tableMetadata['page']
          tableMetadata['psi'] = tableMetadata['psi'] + pdiff * tableMetadata['ppp']
          tableMetadata['pei'] = tableMetadata['pei'] + pdiff * tableMetadata['ppp']
          tableMetadata['page'] += pdiff
          players = uinm.slice(tableMetadata.psi,tableMetadata.pei)
          resolve({players,tableMetadata})
        }else if(nPage<tableMetadata.page && nPage>=0){
          let pdiff = tableMetadata['page'] - nPage
          tableMetadata['psi'] = tableMetadata['psi'] - pdiff * tableMetadata['ppp']
          tableMetadata['pei'] = tableMetadata['pei'] - pdiff * tableMetadata['ppp']
          tableMetadata['page'] -= pdiff
          players = uinm.slice(tableMetadata.psi,tableMetadata.pei)
          resolve({players,tableMetadata})
        }
      })
    }

    const handleChangeRowsPerPage = (nrpp)=>{
      return new Promise((resolve,reject)=>{
        tableMetadata['ppp']=nrpp;
        tableMetadata['pei']=tableMetadata['psi']+nrpp;
        tableMetadata['pages'] = users && (users.length/tableMetadata.ppp)
        players = uinm.slice(tableMetadata.psi,tableMetadata.pei)
        resolve({players,tableMetadata})
      })
    }

    const findPlayer = ()=>{
      let text = state.searchText
      if(text==='') return null;
      let np = []
      players.map((pl)=>{
        if(matchStr(pl.pubgid,'*'+text+'*')){
          np.push(pl.pubgid)
        }
        return pl.pubgid
      })
      console.log(np)
      
      return np
    }

    const hdata = (players)=>{
      props.updateFacts(players,mid);
    }

    const handleChange = (e)=>{
      e.preventDefault();
      setState({searchText:e.target.value})
    }

    const cols = ['srno','pubgid','mno','ukills','wallet']
    var ind = 1;
    users && users.map((user)=>{
      var px = match && getPlayerfromMatch(match.players,user.pubgid)
      var ux = {};
      cols.map(cl=>{
        return  cl==='srno' ? ux[cl]=ind++ : ux[cl]=user[cl]
      })
      px && uinm.push({...ux,id:user.id,ukills:parseInt(px)})
      return user
    })
    tableMetadata['count'] = uinm && uinm.length
    let players = uinm.slice(tableMetadata.psi,tableMetadata.pei)

    const msum = match ? <MatchSummary maxp='101' match={matches && match}/> 
    : <div className="center"><p>Loading Match Details...</p><div className="preloader-wrapper small active center">
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

  let playerDetails = users ?
  <EnrPlayersDetails players={users && players} tableMetadata={tableMetadata} handleChangeRowsPerPage={handleChangeRowsPerPage} handlePageChange={handlePageChange} rstate={hdata} bttnname="Update Values" columns={cols} isEditing={true}/>
  : <div className="center"><p>Loading Player Details...</p><div className="preloader-wrapper small active center">
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
      <React.Fragment>
          <Nav/>
          <div className="container white-text">
              {msum}
              {users ? <div className="row">
                <div className="input-field white-text col s4">
                  <input id="winner_id" type="text" className="validate white-text"
                   onKeyUp={handleChange}/>
                  <label htmlFor="last_name">Winner ID</label>
                </div><br/>
                <div className="col s4">
                  <button className='waves-effect waves-light btn hoverable' onClick={findPlayer}>Search Player</button>
                </div>
              </div> : null }<br/><br/>
              {playerDetails}
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

const mapDispatchtoProps = (dispatch)=>{
    return{
      updateFacts:(players,mid)=>dispatch(updateFacts(players,mid))
    }
}

export default compose(
    connect(mapStatetoProps,mapDispatchtoProps),
    firestoreConnect(props=>[
      {collection:'Matches',doc:props.match.params.mid},
      {collection:'Users',where:['matches','array-contains',props.match.params.mid]}
    ])
)(UpdateMatchFacts)