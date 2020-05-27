import React from 'react';
import EnrPlayersDetails from './EnrPlayersDetails'
import {buildPlayerList} from '../../Functions'
import {useSelector, useDispatch} from 'react-redux'
import MatchSummary from "../Matches/MatchSummary";
import {useFirestoreConnect} from 'react-redux-firebase';
import { showDialog, clearDialog } from '../../store/Actions/UIActions';
import { Button, TextField, Container } from '@material-ui/core';
import { setRoomDetails } from '../../store/Actions/MatchActions';

const RoomDetails = (props)=>{
  const {hChange} = props
  return (<React.Fragment>
    <TextField
          label="Room ID"
          id="roomid"
          name="roomid"
          fullWidth
          type="text"
          onChange={hChange}
        />
        <TextField
          label="Room Password"
          id="roompass"
          fullWidth
          name="roompass"
          type="password"
          onChange={hChange}
        />
  </React.Fragment>)
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
    const cols = ['srno','pubgid','mno','ukills','rank']
    let tableMetadata = {pages:0,psi:0,page:0,count:0 //psi - Player Starting Index, pei - Player Ending Index
      ,ppp:5} //ppp means Player Per Page 
    tableMetadata['pei']=tableMetadata['ppp']
    tableMetadata.pages = Users && (Users.length/tableMetadata.ppp)
    let mplayers = match && match.players
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

    const handleMClick = ()=>{
      props.history.push("/updatematchfacts/"+mid)
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
    : null
    return(
      <React.Fragment>
          <Container>
              {msum}
          {Users && players ? <EnrPlayersDetails mode={match && match.mode} handleChangeRowsPerPage={handleChangeRowsPerPage} handlePageChange={handlePageChange} columns={cols} tableMetadata={tableMetadata} isEditing={false} players={Users && players}/>: null}
          </Container>
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