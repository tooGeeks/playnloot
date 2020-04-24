import React from "react";
import { createMatch } from '../../store/actions/MatchActions';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import {compdate,getCurrentDate} from '../../Functions';
import Nav from './AdminNav'
import { Select, MenuItem } from "@material-ui/core";

/*
  This Component is used to Create a New Match
*/

const CreateMatch = (props)=>{
    const [state,setState] = React.useState({
        name:'',
        mdate:'',
        mtime:'',
        lrdate:'',
        mode: 'cao',
        deftag:'cao',
        tags:''
    })
    const handleChange = (e)=>{
        if(e.target.id!==undefined) setState({...state,[e.target.id]:e.target.value});
        else setState({...state,[e.target.name]:e.target.value});
    }
    
    const chkexistmatch = ()=>{//checks if already a match is scheduled on specified date
        const {matches} = props;
        return matches.map(match =>{
            return(match.mdate===state.mdate)
        })
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        const cds = getCurrentDate();
        const mdt = state.mdate;
        const ldt = state.lrdate;
        const mti = state.mtime
        const mode = state.mode
        const deftag = state.deftag
        if(mti===undefined){
            alert("Please Specify the Match Time")
            return;
        }
        if(mode==='cao'){
            alert("Please Specify the Match Mode")
            return;
        }
        if(deftag==='cao'){
            alert("Please Specify the Match Platform")
            return;
        }
        if(compdate(cds,mdt) && compdate(ldt,mdt) && compdate(cds,ldt)){//checks that match date, last enrollment date and today's date are in order
            if(chkexistmatch().includes(true)){
                alert("Already A Match on Specified Date");
                return;
            }
            props.createMatch(state);
        }
        else{
            if(!compdate(cds,mdt)){
                window.alert("Tournament Date cannot before or be same as Today");
            }
            if(!compdate(ldt,mdt)){
                window.alert("Last Registration Date cannot be after or same as Tournament Date");
            }
            if(!compdate(cds,ldt)){
                window.alert("Last Registration Date cannot be before same as or Today");
            }
        }
    }
    return(
        <React.Fragment>
            <Nav/>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="row"><br/>
                        <div className="input-field">
                            <input type="text" id="name" className="white-text" onChange={handleChange} />
                            <label>Match Name</label>
                        </div>
                        <div>
                            <label ><b>Date of Match :</b></label>
                            <input type="date" className="white-text" id="mdate" onChange={handleChange}/><br/>
                        </div>
                        <div>
                            <label ><b>Time of Match :</b></label>
                            <input type="time" className="white-text" id="mtime" onChange={handleChange}/>
                        </div>
                        <div>
                            <label ><b>Last Day of Registration :</b></label>
                            <input type="date" className="white-text" id="lrdate"onChange={handleChange}/><br/>
                        </div>
                    </div>
                    <div className="row">
                        <div className=" col s6 white-text">
                            <label id="modelbl">Select Mode</label>
                                <div>
                                    {state && <Select
                                        id="mode"
                                        name="mode"
                                        value={state.mode}
                                        onChange={handleChange}
                                        style={{width:'150px',color:"#ffffff"}}
                                    >
                                        <MenuItem key={""} value={'cao'} disabled>Choose an Option</MenuItem>
                                        {['Solo','Duo','Squad'].map(mode=>(<MenuItem key={mode} value={mode}>{mode}</MenuItem>))}
                                    </Select>}
                                </div>
                        </div>
                        <div className="col s6 white-text">
                            <label id="tag1">Select Platform</label>
                                <div>
                                    {state && <Select
                                        id="deftag"
                                        name="deftag"
                                        value={state.deftag}
                                        onChange={handleChange}
                                        style={{width:'150px',color:"#ffffff"}}
                                    >
                                        <MenuItem key={""} value={'cao'} disabled>Choose an Option</MenuItem>
                                        {['mobile','emu'].map(deftag=>(<MenuItem key={deftag} value={deftag}>{deftag}</MenuItem>))}
                                    </Select>}
                                </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6 white-text">
                                <input id="tags" className="white-text" defaultValue=""  type="text" onChange={handleChange}/>
                                <label htmlFor="tags">Tags</label>
                            </div>
                            <div className="input-field col s4">
                                <button id="crnmbttn" disabled={!state.name || !state.mdate || !state.mtime || !state.lrdate || state.mode==="cao"} className="waves-effect waves-light btn hoverable">Create Match</button> 
                            </div>
                        </div>
                </form>
            </div>
        </React.Fragment>
    )
}

const mapDispatchtoProps = (dispatch) =>{
    return{
        createMatch : (match)=>dispatch(createMatch(match))

    }
}
const mapStatetoProps = (state)=>{
    return{
        matches:state.firestore.ordered.Matches
    }
}

export default compose(
    connect(mapStatetoProps,mapDispatchtoProps),
    firestoreConnect([
        {collection:'Matches'}
    ])
)(CreateMatch);