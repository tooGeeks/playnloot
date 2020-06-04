import React from 'react';
import EnrPlayersDetails from './EnrPlayersDetails'
import { connect, useDispatch } from 'react-redux';
import {findinMatches, buildPlayerList} from '../../Functions'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import MatchSummary from "../Matches/MatchSummary";
import {updateFacts,updateWinner} from '../../store/Actions/MatchActions'
import { Button, Container, makeStyles, Grid, TextField, Typography } from '@material-ui/core';
import { showDialog, clearDialog } from '../../store/Actions/UIActions';

const useStyles = makeStyles(theme=>({
  root:{
      display:'flex',
      minHeight:'100vh'
  },
  container:{
      marginTop:theme.spacing(4),
      marginBottom:theme.spacing(9)
  },
  hText:{
      marginTop:theme.spacing(4),
      marginBottom:theme.spacing(2)
  },
  grid:{
    marginTop:theme.spacing(4),
    marginBottom:theme.spacing(4)
  }
}))

const WinnerDetails = (props)=>{
  const {handleChange,team} = props
  const soloDiv = (<Grid container spacing={3}>
    <Grid item xs={7}>
      <TextField
        name="winner_id"
        id="winner_id"
        label="Winner ID"
        type="text"
        onKeyUp={handleChange}
      />
    </Grid>
    <Grid item xs={5}>
      <TextField
        name="winner_kills"
        id="winner_kills"
        label="Winner Kills"
        type="text"
        onKeyUp={handleChange}
      />
    </Grid>
    </Grid>)

  const duoDiv = (<Grid container spacing={3}>
    {['Leader','Mate'].map((idx)=>{
      return(
        <React.Fragment key={idx}>
          <Grid item xs={7}>
            <TextField
              name={idx+"_id"}
              id={idx+"_id"}
              label={idx+" ID"} 
              type="text"
              onKeyUp={handleChange}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              name={idx+"_kills"}
              id={idx+"_kills"}
              label={idx+" Kills"}
              type="text"
              onKeyUp={handleChange}
            />
          </Grid>
        </React.Fragment>
      )
    })}
    </Grid>)

  const squadDiv = (<Grid container spacing={3}>
    {['Leader','Mate1','Mate2','Mate3'].map((idx)=>{
      return(
        <React.Fragment key={idx}>
          <Grid item xs={6}>
            <TextField
              name={idx+"_id"}
              id={idx+"_id"}
              label={idx+" ID"} 
              type="text"
              onKeyUp={handleChange}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              name={idx+"_kills"}
              id={idx+"_kills"}
              label={idx+" Kills"}
              type="text"
              onKeyUp={handleChange}
            />
          </Grid>
        </React.Fragment>
      )
    })}
    </Grid>)

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
    const classes = useStyles();
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
        props.updateWinner({data,mid:mid,team:match.team,unit:unit})
        return
      }
      dispatch(showDialog({title:"Update Winner",content:<WinnerDetails handleChange={hChange} team={match.team} />,actions:<WinnerActions handleClick={hClick} />}))
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
    let uinm = match && users && buildPlayerList(mplayers,users,match.team,cols);
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
    const msum = match && <MatchSummary children maxp='100' match={matches && match}/>
  let playerDetails = users && players ?
  <EnrPlayersDetails team={match.team} getUnit={getUnit} winner={winner} players={users && players} tableMetadata={tableMetadata} handleChangeRowsPerPage={handleChangeRowsPerPage} handlePageChange={handlePageChange} rstate={hdata} bttnname="Update Values" columns={cols} isEditing={true}/>
  : null;
    return(
      <div className={classes.root}>
          <Container className={classes.container}>
            <Typography variant="h4" className={classes.hText}>Match Details</Typography>
              {msum}
              <Grid container spacing={3} className={classes.grid}>
                <Grid item xs={6}>
                  <TextField
                    name="unit"
                    id="unit"
                    label="Kill to Coin Unit"
                    type='number'
                    onChange={handleChange}
                    defaultValue={1}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" color="primary" onClick={()=>updateWinner()}>Update Winner</Button>
                </Grid>
              </Grid>
              {playerDetails}
          </Container>
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