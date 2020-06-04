import React from "react";
import {connect} from 'react-redux';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {updateMatch} from '../../store/Actions/MatchActions';
import {compdate, getCurrentDate, findinMatches} from '../../Functions';
import { useState } from "react";
import { Select, MenuItem, makeStyles, Container, Typography } from "@material-ui/core";

/*
  This Component is used to Update Existing Match 
*/

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

const UpdateMatch = (props)=>{
    const classes = useStyles();
    console.log("X")
    const [state,setState] = useState({
        chkmname:false,
        chkmdate:false,
        chklrdate:false,
        chkmtime:false,
        chkmap:false,
        chkview:false,
        umdate:null,
        umtime:null,
        ulrdate:null,
        umap:'cao',
        uview:'cao',
        up1:null,
        up2:null,
        up3:null,
    })
    const mid = props.match.params.mid;
    const {matches} = props;
    const match = matches && findinMatches(matches,mid)
    React.useEffect(()=>{
        const mz = {}
        mz['uview'] = match && match.mode && match.mode.view
        mz['umap'] = match && match.mode && match.mode.map
        setState({chkmname:false,
            chkmdate:false,
            chklrdate:false,
            chkmtime:false,
            chkmap:false,
            chkview:false,
            umdate:null,
            umtime:null,
            ulrdate:null,
            umap:'cao',
            uview:'cao',
            up1:null,
            up2:null,
            up3:null,...mz})
        console.log(mz)
    },[matches,match])
    //const {view,map} = match && {...match.mode}
    let lrdmsg = null;
    const chkexistmatch = ()=>{// Checks if a match is already on the updated Match Date
        const {matches} = props;
        return matches.map(match =>{
            return(match.date===state.umdate)
        })
    }
    const handleChkbox = (e)=>{//Updates State with Checkbox Status
        setState({...state,[e.target.id]:e.target.checked})
        lrdmsg = !state.chkmdate || state.chklrdate ? <p className="red-text">Required Field</p> : null ;
    }
    
    const handleChange = (e)=>{
        setState({...state,[e.target.id]:e.target.value});
    }
    const handleSubmit = (e)=>{
        const cds = getCurrentDate();
        e.preventDefault();
        if(!state.chkmdate && !state.chkmtime && !state.chklrdate && !state.chkmap && !state.chkview){//Checks if any update is made or not
            alert("No Updates Made");
            return;
        }
        let mdata = {};
        if(compdate(cds,state.umdate) && compdate(state.ulrdate,state.umdate) && compdate(cds,state.ulrdate)){
            //^Checks if MDate , LRDate and Today's Date are in Order
            if(chkexistmatch().includes(true)){
                alert("Already A Match on Specified Date");
                return;
            }
            mdata['mdate'] = state.chkmdate ? state.umdate : match.ddate;
            mdata['mtime'] = state.chkmtime && state.umtime ?  state.umtime : match.mtime;
            mdata['lrdate'] = state.ulrdate ?  state.ulrdate : match.lrdate;
            let moddata = match.mode
            moddata['map'] = state.chkmap && state.umap!=='cao' ? state.umap : moddata.map
            moddata['view'] = state.chkmap && state.uview!=='cao' ? state.uview : moddata.view
            console.log("PData : ", mdata);
            props.updateMatch(mid,mdata);
        }
        else{
            if(!compdate(cds,state.umdate)){
                window.alert("Tournament Date cannot before or be same as Today");
            }
            if(!compdate(state.ulrdate,state.umdate)){
                window.alert("Last Registration Date cannot be after or same as Tournament Date");
            }
            if(!compdate(cds,state.ulrdate)){
                window.alert("Last Registration Date cannot be before same as or Today");
            }
        }
    }
    console.log(state)
    return(
        <div className={classes.rot}>
            <Container className={classes.container}>
                <Typography variant="h5" className={classes.hText}>Match : {mid}</Typography>
                <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="">
                                <label><input type="checkbox" id="chkmname" onChange={handleChkbox}/><span><b>Match Name :</b></span></label>
                                <input type="text" id="uname" disabled={!state.chkmname} defaultValue={match && match.name} className="white-text" onChange={handleChange} />
                            </div>
                            <div>
                                <label><input type="checkbox" id="chkmdate" onChange={handleChkbox}/><span><b>Date of Match :</b></span></label>
                                <input type="date" defaultValue={match && match.date} disabled={!state.chkmdate} className="white-text" id="umdate" onChange={handleChange}/><br/>
                            </div>
                            <div>
                                <label ><input type="checkbox" id="chkmtime" onChange={handleChkbox}/><span><b>Time of Match :</b></span></label>
                                <input type="time" defaultValue={match && match.mtime} disabled={!state.chkmtime} className="white-text" id="umtime" onChange={handleChange}/><br/>
                            </div>
                            <div>
                                <label ><input type="checkbox" id="chklrdate" onChange={handleChkbox}/><span><b>Last Day of Registration :</b>{lrdmsg}</span></label>
                                <input type="date" defaultValue={match && match.lrdate} disabled={!state.chklrdate} className="white-text" id="ulrdate"onChange={handleChange}/><br/>
                            </div>
                        </div>
                        {state.uview && <div className="row">
                            <div className="col s6 white-text">
                                <label id="tag1"><input type="checkbox" id="chkview" onChange={handleChkbox}/><span>Perspective{lrdmsg}</span></label>
                                <div>
                                    <Select
                                        id="uview"
                                        name="uview"
                                        disabled={!state.chkview}
                                        value={state['uview']}
                                        onChange={handleChange}
                                        style={{width:'150px',color:"#ffffff"}}
                                    >
                                        <MenuItem key={""} value={'cao'} disabled>Choose an Option</MenuItem>
                                        {['TPP','FPP'].map(view=>(<MenuItem key={view} value={view}>{view}</MenuItem>))}
                                    </Select>
                                </div>
                            </div>
                            <div className="col s6 white-text">
                                <label id="tag1"><input type="checkbox" id="chkmap" onChange={handleChkbox}/><span>Perspective{lrdmsg}</span></label>
                                <div>
                                    <Select
                                        id="umap"
                                        name="umap"
                                        disabled={!state.chkview}
                                        value={state['umap']}
                                        onChange={handleChange}
                                        style={{width:'150px',color:"#ffffff"}}
                                    >
                                        <MenuItem key={""} value={'cao'} disabled>Choose an Option</MenuItem>
                                        {['Erangel','Miramar','Sanhok','Vikendi'].map(view=>(<MenuItem key={view} value={view}>{view}</MenuItem>))}
                                    </Select>
                                </div>
                            </div>
                            <div>
                                    <label htmlFor="prizes">Prizes</label>
                                    <div className="row">
                                        {["1st","2nd","3rd"].map((pn,ind)=>{
                                        return(
                                            <div key={ind} className="input-field col s4 white-text">
                                            <input id={"prize-"+(ind+1)} className="white-text"  type="number" onChange={handleChange}/>
                                            <label htmlFor={"prize-"+(ind+1)}>{pn+" Prize"}</label>
                                            </div>
                                        )
                                    })}
                            </div>
                    </div>
                        </div>}
                            <button id="crnmbttn" disabled={!state.chkmdate && !state.chklrdate && !state.chkmtime && !state.chkmap && !state.chkview} className="waves-effect waves-light btn hoverable">Update Match</button>
                    </form>
            </Container>
        </div>
    )
}

const mapDispatchtoProps = (dispatch) =>{
    return{
        updateMatch : (mid,match)=>dispatch(updateMatch(mid,match))

    }
}
const mapStatetoProps = (state)=>{
    return{
        matches:state.firestore.ordered.Matches
    }
}

export default compose(
    connect(mapStatetoProps,mapDispatchtoProps),
    firestoreConnect(props =>[
        {collection:'Matches'}
    ])
)(UpdateMatch);