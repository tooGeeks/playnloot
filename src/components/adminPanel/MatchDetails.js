import React from 'react';
import EnrPlayersDetails from './EnrPlayersDetails'
import { connect } from 'react-redux';
import {findinMatches,getPlayerfromMatch} from '../../Functions'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import MatchSummary from '../matches/adminMatchSummary';
import Nav from './AdminNav'

const MatchDetails = (props)=>{
    const mid = props.match.params.mid;
    const {matches,users} = props;
    const match = matches && findinMatches(matches,mid);
    const cols = ['srno','pubgid','mno','ukills','rank'] 
    let tableMetadata = {pages:0,psi:0,page:0,count:0 //psi - Player Starting Index, pei - Player Ending Index
      ,ppp:1} //ppp means Player Per Page 
    tableMetadata['pei']=tableMetadata['ppp']
    tableMetadata.pages = users && (users.length/tableMetadata.ppp)
    let ind = 1
    let uinm = users && users.map(user=>{
        var px = match && getPlayerfromMatch(match.players,user.pubgid)
        var ux = {};
        cols.map(cl=>{
        return  cl==='srno' ? ux[cl]=ind++ : ux[cl]=user[cl]
      })
        return {...ux,ukills:parseInt(px.split('-')[0]),uwallet:parseInt(px.split('-')[0])*5,rank:parseInt(px.split('-')[1])}
    })
    tableMetadata['count'] = uinm && uinm.length
    let players = uinm && uinm.slice(tableMetadata.psi,tableMetadata.pei)

    const handlePageChange = (nPage)=>{
      return new Promise((resolve,reject)=>{
        if(nPage>tableMetadata.page){
          let pdiff = nPage - tableMetadata['page']
          tableMetadata['psi'] = tableMetadata['psi'] + pdiff * tableMetadata['ppp']
          tableMetadata['pei'] = tableMetadata['pei'] + pdiff * tableMetadata['ppp']
          tableMetadata['page'] += pdiff
          players = uinm.slice(tableMetadata.psi,tableMetadata.pei)
          resolve({players,tableMetadata})
        }else{
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
        players = uinm.slice(tableMetadata.psi,tableMetadata.pei)
        resolve({players,tableMetadata})
      })
    }

    const loadCircle = <div className="center"><p>Loading Match Details...</p><div className="preloader-wrapper small active center">
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

    const msum = match ? <MatchSummary match={matches && match} maxp={101} bttnname="Update Facts" loc="/admin/updatematchfacts/" /> 
    : loadCircle
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
          {users && players ? <EnrPlayersDetails handleChangeRowsPerPage={handleChangeRowsPerPage} handlePageChange={handlePageChange} columns={cols} tableMetadata={tableMetadata} isEditing={false} players={users && players}/> : loadCircle}
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
    firestoreConnect(props => [
        {collection:'Matches',doc:props.match.params.mid},
        {collection:'Users',where:['matches','array-contains',props.match.params.mid]}
    ])
)(MatchDetails)