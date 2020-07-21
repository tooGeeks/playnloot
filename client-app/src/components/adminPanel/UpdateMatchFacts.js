import React from 'react';
import EnrPlayersDetails from './EnrPlayersDetails'
import { connect, useDispatch } from 'react-redux';
import {findinMatches, buildPlayerList} from './adminFunctions'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import MatchSummary from '../matches/adminMatchSummary';
import {updateFacts,updateWinner} from '../../store/actions/MatchActions'
import Nav from './AdminNav'
import { Button } from '@material-ui/core';
import { showDialog, clearDialog } from '../../store/actions/uiActions';

const WinnerDetails = (props)=>{
  const {handleChange,team} = props
  const soloDiv = (<div className="row">
    <div className="input-field white-text col s6">
    <input id="winner_id" type="text" className="validate white-text"
     onKeyUp={handleChange}/>
    <label htmlFor="winner_id">Winner ID</label>
    </div>
    <div className="input-field white-text col s6">
    <input id="winner_kills" type="number" className="validate white-text"
     onKeyUp={handleChange}/>
    <label htmlFor="winner_kills">Winner Kills</label>
    </div><br/>
</div>)

  const duoDiv = (<React.Fragment>
    {['Leader','Mate'].map((idx)=>{
      return(
        <div className="row" key={idx}>
      <div className="input-field white-text col s6">
        <input id={idx+"_id"} type="text" className="validate white-text"
         onKeyUp={handleChange}/>
        <label htmlFor="winner_id">{idx} ID</label>
        </div>
        <div className="input-field white-text col s6">
        <input id={idx+"_kills"} type="number" className="validate white-text"
         onKeyUp={handleChange}/>
        <label htmlFor="winner_kills">{idx} Kills</label>
        </div>
      </div>
      )
    })}
  </React.Fragment>)

  const squadDiv = (<React.Fragment>
    {['Leader','Mate1','Mate2','Mate3'].map((idx)=>{
      return(<div className="row" key={idx}>
      <div className="input-field white-text col s6">
        <input id={idx+"_id"} type="text" className="white-text"
         onKeyUp={handleChange}/>
        <label htmlFor="winner_id">{idx} ID</label>
        </div>
        <div className="input-field white-text col s6">
        <input id={idx+"_kills"} type="number" className="validate white-text"
         onKeyUp={handleChange}/>
        <label htmlFor="winner_kills">{idx} Kills</label>
        </div>
      </div>)
    })}
  </React.Fragment>)

    const winnerdiv = (team==="Solo" 
    ? soloDiv: (team==="Duo" ? duoDiv : squadDiv ))
  return(<div>
      {winnerdiv}
  </div>)
}

const WinnerActions = (props)=>{
  const {handleClick} = props;
  return(<>
    <Button color="primary"  onClick={()=>handleClick()}>Update Winner</Button>
  </>)
}

const UpdateMatchFacts = (props)=>{
    const dispatch = useDispatch()
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
      let data = {}
      let hChange = (e)=>{
        if(e.target.id.endsWith("_id")){
          let id = e.target.id.split('_')[0]
          data = {...data,[id]:e.target.value}
        }
        else if(e.target.id.endsWith("_kills")){
          let idk = data[e.target.id.split('_')[0]]
          data={...data,[idk]:e.target.value}
        }
      }
      let hClick = ()=>{
        let mates = ['Mate','Mate1','Mate2','Mate3']
        for(let x in mates){
          if(data[mates[x]]!==undefined) delete data[mates[x]]
        }
        console.log(data)
        dispatch(clearDialog())
        let unit = parseInt(state.unit);
        props.updateWinner({data,mid:mid,mode:match.mode,unit:unit})
        return
      }
      dispatch(showDialog({title:"Update Winner",content:<WinnerDetails handleChange={hChange} team={match.mode.team} />,actions:<WinnerActions handleClick={hClick} />}))
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
    let mplayers = match && match.players
    let uinm = match && users && buildPlayerList(mplayers,users,match.mode,cols);
    let winner = match && match.winner;
    tableMetadata['count'] = uinm && uinm.length
    let players = uinm && uinm.slice(tableMetadata.psi,tableMetadata.pei)
    players && players.sort((a,b)=>{
      return a.rank>b.rank ? -1 : 1;
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
  <EnrPlayersDetails mode={match.mode} getUnit={getUnit} winner={winner} players={users && players} tableMetadata={tableMetadata} handleChangeRowsPerPage={handleChangeRowsPerPage} handlePageChange={handlePageChange} rstate={hdata} bttnname="Update Values" columns={cols} isEditing={true}/>
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
                <div className="col s4">
                  <button className='waves-effect waves-light btn hoverable'  onClick={()=>updateWinner()} >Update Winner</button>
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