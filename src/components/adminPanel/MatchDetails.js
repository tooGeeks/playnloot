import React from 'react';
import EnrPlayersDetails from './EnrPlayersDetails'
import {findinUsers, buildPlayerList} from './adminFunctions'
import {useSelector, useDispatch} from 'react-redux'
import MatchSummary from '../matches/adminMatchSummary'
import Nav from './AdminNav'
import {useFirestoreConnect} from 'react-redux-firebase'
import { showDialog, clearDialog } from '../../store/actions/uiActions';
import { Button } from '@material-ui/core';
import { setRoomDetails } from '../../store/actions/MatchActions';

const RoomDetails = (props)=>{
  const {hChange} = props
  return (<div>
      <div className='white-text'>
        <div className="input-field white-text col s4">
          <input id="roomid" type="text" className="validate white-text"
           autoFocus={true} onChange={hChange}/>
          <label htmlFor="roomid">Room ID</label>
        </div>
        <div className="input-field white-text col s4">
          <input id="roompass" type="password" className="validate white-text"
          onChange={hChange}/>
          <label htmlFor="roompass">Room Password</label>
        </div>
      </div>
  </div>)
}



const RoomActions = (props)=>{
  const {hClick} = props
  return(<>
    <Button color="primary"  onClick={()=>hClick()}>Set</Button>
  </>)
}

const MatchDetails = (props)=>{
  const mid = props.match.params.mid;
  const dispatch = useDispatch()
  useFirestoreConnect([{collection:"Matches",doc:mid},{collection:"Users",where:['matches','array-contains',mid]}])
  const {Matches} = useSelector(state =>state.firestore.ordered)
  const {Users} = useSelector(state =>state.firestore.ordered)
    const match = Matches && Matches[0]
    console.log(match)
    const cols = ['srno','pubgid','mno','ukills','rank']
    let tableMetadata = {pages:0,psi:0,page:0,count:0 //psi - Player Starting Index, pei - Player Ending Index
      ,ppp:5} //ppp means Player Per Page 
    tableMetadata['pei']=tableMetadata['ppp']
    tableMetadata.pages = Users && (Users.length/tableMetadata.ppp)
    let ind = 1
    let mplayers = match && match.players
    let pljson = {}
    let uinm = match && Users && buildPlayerList(mplayers,Users,match.mode,cols)
    /**
    let uinm = Users && Users.map(user=>{
        var px = match && getPlayerfromMatch(pljson,user.pubgid,match.mode)
        console.log(px)
        var ux = {};
        cols.map(cl=>{
          return  cl==='srno' ? ux[cl]=ind++ : ux[cl]=user[cl]
        })
        return {...ux,ukills:parseInt(px)}
    }) */
    tableMetadata['count'] = uinm && uinm.length
    let players = uinm && uinm.slice(tableMetadata.psi,tableMetadata.pei)
    if(players && players.length>0 && players[0].rank===undefined){
      for(let x in players){
        players[x].rank = 0
      }
    }

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

    const handleMClick = ()=>{
      props.history.push("/admin/updatematchfacts/"+mid)
    }
    const handleMClick2 = (mid)=>{
      console.log(mid)
      let data = {}
      const hChange = (e)=>{
        data={...data,[e.target.id]:e.target.value}
      }
      const hClick = ()=>{
        //console.log(data)
        dispatch(clearDialog())
        dispatch(setRoomDetails(match.id,data))
        return;
      }
      dispatch(showDialog({title:"Enter Room ID & Password",content:<RoomDetails hChange={hChange}/>,actions:<RoomActions hClick={hClick}/>}))
    
    }
    const msum = match ? <MatchSummary match={Matches && match} handleClick={handleMClick} handleClick2={handleMClick2} bttnname2="Assign Room ID/Pass" maxp={101} bttnname="Update Facts"/> 
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
          {Users && players ? <EnrPlayersDetails mode={match && match.mode} handleChangeRowsPerPage={handleChangeRowsPerPage} handlePageChange={handlePageChange} columns={cols} tableMetadata={tableMetadata} isEditing={false} players={Users && players}/> : loadCircle}
          </div>
      </React.Fragment>
    ) 
}


export default MatchDetails

/**
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
)(MatchDetails) */