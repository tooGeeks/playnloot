import React from 'react';
import EnrPlayersDetails from './EnrPlayersDetails'
import { connect } from 'react-redux';
import {findinMatches, findinUsers} from '../../Functions'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import MatchSummary from '../matches/adminMatchSummary';
import {updateFacts,updateWinner} from '../../store/actions/MatchActions'
import Nav from './AdminNav'

const UpdateMatchFacts = (props)=>{
    const mid = props.match.params.mid;
    const [state,setState] = React.useState({winner_id:'',unit:1,winner_kills:0});
    const {matches,users} = props;
    const match = matches && findinMatches(matches,mid);
    let tableMetadata = {pages:0,psi:0,page:0,count:0 //psi - Player Starting Index, pei - Player Ending Index
                          ,ppp:5} //ppp means Player Per Page 
    tableMetadata['pei']=tableMetadata['ppp']

    tableMetadata.pages = users && (users.length/tableMetadata.ppp)
    
    const handlePageChange = (nPage)=>{
      return new Promise((resolve,reject)=>{
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

    const getUnit = ()=>{
      return state.unit
    }

    const updateWinner = ()=>{
      let winner_id = state.winner_id;
      let winner_kills = parseInt(state.winner_kills);
      let unit = parseInt(state.unit);
      if(winner_id==='') return null;
      props.updateWinner({pubgid:winner_id,ukills:winner_kills,mid:mid,unit:unit})
    }

    const hdata = (players)=>{
      let list = []
      players.map((pl)=>{
        if(pl.pubgid!==match.winner) list.push(pl)
        return null
      })
      props.updateFacts(list,mid,match.mode);
    }

    const handleChange = (e)=>{
      e.preventDefault();
      setState({...state,[e.target.id]:e.target.value})
    }

    const cols = ['srno','pubgid','mno','ukills','coins','wallet','rank'] 
    var ind = 1;
    let mplayers = match && match.players
    let pljson = {}
    let uinm = []
    for(let x in mplayers){
      let mpkarr = Object.keys(mplayers[x])
      let ldr = users && findinUsers(users,x)
      var ux = {};
        // eslint-disable-next-line no-loop-func
      ldr && users && cols.map(cl=>{
          return  cl==='srno' ? (match.mode==="Solo" ?ux[cl]=ind++ : ux[cl]=ind ) : (cl==='pubgid' && match.mode!=="Solo" ? ux[cl]=ldr[cl]+"'s Team" : ux[cl]=ldr[cl])
      })
      ux['id']=ldr && ldr['id']
      let ldruk = match.mode==="Solo" ? mplayers[x] : mplayers[x][x]
      ux['ukills'] = ldruk
      ux['kills']=ldr && ldr['kills']
      ux['kills'] = ux['kills'] - ux['ukills']
      ux['coins']=0
      ux['rank']=0
      ux['looted']=ldr && ldr['looted']
      if(match.mode!=="Solo"){
        let alp = ['a','b','c','d']
        let mates = 
        users && mpkarr.map(mpk=>users && findinUsers(users,mpk))
        let matex = []
          // eslint-disable-next-line no-loop-func
          mates && users && mates.forEach((mate,sinx)=>{
            let sindx = 1
            if(mates && mate && mate.pubgid===x) {sindx++;return;}
            let mx = {}
            mates && mate && cols.map(cl=>{
              return  cl==='srno' ? mx[cl]=(ind)+(match.mode==="Duo"?alp[sindx++]:alp[sinx]) : mx[cl]=mate[cl]
            })
            mx['ukills'] = mate && mplayers && mplayers[x][mate.pubgid]
            mx['kills'] = mx['kills'] - mx['ukills']
            mx['id']= mate['id']
            mx['ldr']=x
            mx['coins']=0
            mx['looted']=mate['looted']
            matex.push(mx)
          })
          ind++
        uinm.push(...matex)
      }
      uinm.push({...ux})
      pljson = {...pljson,[x]:mplayers[x][mpkarr[0]]+mplayers[x][mpkarr[1]]}
    }
    let winner = match && match.winner;
    tableMetadata['count'] = uinm && uinm.length
    let players = uinm.slice(tableMetadata.psi,tableMetadata.pei)
    players.sort((a,b)=>{
      return a.ukills>b.ukills ? -1 : 1;
    })
    /**
    let rnk = 1
    for(let x in players){
      if(players[x].ldr===undefined) players[x].rank = rnk++
    }
    */
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

  let playerDetails = users && players ?
  <EnrPlayersDetails getUnit={getUnit} winner={winner} players={users && players} tableMetadata={tableMetadata} handleChangeRowsPerPage={handleChangeRowsPerPage} handlePageChange={handlePageChange} rstate={hdata} bttnname="Update Values" columns={cols} isEditing={true}/>
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
                  <input id="unit" type="number" className="validate white-text"
                   onKeyUp={handleChange} defaultValue='1' autoFocus={true}/>
                  <label htmlFor="unit">Kill to Coin Unit</label>
                </div>
                <div className="input-field white-text col s4">
                  <input id="winner_id" type="text" className="validate white-text"
                   onKeyUp={handleChange}/>
                  <label htmlFor="winner_id">Winner ID</label>
                </div>
                <div className="input-field white-text col s4">
                  <input id="winner_kills" type="number" className="validate white-text"
                   onKeyUp={handleChange}/>
                  <label htmlFor="winner_kills">Winner Kills</label>
                </div><br/>
                <div className="col s4">
                  <button className='waves-effect waves-light btn hoverable' disabled={!state.winner_id || !state.winner_kills} onClick={updateWinner}>Update Winner</button>
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
      updateFacts:(players,mid,mode)=>dispatch(updateFacts(players,mid,mode)),
      updateWinner:(winner)=>dispatch(updateWinner(winner))
    }
}

export default compose(
    connect(mapStatetoProps,mapDispatchtoProps),
    firestoreConnect(props=>[
      {collection:'Matches',doc:props.match.params.mid},
      {collection:'Users',where:['matches','array-contains',props.match.params.mid]}
    ])
)(UpdateMatchFacts)