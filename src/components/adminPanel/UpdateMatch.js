import React from "react";
import {connect} from 'react-redux';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {updateMatch} from '../../store/actions/MatchActions';
import {compdate,getCurrentDate,findinMatches} from '../../Functions';
import Nav from './AdminNav'
import { useState } from "react";

/*
  This Component is used to Update Existing Match 
*/

const UpdateMatch = (props)=>{
    const [state,setState] = useState({
        chkmdate:false,
        chklrdate:false,
        chkmtime:false,
        umdate:null,
        umtime:null,
        ulrdate:null
    })
    const mid = props.match.params.mid;
    let lrdmsg = null;
    const chkexistmatch = ()=>{// Checks if a match is already on the updated Match Date
        const {matches} = props;
        return matches.map(match =>{
            return(match.mdate===state.umdate)
        })
    }
    const handleChkbox = (e)=>{//Updates State with Checkbox Status
        setState({[e.target.id]:e.target.checked})
        lrdmsg = !state.chkmdate || state.chklrdate ? <p className="red-text">Required Field</p> : null ;
    }
    
    const handleChange = (e)=>{
        setState({[e.target.id]:e.target.value});
    }
    const handleSubmit = (e)=>{
        const cds = getCurrentDate();
        e.preventDefault();
        if(!state.chkmdate && !state.chkmtime && !state.chklrdate){//Checks if any update is made or not
            alert("No Updates Made");
            return;
        }
        let mdata = {};
        if(!state.chkmdate || !state.umdate){//Checks Match Date is Updated or Not
            alert("Please Update Match Date")
            return;
        }
        if(!state.chklrdate || !state.ulrdate){
            alert("Please Update Last Registration Date")
            return;
        }
        if(compdate(cds,state.umdate) && compdate(state.ulrdate,state.umdate) && compdate(cds,state.ulrdate)){
            //^Checks if MDate , LRDate and Today's Date are in Order
            if(chkexistmatch().includes(true)){
                alert("Already A Match on Specified Date");
                return;
            }
            mdata['mdate'] = state.umdate;
            if(state.chkmtime && state.umtime) mdata['mtime'] = state.umtime;
            mdata['lrdate'] = state.ulrdate;
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
    const {matches} = props;
    const match = matches && findinMatches(matches,mid)
    return(
        <React.Fragment>
            <Nav/>
            <div className='white-text container'>
                <p>Match : {mid}</p>
                <form onSubmit={handleSubmit}>
                    <label><input type="checkbox" id="chkmdate" onChange={handleChkbox}/><span><b>Date of Match :</b></span></label>
                    <input type="date" defaultValue={match && match.mdate} disabled={!state.chkmdate} className="white-text" id="umdate" onChange={handleChange}/><br/>
                    <label ><input type="checkbox" id="chkmtime" onChange={handleChkbox}/><span><b>Time of Match :</b></span></label>
                    <input type="time" defaultValue={match && match.mtime} disabled={!state.chkmtime} className="white-text" id="umtime" onChange={handleChange}/><br/>
                    <label ><input type="checkbox" id="chklrdate" onChange={handleChkbox}/><span><b>Last Day of Registration :</b>{lrdmsg}</span></label>
                    <input type="date" defaultValue={match && match.lrdate} disabled={!state.chklrdate} className="white-text" id="ulrdate"onChange={handleChange}/><br/>
                    <button id="crnmbttn" disabled={(!state.chkmdate || !state.chklrdate) && !state.chkmtime} className="waves-effect waves-light btn hoverable">Update Match</button>
                </form>
            </div>
        </React.Fragment>
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